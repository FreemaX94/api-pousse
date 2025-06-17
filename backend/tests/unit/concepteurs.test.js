
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/concepteurs route', () => {
  it('should respond to GET /api/concepteurs', async () => {
    const res = await request(app).get('/api/concepteurs');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
