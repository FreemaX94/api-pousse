jest.mock('../../services/pricesService.js', () => ({
  createPrice: jest.fn(),
  listPrices: jest.fn(),
}));

const service = require('../../services/pricesService.js');
const {
  getPrices,
  createPrice,
  validateCreatePrice,
  validateGetPrices,
} = require('../../controllers/pricesController.js');

describe('pricesController', () => {
  describe('createPrice', () => {
    test('returns 201 with created price', async () => {
      const req = { body: { productId: '1', price: 2, currency: 'EUR' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      service.createPrice.mockResolvedValue({ id: '123' });

      await createPrice(req, res, next);

      expect(service.createPrice).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { id: '123' } });
      expect(next).not.toHaveBeenCalled();
    });

    test('forwards error from service', async () => {
      const err = new Error('fail');
      service.createPrice.mockRejectedValue(err);
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      await createPrice(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('getPrices', () => {
    test('returns prices list', async () => {
      const req = { query: { page: 1 } };
      const res = { json: jest.fn() };
      const next = jest.fn();
      service.listPrices.mockResolvedValue({ data: [], meta: { total: 0, page: 1, limit: 50 } });

      await getPrices(req, res, next);

      expect(service.listPrices).toHaveBeenCalledWith(req.query);
      expect(res.json).toHaveBeenCalledWith({ status: 'success', data: [], meta: { total: 0, page: 1, limit: 50 } });
      expect(next).not.toHaveBeenCalled();
    });

    test('forwards error from service', async () => {
      const err = new Error('oops');
      service.listPrices.mockRejectedValue(err);
      const req = { query: {} };
      const res = { json: jest.fn() };
      const next = jest.fn();

      await getPrices(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('validateCreatePrice', () => {
    test('passes with valid body', () => {
      const { error } = validateCreatePrice._schema.body.validate({
        productId: '0123456789abcdef01234567',
        price: 1,
        currency: 'EUR',
      });
      expect(error).toBeUndefined();
    });

    test('fails with invalid body', () => {
      const { error } = validateCreatePrice._schema.body.validate({ price: -1 });
      expect(error).toBeTruthy();
    });
  });

  describe('validateGetPrices', () => {
    test('passes with valid query', () => {
      const { error } = validateGetPrices._schema.query.validate({ page: 1 });
      expect(error).toBeUndefined();
    });

    test('fails with invalid query', () => {
      const { error } = validateGetPrices._schema.query.validate({ limit: 500 });
      expect(error).toBeTruthy();
    });
  });
});
