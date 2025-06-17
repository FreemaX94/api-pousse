
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/deliveries route', () => {
  it('should respond to GET /api/deliveries', async () => {
    const res = await request(app).get('/api/deliveries');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
