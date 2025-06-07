const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const createError = require('../utils/createError.js');
const User = require('../models/userModel.js');

exports.createUser = async function({ username, password }) {
  const exists = await User.findOne({ username });
  if (exists) {
    throw createError(409, 'Username already exists');
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashed });
  return user;
}

exports.authenticate = async function({ username, password }) {
  const user = await User.findOne({ username });
  if (!user) {
    throw createError(401, 'Invalid credentials');
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw createError(401, 'Invalid credentials');
  }
  if (!process.env.JWT_SECRET) {
    throw createError(500, 'JWT_SECRET is not defined');
  }
  return jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}
