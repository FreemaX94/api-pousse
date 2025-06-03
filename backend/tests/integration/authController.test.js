const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, setupRoutes } = require('../../app');

// ✅ Fix : Clé secrète pour JWT utilisée dans tous les tests
process.env.JWT_SECRET = 'test-secret';
process.env.MONGOMS_DISTRO = 'ubuntu-22.04';
jest.setTimeout(20000);

let server;
let mongoServer;

beforeAll(async () => {
  setupRoutes(); // Active les routes sur l'app
  mongoServer = await MongoMemoryServer.create({
    binary: { version: '7.0.5' },
    instance: { storageEngine: 'wiredTiger' },
  });
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  server = app.listen(4000); // Lancement serveur de test
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
  if (server) {
    await new Promise(resolve => server.close(resolve)); // Important pour éviter les erreurs Jest
  }
});

describe('AuthController', () => {
  let username;

  beforeEach(() => {
    // Génère un nom unique à chaque test pour éviter les conflits
    username = `testuser_${Date.now()}`;
  });

  test('registers a new user', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username, password: 'password123' });

    expect(res.statusCode).toBe(201);
  });

  test('activates a user account', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username, password: 'password123' });

    const res = await request(server)
      .post('/api/auth/activate')
      .send({ username });

    expect(res.statusCode).toBe(200);
  });

  test('rejects login if user is not activated', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username, password: 'password123' });

    const res = await request(server)
      .post('/api/auth/login')
      .send({ username, password: 'password123' });

    expect(res.statusCode).toBe(403); // utilisateur non activé
  });

  test('refreshes token with valid refresh token', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username, password: 'password123' });

    await request(server)
      .post('/api/auth/activate')
      .send({ username });

    const loginRes = await request(server)
      .post('/api/auth/login')
      .send({ username, password: 'password123' });

    const refreshToken = loginRes.body.refreshToken;

    const res = await request(server)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  test('me returns 401 without token', async () => {
    const res = await request(server).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  }, 10000);
});
