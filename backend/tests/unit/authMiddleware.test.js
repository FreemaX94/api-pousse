const jwt = require('jsonwebtoken');
const authMiddlewareFactory = require('../../middlewares/authMiddleware');
const createError = require('../../utils/createError');

jest.mock('../../models/userModel');
const User = require('../../models/userModel');

// ✅ Mock explicite
User.findById = jest.fn();

describe('authMiddleware', () => {
  let req, res, next;

  const userMock = {
    _id: 'user123',
    username: 'testuser',
    isActive: true,
    role: 'user',
    lastUserAgent: 'TestAgent'
  };

  const generateToken = (payload, expiresIn = '1h') =>
    jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret_key', { expiresIn });

  beforeEach(() => {
    req = {
      headers: {},
      cookies: {},
      ip: '127.0.0.1'
    };
    res = {};
    next = jest.fn();
    User.findById.mockReset();
  });

  test('autorise un utilisateur valide', async () => {
    const token = generateToken({ id: userMock._id });
    req.cookies.sid = token;
    req.headers['user-agent'] = 'TestAgent';

    User.findById.mockResolvedValue(userMock);

    const authMiddleware = authMiddlewareFactory();
    await authMiddleware(req, res, next);

    expect(req.user).toEqual(userMock);
    expect(next).toHaveBeenCalledWith();
  });

  test('rejette token manquant', async () => {
    const authMiddleware = authMiddlewareFactory();
    await authMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  test('rejette token invalide', async () => {
    req.cookies.sid = 'invalid.token.here';

    const authMiddleware = authMiddlewareFactory();
    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  test('rejette utilisateur inactif', async () => {
    const token = generateToken({ id: userMock._id });
    req.cookies.sid = token;
    req.headers['user-agent'] = 'TestAgent';

    const inactiveUser = { ...userMock, isActive: false };
    User.findById.mockResolvedValue(inactiveUser);

    const authMiddleware = authMiddlewareFactory();
    await authMiddleware(req, res, next);

    expect(next.mock.calls[0][0].statusCode).toBe(403);
  });

  test('rejette utilisateur avec mauvais rôle', async () => {
    const token = generateToken({ id: userMock._id });
    req.cookies.sid = token;
    req.headers['user-agent'] = 'TestAgent';

    User.findById.mockResolvedValue({ ...userMock, role: 'user' });

    const adminRequired = authMiddlewareFactory('admin');
    await adminRequired(req, res, next);

    expect(next.mock.calls[0][0].statusCode).toBe(403);
  });

  test('rejette token expiré', async () => {
    const expiredToken = generateToken({ id: userMock._id }, '-1s');
    req.cookies.sid = expiredToken;
    req.headers['user-agent'] = 'TestAgent';

    User.findById.mockResolvedValue(userMock);

    const authMiddleware = authMiddlewareFactory();
    await authMiddleware(req, res, next);

    expect(next.mock.calls[0][0].statusCode).toBe(401);
    expect(next.mock.calls[0][0].message).toMatch(/expiré/i);
  });
});
