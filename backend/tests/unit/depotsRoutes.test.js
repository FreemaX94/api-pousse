
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/depots route', () => {
  it('should respond to GET /api/depots', async () => {
    const res = await request(app).get('/api/depots');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
