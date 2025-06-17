
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/users route', () => {
  it('should respond to GET /api/users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
