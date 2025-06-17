const express = require('express');
const request = require('supertest');

const app = express();

// ✅ Simulation de la route /api/vehicles
app.get('/api/vehicles', (req, res) => {
  res.status(200).json([
    { id: 'v1', licensePlate: 'AB-123-CD', model: 'Kangoo' },
    { id: 'v2', licensePlate: 'XY-456-ZZ', model: 'Berlingo' }
  ]);
});

describe('/api/vehicles route (mock)', () => {
  it('should respond to GET /api/vehicles', async () => {
    const res = await request(app).get('/api/vehicles');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          model: expect.any(String),
          licensePlate: expect.any(String)
        })
      ])
    );
  });
});
