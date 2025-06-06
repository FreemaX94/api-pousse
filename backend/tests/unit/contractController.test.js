const {
  postContract,
  getContracts,
  getContract,
  validatePostContract,
  validateGetContracts,
  validateGetContract
} = require('../../controllers/contractController');
const service = require('../../services/contractService');

jest.mock('../../services/contractService');

describe('contractController', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { body: {}, query: {}, params: {}, method: 'post', headers: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('postContract', () => {
    test('creates contract and responds 201', async () => {
      req.body = {
        clientId: '0123456789abcdef01234567',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        contractType: 'basic',
        isB2B: false
      };
      const data = { id: '1', ...req.body };
      service.createContract.mockResolvedValue(data);

      await postContract(req, res, next);

      expect(service.createContract).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ status: 'success', data });
      expect(next).not.toHaveBeenCalled();
    });

    test('forwards service error', async () => {
      const err = new Error('fail');
      service.createContract.mockRejectedValue(err);
      await postContract(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('getContracts', () => {
    test('returns list with meta', async () => {
      req.query = { page: 2, limit: 5 };
      const result = { data: [{ id: '1' }], meta: { total: 1 } };
      service.listContracts.mockResolvedValue(result);

      await getContracts(req, res, next);

      expect(service.listContracts).toHaveBeenCalledWith(req.query);
      expect(res.json).toHaveBeenCalledWith({ status: 'success', ...result });
      expect(next).not.toHaveBeenCalled();
    });

    test('forwards service error', async () => {
      const err = new Error('oops');
      service.listContracts.mockRejectedValue(err);
      await getContracts(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('getContract', () => {
    test('returns single contract', async () => {
      req.params = { id: '0123456789abcdef01234567' };
      const contract = { id: req.params.id };
      service.getContractById.mockResolvedValue(contract);

      await getContract(req, res, next);

      expect(service.getContractById).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith({ status: 'success', data: contract });
      expect(next).not.toHaveBeenCalled();
    });

    test('forwards service error', async () => {
      const err = new Error('missing');
      service.getContractById.mockRejectedValue(err);
      await getContract(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('validatePostContract', () => {
    test('passes with valid body', async () => {
      req.body = {
        clientId: '0123456789abcdef01234567',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        contractType: 'basic',
        isB2B: true
      };
      await validatePostContract(req, res, next);
      expect(next).toHaveBeenCalledWith(null);
    });

    test('errors with invalid body', async () => {
      req.body = { clientId: 'bad' };
      await validatePostContract(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });

  describe('validateGetContracts', () => {
    test('passes with valid query', async () => {
      req.query = { isB2B: 'true', page: '1', limit: '10' };
      await validateGetContracts(req, res, next);
      expect(next).toHaveBeenCalledWith(null);
    });

    test('errors with invalid query', async () => {
      req.query = { limit: '500' };
      await validateGetContracts(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });

  describe('validateGetContract', () => {
    test('passes with valid params', async () => {
      req.params = { id: '0123456789abcdef01234567' };
      await validateGetContract(req, res, next);
      expect(next).toHaveBeenCalledWith(null);
    });

    test('errors with invalid params', async () => {
      req.params = { id: 'bad' };
      await validateGetContract(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });
});
