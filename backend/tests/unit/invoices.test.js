
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/invoices route', () => {
  it('should respond to GET /api/invoices', async () => {
    const res = await request(app).get('/api/invoices');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
