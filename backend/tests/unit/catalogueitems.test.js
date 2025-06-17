
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/catalogueitems route', () => {
  it('should respond to GET /api/catalogueitems', async () => {
    const res = await request(app).get('/api/catalogueitems');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
