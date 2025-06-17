const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const controller = require('../../../backend/controllers/pricesController');
const service = require('../../../backend/services/pricesService');

jest.mock('../../../backend/services/pricesService');

const app = express();
app.use(bodyParser.json());

// Définir les routes à tester
app.get('/prices', controller.validateGetPrices, controller.getPrices);
app.post('/prices', controller.validateCreatePrice, controller.createPrice);

// Gestion des erreurs Joi/Celebrate
app.use(errors());

describe('Prices Controller', () => {

  describe('GET /prices', () => {
    it('devrait retourner une liste de prix', async () => {
      const mockData = { data: [{ price: 10 }], meta: { total: 1 } };
      service.listPrices.mockResolvedValue(mockData);

      const res = await request(app).get('/prices?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual(mockData.data);
      expect(res.body.meta).toEqual(mockData.meta);
    });

    it('devrait échouer avec une mauvaise query', async () => {
      const res = await request(app).get('/prices?limit=999');
      expect(res.status).toBe(400); // > 200 autorisé par Joi
    });
  });

  describe('POST /prices', () => {
    it('devrait créer un prix avec succès', async () => {
      const mockPrice = { price: 15, currency: 'EUR' };
      service.createPrice.mockResolvedValue(mockPrice);

      const res = await request(app)
        .post('/prices')
        .send({
          productId: '60ddc973f3a3b814c8d610a1',
          price: 15,
          currency: 'EUR'
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual(mockPrice);
    });

    it('devrait échouer si productId est invalide', async () => {
      const res = await request(app)
        .post('/prices')
        .send({
          productId: 'invalidID',
          price: 15,
          currency: 'EUR'
        });

      expect(res.status).toBe(400);
    });
  });

});
