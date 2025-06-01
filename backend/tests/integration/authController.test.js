const request = require('supertest');
const mongoose = require('mongoose');
const { app, setupRoutes } = require('../../app');

let server;

beforeAll(async () => {
  setupRoutes();
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/api-pousse-test');
  server = app.listen(4000);
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.close();
});

describe('AuthController', () => {
  const userData = {
    username: 'testuser',
    password: 'password123'
  };

  test('registers a new user', async () => {
    const res = await request(server).post('/api/auth/register').send(userData);
    expect(res.statusCode).toBe(201);
  });

  test('activates a user account', async () => {
    await request(server).post('/api/auth/register').send(userData);
    const res = await request(server).post('/api/auth/activate').send({ username: userData.username });
    expect(res.statusCode).toBe(200);
  });

  test('rejects login if user is not activated', async () => {
    await request(server).post('/api/auth/register').send(userData);
    const res = await request(server).post('/api/auth/login').send(userData);
    expect(res.statusCode).toBe(403); // utilisateur non activé
  });

  test('refreshes token with valid refresh token', async () => {
    await request(server).post('/api/auth/register').send(userData);
    await request(server).post('/api/auth/activate').send({ username: userData.username });
    const loginRes = await request(server).post('/api/auth/login').send(userData);
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