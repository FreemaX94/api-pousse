const jwt = require('jsonwebtoken');
const { authMiddleware, requireAdmin } = require('../../middlewares/authMiddleware');
const { findById } = require('../../models/userModel');

jest.mock('../../models/userModel', () => ({
  findById: jest.fn()
}));

describe('authMiddleware', () => {
  let req, res, next, userMock;

  beforeEach(() => {
    req = { cookies: {} };
    res = {};
    next = jest.fn();
    userMock = { _id: '123', username: 'test', role: 'admin', isActive: true };
  });

  test('autorise un utilisateur valide', async () => {
    jwt.verify = jest.fn().mockReturnValue({ userId: '123' });
    findById.mockResolvedValue(userMock);
    req.cookies.accessToken = 'valid.token';

    await authMiddleware()(req, res, next);

    expect(req.user).toEqual(userMock);
    expect(next).toHaveBeenCalled();
  });

  test('rejette token manquant', async () => {
    await authMiddleware()(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].status || 401).toBe(401);
  });

  test('rejette token invalide', async () => {
    jwt.verify = () => { throw new Error('invalid token'); };
    req.cookies.accessToken = 'invalid.token';
    await authMiddleware()(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].status || 401).toBe(401);
  });

  test('rejette utilisateur inactif', async () => {
    jwt.verify = jest.fn().mockReturnValue({ userId: '123' });
    const inactiveUser = { ...userMock, isActive: false };
    findById.mockResolvedValue(inactiveUser);
    req.cookies.accessToken = 'valid.token';
    await authMiddleware()(req, res, next);
    expect(next.mock.calls[0][0].status || 401).toBe(403);
  });

  test('rejette utilisateur avec mauvais rôle', async () => {
    req.user = { ...userMock, role: 'user' };
    await requireAdmin(req, res, next);
    expect(next.mock.calls[0][0].status || 401).toBe(403);
  });

  test('rejette token expiré', async () => {
    jwt.verify = () => { const err = new Error('Token expiré'); err.name = 'TokenExpiredError'; throw err; };
    req.cookies.accessToken = 'expired.token';
    findById.mockResolvedValue(userMock);
    await authMiddleware()(req, res, next);
    expect(next.mock.calls[0][0].status || 401).toBe(401);
    expect(next.mock.calls[0][0].message).toMatch(/expiré/i);
  });
});