// backend/controllers/userController.js

const userService = require('../services/userService');

/**
 * POST /api/users/register
 */
exports.register = async (req, res, next) => {
  try {
    const user = await userService.registerUser(req.body);
    return res.status(201).json(user);
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /api/users/login
 */
exports.login = async (req, res, next) => {
  try {
    const result = await userService.loginUser(req.body);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /api/users
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return res.json(users);
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /api/users/:id
 */
exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
};

/**
 * PUT /api/users/:id
 */
exports.updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
};

/**
 * DELETE /api/users/:id
 */
exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};
