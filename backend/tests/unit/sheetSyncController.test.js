const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const controller = require('../../../backend/controllers/sheetSyncController');
const service = require('../../../backend/services/sheetSyncService');

jest.mock('../../../backend/services/sheetSyncService');

const app = express();
app.use(bodyParser.json());

// Route à tester
app.post('/sheet/sync', controller.syncSheet);

describe('SheetSync Controller', () => {
  it('devrait synchroniser les données avec succès', async () => {
    const mockReport = { synced: 12 };
    service.syncSheet.mockResolvedValue(mockReport);

    const res = await request(app).post('/sheet/sync');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toEqual(mockReport);
  });

  it('devrait retourner une erreur 500 si une exception est levée', async () => {
    service.syncSheet.mockRejectedValue(new Error('Erreur de sync'));

    const res = await request(app).post('/sheet/sync');

    expect(res.status).toBe(500); // Express renverra 500 car pas de handler custom ici
  });
});
