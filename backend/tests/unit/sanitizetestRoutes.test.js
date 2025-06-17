
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/sanitizetest route', () => {
  it('should respond to GET /api/sanitizetest', async () => {
    const res = await request(app).get('/api/sanitizetest');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
