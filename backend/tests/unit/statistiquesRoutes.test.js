
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/statistiques route', () => {
  it('should respond to GET /api/statistiques', async () => {
    const res = await request(app).get('/api/statistiques');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
