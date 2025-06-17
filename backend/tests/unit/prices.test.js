
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/prices route', () => {
  it('should respond to GET /api/prices', async () => {
    const res = await request(app).get('/api/prices');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
