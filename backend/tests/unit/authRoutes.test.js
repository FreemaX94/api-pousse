
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/auth route', () => {
  it('should respond to GET /api/auth', async () => {
    const res = await request(app).get('/api/auth');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
