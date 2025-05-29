const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const createError = require('../utils/createError');

const authMiddleware = async (req, res, next) => {
  try {
    console.log('🛂 Authorization header reçu :', req.headers.authorization);

    const token = req.cookies?.sid || req.headers.authorization?.split(' ')[1];
    console.log('🔓 Token extrait :', token);

    if (!token) throw createError(401, 'Token manquant');

    const secret = process.env.JWT_SECRET || 'dev_secret_key';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id);
    console.log('👤 User trouvé:', user?.username, '| Actif:', user?.isActive);

    if (!user) {
      console.warn('❌ Utilisateur non trouvé pour ID:', decoded.id);
      throw createError(401, 'Utilisateur introuvable');
    }

    if (!user.isActive) {
      console.warn('⚠️ Compte inactif:', user.username);
      throw createError(403, 'Compte non activé');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.warn('⏰ Token expiré');
      return next(createError(401, 'Token expiré'));
    }
    console.error('❗ Erreur authMiddleware :', err.message);
    return next(createError(401, 'Token invalide'));
  }
};

module.exports = authMiddleware;