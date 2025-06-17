const { celebrate, Segments } = require('celebrate');
const { validateCreateInvoice, validateGetInvoices } = require('../../validations/invoiceValidation');


describe('✅ invoiceValidation.js', () => {
  describe('📄 validateCreateInvoice', () => {
    const schema = validateCreateInvoice[Segments.BODY];

    it('devrait valider un corps correct', () => {
      const result = schema.validate({
        client: 'Pousse',
        amount: 1200,
        dueDate: '2025-12-31T00:00:00.000Z',
        status: 'pending',
      });
      expect(result.error).toBeUndefined();
    });

    it('rejette un client manquant', () => {
      const result = schema.validate({
        amount: 1200,
        dueDate: '2025-12-31T00:00:00.000Z',
      });
      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toMatch(/client.*requis/i);
    });

    it('rejette un montant négatif', () => {
      const result = schema.validate({
        client: 'Pousse',
        amount: -100,
        dueDate: '2025-12-31T00:00:00.000Z',
      });
      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toMatch(/positif/i);
    });

    it('rejette une date non ISO', () => {
      const result = schema.validate({
        client: 'Pousse',
        amount: 100,
        dueDate: '31/12/2025',
      });
      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toMatch(/format ISO/i);
    });

    it('rejette un status invalide', () => {
      const result = schema.validate({
        client: 'Pousse',
        amount: 100,
        dueDate: '2025-12-31T00:00:00.000Z',
        status: 'en attente',
      });
      expect(result.error).toBeDefined();
    });
  });

  describe('📊 validateGetInvoices', () => {
    const schema = validateGetInvoices[Segments.QUERY];

    it('accepte un status valide', () => {
      const result = schema.validate({
        status: 'paid',
        client: 'Maison Verte',
      });
      expect(result.error).toBeUndefined();
    });

    it('rejette un status invalide', () => {
      const result = schema.validate({
        status: 'invalidStatus',
      });
      expect(result.error).toBeDefined();
    });

    it('accepte une requête vide', () => {
      const result = schema.validate({});
      expect(result.error).toBeUndefined();
    });
  });
});
