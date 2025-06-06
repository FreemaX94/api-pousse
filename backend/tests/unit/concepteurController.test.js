const { getAllConcepteurs, createConcepteur, validateCreateConcepteur } = require('../../controllers/concepteurController');
const service = require('../../services/concepteurService');

jest.mock('../../services/concepteurService');

describe('concepteurController', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { body: {}, method: 'post', headers: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getAllConcepteurs', () => {
    test('returns list of concepteurs', async () => {
      const list = [{ nom: 'a' }];
      service.listConcepteurs.mockResolvedValue(list);
      await getAllConcepteurs(req, res, next);
      expect(service.listConcepteurs).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ status: 'success', data: list });
      expect(next).not.toHaveBeenCalled();
    });

    test('forwards error from service', async () => {
      const err = new Error('boom');
      service.listConcepteurs.mockRejectedValue(err);
      await getAllConcepteurs(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('createConcepteur', () => {
    test('creates concepteur and responds 201', async () => {
      req.body = { nom: 'nouveau' };
      const data = { id: '1', nom: 'nouveau' };
      service.createConcepteur.mockResolvedValue(data);
      await createConcepteur(req, res, next);
      expect(service.createConcepteur).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ status: 'success', data });
      expect(next).not.toHaveBeenCalled();
    });

    test('forwards service error', async () => {
      const err = new Error('fail');
      service.createConcepteur.mockRejectedValue(err);
      await createConcepteur(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('validateCreateConcepteur', () => {
    test('passes with valid body', async () => {
      req.body = { nom: 'valide' };
      await validateCreateConcepteur(req, res, next);
      expect(next).toHaveBeenCalledWith(null);
    });

    test('errors with invalid body', async () => {
      req.body = {};
      await validateCreateConcepteur(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });
});
