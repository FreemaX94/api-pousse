
const request = require('supertest');
const { app } = require('../../../backend/app');

describe('/api/sheetSync route', () => {
  it('should respond to GET /api/sheetSync', async () => {
    const res = await request(app).get('/api/sheetSync');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
