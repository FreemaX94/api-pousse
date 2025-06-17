const requireAdmin = require('../../../backend/middlewares/adminMiddleware'); // ✅ chemin corrigé
const createError = require('http-errors');

describe('Middleware - requireAdmin', () => {

  const mockNext = jest.fn();

  beforeEach(() => {
    mockNext.mockReset();
  });

  it('devrait autoriser un utilisateur admin', () => {
    const req = { user: { role: 'admin' } };
    const res = {};

    requireAdmin(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(); // aucune erreur
  });

  it('devrait refuser un utilisateur non-admin', () => {
    const req = { user: { role: 'user' } };
    const res = {};

    requireAdmin(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    const err = mockNext.mock.calls[0][0];
    expect(err.status).toBe(403);
    expect(err.message).toMatch(/administrateurs/);
  });

  it('devrait refuser si req.user est manquant', () => {
    const req = {};
    const res = {};

    requireAdmin(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    const err = mockNext.mock.calls[0][0];
    expect(err.status).toBe(403);
    expect(err.message).toMatch(/administrateurs/);
  });

});
