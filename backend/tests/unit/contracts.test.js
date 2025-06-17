
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/contracts route', () => {
  it('should respond to GET /api/contracts', async () => {
    const res = await request(app).get('/api/contracts');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
