const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// 🔐 Génère un token JWT signé
const generateToken = (payload, expiresIn) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed, isActive: false });

    res.status(201).send({ message: 'Inscription réussie', user: { id: user._id } });
  } catch (err) {
    console.error('❌ Erreur register:', err.message);
    res.status(500).send({ error: err.message });
  }
};

exports.activate = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOneAndUpdate(
      { username },
      { isActive: true },
      { new: true }
    );
    if (!user) return res.status(404).send({ message: 'Utilisateur non trouvé' });

    res.status(200).send({ message: 'Compte activé', user: { id: user._id } });
  } catch (err) {
    console.error('❌ Erreur activate:', err.message);
    res.status(500).send({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ message: 'Identifiants invalides' });
    }

    if (!user.isActive) {
      return res.status(403).send({ message: 'Compte non activé' });
    }

    const accessToken = generateToken({ userId: user._id }, '15m');
    const refreshToken = generateToken({ userId: user._id }, '7d');

    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.status(200).send({ refreshToken });
  } catch (err) {
    console.error('❌ Erreur login:', err.message);
    res.status(500).send({ error: err.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).send({ message: 'Token manquant' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const accessToken = generateToken({ userId: decoded.userId }, '15m');

    res.status(200).send({ accessToken });
  } catch (err) {
    console.error('❌ Erreur refresh:', err.message);
    res.status(500).send({ error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (err) {
    console.error('❌ Erreur me:', err.message);
    res.status(500).send({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie('accessToken');
    res.status(200).send({ message: 'Déconnecté' });
  } catch (err) {
    console.error('❌ Erreur logout:', err.message);
    res.status(500).send({ error: err.message });
  }
};
