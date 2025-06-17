
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/livraisons route', () => {
  it('should respond to GET /api/livraisons', async () => {
    const res = await request(app).get('/api/livraisons');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
