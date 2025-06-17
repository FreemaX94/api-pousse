const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const controller = require('../../../backend/controllers/produitsController');
const service = require('../../../backend/services/produitsService');

jest.mock('../../../backend/services/produitsService');

const app = express();
app.use(bodyParser.json());

// Routes
app.post('/produits', controller.validateCreateProduit, controller.createProduit);
app.get('/produits', controller.validateGetProduits, controller.getProduits);

// Middleware Celebrate
app.use(errors());

describe('Produits Controller', () => {

  describe('POST /produits - createProduit', () => {
    it('devrait créer un produit avec succès', async () => {
      const mockProduit = { id: '1', name: 'Produit A' };
      service.createProduit.mockResolvedValue(mockProduit);

      const res = await request(app)
        .post('/produits')
        .send({
          name: 'Produit A',
          price: 99.99,
          category: 'plantes',
          description: 'Une belle plante'
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual(mockProduit);
    });

    it('devrait échouer si "price" est manquant', async () => {
      const res = await request(app)
        .post('/produits')
        .send({
          name: 'Produit B',
          category: 'pots'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /produits - getProduits', () => {
    it('devrait retourner une liste de produits', async () => {
      const mockData = {
        data: [{ name: 'Produit A' }],
        meta: { total: 1 }
      };
      service.listProduits.mockResolvedValue(mockData);

      const res = await request(app).get('/produits?category=plantes&page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual(mockData.data);
      expect(res.body.meta).toEqual(mockData.meta);
    });

    it('devrait échouer si "limit" est trop grand', async () => {
      const res = await request(app).get('/produits?limit=999');
      expect(res.status).toBe(400);
    });
  });

});
