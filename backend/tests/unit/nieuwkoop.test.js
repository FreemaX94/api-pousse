
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/nieuwkoop route', () => {
  it('should respond to GET /api/nieuwkoop', async () => {
    const res = await request(app).get('/api/nieuwkoop');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
