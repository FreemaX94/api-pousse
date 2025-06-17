
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/comptabilite route', () => {
  it('should respond to GET /api/comptabilite', async () => {
    const res = await request(app).get('/api/comptabilite');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
