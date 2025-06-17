const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const controller = require('../../../backend/controllers/sheetController');
const service = require('../../../backend/services/sheetService');

jest.mock('../../../backend/services/sheetService');

const app = express();
app.use(bodyParser.json());

// Routes à tester
app.post('/sheet/import', controller.validateImportSheet, controller.importSheet);
app.get('/sheet/export', controller.validateExportSheet, controller.exportSheet);

// Middleware d'erreurs Celebrate
app.use(errors());

describe('Sheet Controller', () => {

  describe('POST /sheet/import', () => {
    it('devrait importer des données de feuille avec succès', async () => {
      const mockResult = { imported: 5 };
      service.importSheet.mockResolvedValue(mockResult);

      const res = await request(app)
        .post('/sheet/import')
        .send({ sheetData: [{ nom: 'Item 1' }, { nom: 'Item 2' }] });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual(mockResult);
    });

    it('devrait échouer si sheetData est manquant', async () => {
      const res = await request(app)
        .post('/sheet/import')
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe('GET /sheet/export', () => {
    it('devrait exporter la feuille au format CSV', async () => {
      const mockFile = { url: 'https://example.com/file.csv' };
      service.exportSheet.mockResolvedValue(mockFile);

      const res = await request(app).get('/sheet/export?format=csv');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual(mockFile);
    });

    it('devrait échouer avec un format invalide', async () => {
      const res = await request(app).get('/sheet/export?format=pdf');
      expect(res.status).toBe(400);
    });
  });

});
