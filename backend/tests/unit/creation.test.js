
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/creation route', () => {
  it('should respond to GET /api/creation', async () => {
    const res = await request(app).get('/api/creation');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
