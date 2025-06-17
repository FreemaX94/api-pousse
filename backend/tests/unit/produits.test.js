
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/produits route', () => {
  it('should respond to GET /api/produits', async () => {
    const res = await request(app).get('/api/produits');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
