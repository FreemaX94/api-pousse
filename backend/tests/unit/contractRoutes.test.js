
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/contract route', () => {
  it('should respond to GET /api/contract', async () => {
    const res = await request(app).get('/api/contract');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
