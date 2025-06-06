jest.mock('../../services/expenseService.js', () => ({
  createExpense: jest.fn(),
  listExpenses: jest.fn(),
}));

const service = require('../../services/expenseService.js');
const {
  validateCreateExpense,
  createExpense,
  validateGetExpenses,
  getExpenses,
} = require('../../controllers/expenseController.js');

function runMiddleware(mw, req) {
  if (!req.headers) req.headers = {};
  if (!req.method) req.method = 'GET';
  if (!req.headers['content-type']) req.headers['content-type'] = 'application/json';
  return new Promise((resolve) => {
    mw(req, {}, (err) => resolve(err));
  });
}

describe('expenseController', () => {
  describe('createExpense', () => {
    test('returns 201 with created expense', async () => {
      const req = { body: { amount: 1, description: 'a', date: '2024-01-01', currency: 'EUR' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      service.createExpense.mockResolvedValue({ id: '123' });

      await createExpense(req, res, next);

      expect(service.createExpense).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { id: '123' } });
      expect(next).not.toHaveBeenCalled();
    });

    test('forwards error from service', async () => {
      const err = new Error('boom');
      service.createExpense.mockRejectedValue(err);
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      await createExpense(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('getExpenses', () => {
    test('returns expenses list', async () => {
      const req = { query: { page: 1 } };
      const res = { json: jest.fn() };
      const next = jest.fn();
      service.listExpenses.mockResolvedValue({ data: [], meta: { total: 0, page: 1, limit: 50 } });

      await getExpenses(req, res, next);

      expect(service.listExpenses).toHaveBeenCalledWith(req.query);
      expect(res.json).toHaveBeenCalledWith({ status: 'success', data: [], meta: { total: 0, page: 1, limit: 50 } });
      expect(next).not.toHaveBeenCalled();
    });

    test('forwards error from service', async () => {
      const err = new Error('fail');
      service.listExpenses.mockRejectedValue(err);
      const req = { query: {} };
      const res = { json: jest.fn() };
      const next = jest.fn();

      await getExpenses(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('validateCreateExpense', () => {
    test('passes with valid data', () => {
      const { error } = validateCreateExpense._schema.body.validate({ amount: 1, description: 'a', date: '2024-01-01', currency: 'EUR' });
      expect(error).toBeUndefined();
    });

    test('fails with invalid data', () => {
      const { error } = validateCreateExpense._schema.body.validate({ amount: -1 });
      expect(error).toBeTruthy();
    });
  });

  describe('validateGetExpenses', () => {
    test('passes with valid query', () => {
      const { error } = validateGetExpenses._schema.query.validate({ page: 1 });
      expect(error).toBeUndefined();
    });

    test('fails with invalid query', () => {
      const { error } = validateGetExpenses._schema.query.validate({ page: 0 });
      expect(error).toBeTruthy();
    });
  });
});