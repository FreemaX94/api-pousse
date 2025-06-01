const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const generateToken = (payload, expiresIn) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashed });
    res.status(201).send({ message: 'Inscription réussie' });
  } catch (err) {
    next(err);
  }
};

exports.activate = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.findOneAndUpdate({ username }, { isActive: true }, { new: true });
    if (!user) return res.status(404).send({ message: 'Utilisateur non trouvé' });
    res.status(200).send({ message: 'Compte activé' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).send({ message: 'Identifiants invalides' });
    }
    if (!user.isActive) return res.status(403).send({ message: 'Compte non activé' });

    const accessToken = generateToken({ userId: user._id }, '15m');
    const refreshToken = generateToken({ userId: user._id }, '7d');
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.status(200).send({ refreshToken });
  } catch (err) {
    next(err);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const accessToken = generateToken({ userId: decoded.userId }, '15m');
    res.status(200).send({ accessToken });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res) => {
  res.status(200).send(req.user);
};

exports.logout = async (req, res) => {
  res.clearCookie('accessToken');
  res.status(200).send({ message: 'Déconnecté' });
};
