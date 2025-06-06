const deliveryService = require('../../services/deliveryService');
const controller = require('../../controllers/deliveryController');

jest.mock('../../services/deliveryService', () => ({
  createDelivery: jest.fn(),
  getDeliveries: jest.fn(),
  updateDelivery: jest.fn(),
  deleteDelivery: jest.fn()
}));

describe('deliveryController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('create', () => {
    test('returns 201 with created delivery', async () => {
      const mockDelivery = { id: '1' };
      deliveryService.createDelivery.mockResolvedValue(mockDelivery);
      await controller.create(req, res, next);
      expect(deliveryService.createDelivery).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockDelivery);
      expect(next).not.toHaveBeenCalled();
    });

    test('passes error to next on failure', async () => {
      const err = new Error('fail');
      deliveryService.createDelivery.mockRejectedValue(err);
      await controller.create(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('getAll', () => {
    test('returns deliveries', async () => {
      const deliveries = [{ id: '1' }];
      deliveryService.getDeliveries.mockResolvedValue(deliveries);
      await controller.getAll(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(deliveries);
    });

    test('passes error to next on failure', async () => {
      const err = new Error('boom');
      deliveryService.getDeliveries.mockRejectedValue(err);
      await controller.getAll(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('update', () => {
    test('updates a delivery', async () => {
      req.params.id = 'abc';
      const updated = { id: 'abc', foo: 'bar' };
      deliveryService.updateDelivery.mockResolvedValue(updated);
      await controller.update(req, res, next);
      expect(deliveryService.updateDelivery).toHaveBeenCalledWith('abc', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    test('passes error to next on failure', async () => {
      req.params.id = 'abc';
      const err = new Error('nope');
      deliveryService.updateDelivery.mockRejectedValue(err);
      await controller.update(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('delete', () => {
    test('deletes a delivery', async () => {
      req.params.id = 'abc';
      deliveryService.deleteDelivery.mockResolvedValue({});
      await controller.delete(req, res, next);
      expect(deliveryService.deleteDelivery).toHaveBeenCalledWith('abc');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({});
    });

    test('passes error to next on failure', async () => {
      req.params.id = 'abc';
      const err = new Error('gone');
      deliveryService.deleteDelivery.mockRejectedValue(err);
      await controller.delete(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });
});