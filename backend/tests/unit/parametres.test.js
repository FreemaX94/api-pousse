
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/parametres route', () => {
  it('should respond to GET /api/parametres', async () => {
    const res = await request(app).get('/api/parametres');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
