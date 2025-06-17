const Joi = require('joi');
const { create } = require('../../validators/deliveryValidator');

describe('✅ deliveryValidator.js', () => {
  const schema = Joi.object(create);

  it('valide une livraison correcte', () => {
    const result = schema.validate({
      address: '123 Rue Botanique',
      date: '2025-12-01T00:00:00.000Z',
      status: 'pending',
    });
    expect(result.error).toBeUndefined();
  });

  it('rejette une adresse vide', () => {
    const result = schema.validate({
      address: '',
      date: '2025-12-01T00:00:00.000Z',
    });
    expect(result.error).toBeDefined();
  });

  it('rejette une date invalide', () => {
    const result = schema.validate({
      address: '123 Rue Botanique',
      date: '01/12/2025', // mauvais format
    });
    expect(result.error).toBeDefined();
    expect(result.error.details[0].message).toMatch(/ISO 8601/i);
  });

  it('rejette un status non autorisé', () => {
    const result = schema.validate({
      address: '123 Rue Botanique',
      date: '2025-12-01T00:00:00.000Z',
      status: 'en cours',
    });
    expect(result.error).toBeDefined();
  });

  it('accepte un status omis (optionnel)', () => {
    const result = schema.validate({
      address: '123 Rue Botanique',
      date: '2025-12-01T00:00:00.000Z',
    });
    expect(result.error).toBeUndefined();
  });
});
