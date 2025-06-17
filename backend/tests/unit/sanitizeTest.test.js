
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/sanitizeTest route', () => {
  it('should respond to GET /api/sanitizeTest', async () => {
    const res = await request(app).get('/api/sanitizeTest');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
