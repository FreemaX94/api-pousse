
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/salesOrders route', () => {
  it('should respond to GET /api/salesOrders', async () => {
    const res = await request(app).get('/api/salesOrders');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
