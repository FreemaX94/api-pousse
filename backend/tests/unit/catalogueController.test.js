const httpMocks = require('node-mocks-http');
const catalogueController = require('../../controllers/catalogueController');
const service = require('../../services/catalogueService');

jest.mock('../../services/catalogueService');

describe('catalogueController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getByCategorie', () => {
    it('devrait retourner les items pour une catégorie donnée', async () => {
      const req = httpMocks.createRequest({ params: { categorie: 'Plantes' } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const mockData = [{ nom: 'Ficus' }];
      service.findByCategorie.mockResolvedValue(mockData);

      await catalogueController.getByCategorie(req, res, next);

      expect(service.findByCategorie).toHaveBeenCalledWith('Plantes');
      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({ status: 'success', data: mockData });
    });
  });

  describe('createItem', () => {
    it('devrait créer un nouvel item', async () => {
      const req = httpMocks.createRequest({
        body: { categorie: 'Plantes', nom: 'Monstera', infos: { taille: 'grande' } }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const mockItem = { _id: '123', ...req.body };
      service.createItem.mockResolvedValue(mockItem);

      await catalogueController.createItem(req, res, next);

      expect(service.createItem).toHaveBeenCalledWith(req.body);
      expect(res._getStatusCode()).toBe(201);
      expect(res._getJSONData()).toEqual({ status: 'success', data: mockItem });
    });
  });

  describe('getAllItems', () => {
    it('devrait retourner tous les items', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const mockItems = [{ nom: 'Ficus' }, { nom: 'Monstera' }];
      service.findAllItems.mockResolvedValue(mockItems);

      await catalogueController.getAllItems(req, res, next);

      expect(service.findAllItems).toHaveBeenCalled();
      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({ status: 'success', data: mockItems });
    });
  });

  describe('updateItem', () => {
    it('devrait mettre à jour un item', async () => {
      const req = httpMocks.createRequest({
        params: { id: 'abc123' },
        body: { nom: 'Nouveau nom' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const updatedItem = { _id: 'abc123', nom: 'Nouveau nom' };
      service.updateItem.mockResolvedValue(updatedItem);

      await catalogueController.updateItem(req, res, next);

      expect(service.updateItem).toHaveBeenCalledWith('abc123', req.body);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({ status: 'success', data: updatedItem });
    });
  });

  describe('deleteItem', () => {
    it('devrait supprimer un item', async () => {
      const req = httpMocks.createRequest({ params: { id: 'xyz789' } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      service.deleteItem.mockResolvedValue();

      await catalogueController.deleteItem(req, res, next);

      expect(service.deleteItem).toHaveBeenCalledWith('xyz789');
      expect(res._getStatusCode()).toBe(204);
      expect(res._isEndCalled()).toBe(true);
    });
  });
});
