jest.mock('../../../backend/utils/logger', () => ({
  log: jest.fn()
}));

const mongoose = require('mongoose');
const logger = require('../../../backend/middlewares/logger');
const { log } = require('../../../backend/utils/logger');

describe('Middleware - logger', () => {
  const mockReq = {
    method: 'GET',
    originalUrl: '/test',
    headers: {}
  };
  const mockRes = {};
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mongoose.connection.name = 'mockDb'; // simulateur de DB connectée
  });

  it('devrait logger la méthode, l’URL et la base de données', () => {
    logger(mockReq, mockRes, mockNext);

    expect(log).toHaveBeenCalledWith('➡️', 'GET', '/test');
    expect(log).toHaveBeenCalledWith('🧩 DB:', 'mockDb');
    expect(mockNext).toHaveBeenCalled();
  });

  it('devrait logger l’en-tête Authorization si présent', () => {
    mockReq.headers.authorization = 'Bearer test-token';
    logger(mockReq, mockRes, mockNext);

    expect(log).toHaveBeenCalledWith('🔑 Auth header:', 'Bearer test-token');
  });
});
