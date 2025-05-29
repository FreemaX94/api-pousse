const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const createError = require('../utils/createError');

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) throw createError(404, 'Utilisateur non trouvé');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createError(401, 'Mot de passe incorrect');

    const token = generateToken(user);

    res.cookie('sid', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 3600000,
    });

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      accessToken: token,
    });
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const { username, password, email, role } = req.body;

    const user = new User({
      username,
      email,
      password, // laissé en clair pour que le modèle le hash
      role: role || 'user',
      isActive: true
    });

    await user.save();
    res.status(201).json({ success: true, message: 'Utilisateur créé' });
  } catch (err) {
    next(err);
  }
};

const activate = (req, res) => {
  res.status(200).send({ success: true, message: 'Activation fictive' });
};

const refresh = (req, res) => {
  res.status(200).send({ success: true, message: 'Token refresh fictif' });
};

const me = (req, res) => {
  res.status(200).json({ user: req.user });
};

const logout = (req, res) => {
  res.clearCookie('sid');
  res.status(200).json({ success: true, message: 'Déconnecté avec succès' });
};

module.exports = {
  register,
  login,
  activate,
  refresh,
  me,
  logout
};
