
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/entretien route', () => {
  it('should respond to GET /api/entretien', async () => {
    const res = await request(app).get('/api/entretien');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
