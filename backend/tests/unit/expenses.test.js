
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/expenses route', () => {
  it('should respond to GET /api/expenses', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
