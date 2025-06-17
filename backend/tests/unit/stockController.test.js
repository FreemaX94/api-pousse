const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const stockController = require('../../../backend/controllers/stockController');
const StockEntry = require('../../../backend/models/StockEntry');

jest.mock('../../../backend/models/StockEntry');

const app = express();
app.use(bodyParser.json());

app.get('/stocks', stockController.getStockByCategory);
app.get('/stocks/export', stockController.exportStocks);

describe('Stock Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /stocks?categorie=X - getStockByCategory', () => {
    it('devrait retourner les entrées de stock pour une catégorie', async () => {
      const mockEntries = [{ categorie: 'plantes', product: { nom: 'Aloe Vera' } }];
      StockEntry.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockEntries)
      });

      const res = await request(app).get('/stocks?categorie=plantes');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockEntries);
    });
  });

  describe('GET /stocks/export?format=csv - exportStocks (CSV)', () => {
    it('devrait exporter les stocks au format CSV', async () => {
      const mockEntries = [{
        categorie: 'pots',
        product: {
          nom: 'Pot rond',
          categorie: 'pot',
          infos: { 'Quantité totale': 50, 'DIMENSIONS': '10x10' }
        }
      }];

      StockEntry.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockEntries)
      });

      const res = await request(app).get('/stocks/export?format=csv');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.text).toContain('categorie'); // entête CSV
      expect(res.text).toContain('pots');      // contenu
    });
  });

  describe('GET /stocks/export?format=pdf - exportStocks (PDF)', () => {
    it('devrait exporter les stocks au format PDF', async () => {
      const mockEntries = [{
        categorie: 'plantes',
        product: {
          nom: 'Ficus',
          infos: { 'Quantité totale': 10, 'DIMENSIONS': '40x40' }
        }
      }];

      StockEntry.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockEntries)
      });

      const res = await request(app).get('/stocks/export?format=pdf');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/pdf');
    });
  });

});
