const errorHandler = require('../../../backend/middlewares/errorHandler');

describe('Middleware - errorHandler', () => {

  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('devrait gérer une erreur Celebrate (Joi)', () => {
    const err = {
      isCelebrate: true,
      statusCode: 422,
      details: { message: 'Nom requis' }
    };

    errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(422);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 422,
      message: 'Nom requis',
      name: 'ValidationError'
    });
  });

  it('devrait gérer une erreur avec .toJSON()', () => {
    const err = {
      status: 403,
      toJSON: () => ({ status: 403, message: 'Forbidden' })
    };

    errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ status: 403, message: 'Forbidden' });
  });

  it('devrait gérer une erreur classique', () => {
    const err = new Error('Oups !');
    err.status = 500;

    errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 500,
      message: 'Oups !',
      name: 'Error'
    });
  });

});
