
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/stocks route', () => {
  it('should respond to GET /api/stocks', async () => {
    const res = await request(app).get('/api/stocks');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
