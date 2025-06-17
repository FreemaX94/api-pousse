
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/events route', () => {
  it('should respond to GET /api/events', async () => {
    const res = await request(app).get('/api/events');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
