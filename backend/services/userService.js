const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js').default || require('../models/userModel.js');

/**
 * Enregistre un utilisateur
 */
async function registerUser(data) {
  const user = await User.create({ ...data });
  return user;
}

/**
 * Authentifie l'utilisateur et génère un token
 */
async function loginUser({ username, password }) {
  const user = await User.findOne({ username });
  if (!user) throw new Error('Invalid credentials');
  const match = await user.comparePassword(password);
  if (!match) throw new Error('Invalid credentials');
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { token, user };
}

/**
 * Met à jour le profil utilisateur
 */
async function updateProfile(id, data) {
  const updated = await User.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw new Error('User not found');
  return updated;
}

module.exports = { registerUser, loginUser, updateProfile };
