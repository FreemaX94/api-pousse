const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate'); // ✅ Middleware d'erreurs de celebrate

const invoiceController = require('../../../backend/controllers/invoiceController');
const invoiceService = require('../../../backend/services/invoiceService');

jest.mock('../../../backend/services/invoiceService');

const app = express();
app.use(bodyParser.json());

// Routes de test
app.post('/invoices', invoiceController.validateCreateInvoice, invoiceController.createInvoice);
app.get('/invoices', invoiceController.validateGetInvoices, invoiceController.getInvoices);

// ✅ Gestion des erreurs de validation
app.use(errors());

describe('Invoice Controller', () => {

  describe('POST /invoices - createInvoice', () => {
    it('devrait créer une facture avec succès', async () => {
      const mockInvoice = { id: '1', client: 'Client1' };
      invoiceService.createInvoice.mockResolvedValue(mockInvoice);

      const res = await request(app)
        .post('/invoices')
        .send({
          client: 'Client1',
          employee: 'Employé1',
          pole: 'Pôle1',
          amount: 500,
          dueDate: '2025-07-01',
          date: '2025-06-15'
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual(mockInvoice);
    });

    it('devrait échouer si le champ "client" est manquant', async () => {
      const res = await request(app)
        .post('/invoices')
        .send({
          employee: 'Employé1',
          pole: 'Pôle1',
          amount: 500,
          dueDate: '2025-07-01',
          date: '2025-06-15'
        });

      expect(res.status).toBe(400); // ✅ devrait maintenant renvoyer 400
    });
  });

  describe('GET /invoices - getInvoices', () => {
    it('devrait retourner la liste des factures', async () => {
      const mockList = { data: [{ id: '1' }], total: 1 };
      invoiceService.listInvoices.mockResolvedValue(mockList);

      const res = await request(app)
        .get('/invoices?status=paid&page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual(mockList.data);
    });

    it('devrait échouer si query invalide', async () => {
      const res = await request(app)
        .get('/invoices?status=invalid_status');

      expect(res.status).toBe(400); // ✅ devrait maintenant renvoyer 400
    });
  });
});

