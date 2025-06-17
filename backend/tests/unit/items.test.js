
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/items route', () => {
  it('should respond to GET /api/items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
