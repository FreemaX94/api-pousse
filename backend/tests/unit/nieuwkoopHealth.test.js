
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/nieuwkoopHealth route', () => {
  it('should respond to GET /api/nieuwkoopHealth', async () => {
    const res = await request(app).get('/api/nieuwkoopHealth');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
