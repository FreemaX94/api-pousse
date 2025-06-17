
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/delivery route', () => {
  it('should respond to GET /api/delivery', async () => {
    const res = await request(app).get('/api/delivery');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
