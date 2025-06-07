const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const crypto = require('crypto');
const { sendResetPasswordEmail } = require('../services/mailService');
const logger = require('../utils/logger');

// 🔐 Génère un token JWT signé
const generateToken = (payload, expiresIn) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

exports.register = async (req, res) => {
  try {
    const { username, password, email, fullname } = req.body;
    const user = await User.create({
      username,
      email,
      fullname,
      password,
      isActive: false
    });

    res.status(201).send({ message: 'Inscription réussie', user: { id: user._id } });
  } catch (err) {
    logger.error('❌ Erreur register:', err.message);
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
    logger.error('❌ Erreur activate:', err.message);
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

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : true,
      sameSite: process.env.COOKIE_SAMESITE || 'strict'
    };

    res.cookie('accessToken', accessToken, cookieOptions);
    res.status(200).send({ refreshToken });
  } catch (err) {
    logger.error('❌ Erreur login:', err.message);
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
    logger.error('❌ Erreur refresh:', err.message);
    res.status(500).send({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const token = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1h
      await user.save();
      try {
        await sendResetPasswordEmail(user.email, token);
      } catch (e) {
        logger.error('❌ Envoi mail échoué:', e.message);
      }
    }
    res.status(200).send({ message: 'Si le compte existe, un e-mail a été envoyé.' });
  } catch (err) {
    logger.error('❌ Erreur forgotPassword:', err.message);
    res.status(500).send({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).send({ message: 'Token invalide ou expiré' });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).send({ message: 'Mot de passe mis à jour' });
  } catch (err) {
    logger.error('❌ Erreur resetPassword:', err.message);
    res.status(500).send({ error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (err) {
    logger.error('❌ Erreur me:', err.message);
    res.status(500).send({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie('accessToken');
    res.status(200).send({ message: 'Déconnecté' });
  } catch (err) {
    logger.error('❌ Erreur logout:', err.message);
    res.status(500).send({ error: err.message });
  }
}
