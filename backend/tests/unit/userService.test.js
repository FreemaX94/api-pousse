const jwt = require('jsonwebtoken');
const userService = require('../../services/userService');
const User = require('../../models/userModel');

jest.mock('jsonwebtoken');
jest.mock('../../models/userModel', () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn()
}));

describe('userService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('registerUser', () => {
    it('creates user with plain password', async () => {
      const user = { username: 'u' };
      User.create.mockResolvedValue(user);

      const result = await userService.registerUser({ username: 'u', password: 'p' });

      expect(User.create).toHaveBeenCalledWith({ username: 'u', password: 'p' });
      expect(result).toBe(user);
    });
  });

  describe('loginUser', () => {
    it('returns token when credentials are valid', async () => {
      const user = { comparePassword: jest.fn().mockResolvedValue(true) };
      User.findOne.mockResolvedValue(user);
      jwt.sign.mockReturnValue('token');

      const result = await userService.loginUser({ username: 'u', password: 'p' });

      expect(User.findOne).toHaveBeenCalledWith({ username: 'u' });
      expect(user.comparePassword).toHaveBeenCalledWith('p');
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toEqual({ token: 'token', user });
    });

    it('throws error when user not found', async () => {
      User.findOne.mockResolvedValue(null);
      await expect(userService.loginUser({ username: 'u', password: 'p' })).rejects.toThrow('Invalid credentials');
    });
  });

  describe('updateProfile', () => {
    it('returns updated user', async () => {
      const updated = { username: 'u' };
      User.findByIdAndUpdate.mockResolvedValue(updated);

      const result = await userService.updateProfile('id', { username: 'u' });

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('id', { username: 'u' }, { new: true });
      expect(result).toBe(updated);
    });

    it('throws error when user not found', async () => {
      User.findByIdAndUpdate.mockResolvedValue(null);
      await expect(userService.updateProfile('id', {})).rejects.toThrow('User not found');
    });
  });
});
