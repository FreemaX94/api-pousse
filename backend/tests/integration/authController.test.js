const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, setupRoutes } = require('../../app');
const User = require('../../models/userModel');

jest.setTimeout(60000); // ⏱️ Timeout augmenté

describe('AuthController', () => {
  let mongoServer;
  let server;
  let userData;
  let inactiveUser;
  let cookie;
  let refreshToken;
  let userId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      instance: { port: 27017 },
      binary: { version: '6.0.5' },
      autoStart: true
    });

    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    mongoose.models = {};
    mongoose.modelSchemas = {};
    setupRoutes();
    server = app.listen(4001);

    const timestamp = Date.now();

    // 🔴 Crée un user inactif directement en BDD
    const rawInactiveUser = new User({
      username: `inactiveuser_${timestamp}`,
      password: 'Password123',
      isActive: false
    });
    await rawInactiveUser.save();
    inactiveUser = { username: rawInactiveUser.username, password: 'Password123' };

    // 🟢 Utilisateur actif via activation
    userData = { username: `testuser_${timestamp}`, password: 'Password123' };
    await request(app).post('/api/auth/register').send(userData);
    await request(app).post('/api/auth/activate').send({ username: userData.username });

    const loginRes = await request(app).post('/api/auth/login').send(userData);
    cookie = loginRes.headers['set-cookie'][0].split(';')[0];
    refreshToken = loginRes.body.refreshToken;

    const user = await User.findOne({ username: userData.username });
    userId = user._id.toString();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
    if (server && server.close) {
      server.close();
    }
  });

  test('registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'newuser', password: 'Password123' });
    expect(res.statusCode).toBe(201);
  });

  test('activates a user account', async () => {
    const res = await request(app)
      .post('/api/auth/activate')
      .send({ username: 'newuser' });
    expect(res.statusCode).toBe(200);
  });

  test('rejects login if user is not activated', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(inactiveUser);
    expect(res.statusCode).toBe(403);
  });

  test('refreshes token with valid refresh token', async () => {
    expect(refreshToken).toBeDefined();
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  test('returns user info with /me', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', cookie);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe(userData.username);
  });

  test('logs out and clears refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookie);
    expect(res.statusCode).toBe(200);

    const updatedUser = await User.findById(userId);
    expect(updatedUser.refreshToken).toBeNull();
  });

  test('me returns 401 without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });

  test('refresh rejects invalid token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'invalidtoken' });
    expect(res.statusCode).toBe(401);
  });

  test('logout handles unknown user gracefully', async () => {
    const fakeToken = 'Bearer ' + require('jsonwebtoken').sign(
      { id: '000000000000000000000000' },
      process.env.JWT_SECRET || 'dev_secret_key'
    );
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', fakeToken);
    expect(res.statusCode).toBe(401);
  });
});
