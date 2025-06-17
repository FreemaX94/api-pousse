const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const itemsController = require('../../../backend/controllers/itemsController');
const service = require('../../../backend/services/itemsService');

jest.mock('../../../backend/services/itemsService');

const app = express();
app.use(bodyParser.json());

// Routes de test
app.post('/items', itemsController.validateCreateItem, itemsController.createItem);
app.get('/items', itemsController.validateGetItems, itemsController.getItems);

// Middleware de gestion des erreurs Celebrate
app.use(errors());

describe('Items Controller', () => {

  describe('POST /items - createItem', () => {
    it('devrait créer un item avec succès', async () => {
      const mockItem = { id: 'item1', name: 'Plante A' };
      service.createItem.mockResolvedValue(mockItem);

      const res = await request(app)
        .post('/items')
        .send({ name: 'Plante A', type: 'plante', data: { couleur: 'verte' } });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual(mockItem);
    });

    it('devrait échouer si le champ "type" est manquant', async () => {
      const res = await request(app)
        .post('/items')
        .send({ name: 'Plante A' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /items - getItems', () => {
    it('devrait retourner une liste d’items', async () => {
      const mockData = { data: [{ id: '1', name: 'Plante' }], meta: { total: 1 } };
      service.listItems.mockResolvedValue(mockData);

      const res = await request(app).get('/items?type=plante&page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual(mockData.data);
      expect(res.body.meta).toEqual(mockData.meta);
    });

    it('devrait échouer si "limit" est supérieur à 200', async () => {
      const res = await request(app).get('/items?limit=300');

      expect(res.status).toBe(400);
    });
  });
});
