const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const controller = require('../../../backend/controllers/salesOrdersController');
const service = require('../../../backend/services/salesOrdersService');

jest.mock('../../../backend/services/salesOrdersService');

const app = express();
app.use(bodyParser.json());

// Routes à tester
app.post('/orders', controller.validateCreateOrder, controller.createOrder);
app.get('/orders', controller.validateGetOrders, controller.getOrders);

// Gestion des erreurs celebrate
app.use(errors());

describe('SalesOrders Controller', () => {

  describe('POST /orders - createOrder', () => {
    it('devrait créer une commande avec succès', async () => {
      const mockOrder = { id: 'order1', customerId: '123' };
      service.createOrder.mockResolvedValue(mockOrder);

      const res = await request(app)
        .post('/orders')
        .send({
          customerId: '60ddc973f3a3b814c8d610a1',
          items: [
            { productId: '60ddc973f3a3b814c8d610a2', quantity: 2 }
          ]
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual(mockOrder);
    });

    it('devrait échouer si le champ "items" est vide', async () => {
      const res = await request(app)
        .post('/orders')
        .send({
          customerId: '60ddc973f3a3b814c8d610a1',
          items: []
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /orders - getOrders', () => {
    it('devrait retourner une liste de commandes', async () => {
      const mockData = {
        data: [{ id: 'order1', customerId: '60ddc973f3a3b814c8d610a1' }],
        meta: { total: 1 }
      };
      service.listOrders.mockResolvedValue(mockData);

      const res = await request(app).get('/orders?status=confirmed&page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual(mockData.data);
      expect(res.body.meta).toEqual(mockData.meta);
    });

    it('devrait échouer si "limit" est trop élevé', async () => {
      const res = await request(app).get('/orders?limit=999');
      expect(res.status).toBe(400);
    });
  });

});
