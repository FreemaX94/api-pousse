const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const controller = require('../../../backend/controllers/vehicleController');
const service = require('../../../backend/services/vehicleService');

jest.mock('../../../backend/services/vehicleService');

const app = express();
app.use(bodyParser.json());

// Routes simulées
app.post('/vehicles', controller.validateCreateVehicle, controller.createVehicle);
app.get('/vehicles', controller.validateGetVehicles, controller.getVehicles);
app.use(errors()); // Pour gérer les erreurs de validation

describe('Vehicle Controller', () => {

  describe('POST /vehicles - createVehicle', () => {
    it('devrait créer un véhicule avec succès', async () => {
      const mockVehicle = { id: '1', licensePlate: 'AB-123-CD' };
      service.createVehicle.mockResolvedValue(mockVehicle);

      const res = await request(app)
        .post('/vehicles')
        .send({
          licensePlate: 'AB-123-CD',
          model: 'Renault Kangoo',
          capacity: 500
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual(mockVehicle);
    });

    it('devrait échouer si "licensePlate" est manquant', async () => {
      const res = await request(app)
        .post('/vehicles')
        .send({
          model: 'Citroën Berlingo',
          capacity: 300
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /vehicles - getVehicles', () => {
    it('devrait retourner une liste de véhicules', async () => {
      const mockData = {
        data: [{ licensePlate: 'AB-123-CD' }],
        meta: { total: 1 }
      };
      service.listVehicles.mockResolvedValue(mockData);

      const res = await request(app).get('/vehicles?capacityMin=200');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual(mockData.data);
      expect(res.body.meta).toEqual(mockData.meta);
    });
  });

});
