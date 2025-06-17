
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/admin route', () => {
  it('should respond to GET /api/admin', async () => {
    const res = await request(app).get('/api/admin');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
