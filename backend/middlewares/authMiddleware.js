const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const createError = require('../utils/createError');

// Simulation de blacklist côté mémoire
const blacklistedTokens = new Set();
const isTokenBlacklisted = (token) => blacklistedTokens.has(token);

const authMiddleware = (requiredRole = null) => async (req, res, next) => {
  try {
    const isTest = process.env.NODE_ENV === 'test';
    const token = req.cookies?.sid || req.headers.authorization?.split(' ')[1];
    if (!token) throw createError(401, 'Token manquant');
    if (!isTest) console.log('🛂 Token reçu :', token);

    if (await isTokenBlacklisted(token)) {
      return next(createError(401, 'Token révoqué'));
    }

    const secret = process.env.JWT_SECRET || 'dev_secret_key';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id);
    if (!user) throw createError(401, 'Utilisateur introuvable');
    if (!user.isActive) throw createError(403, 'Compte non activé');

    if (requiredRole && user.role !== requiredRole) {
      return next(createError(403, 'Accès réservé au rôle ' + requiredRole));
    }

    const incomingAgent = req.headers['user-agent'];
    const incomingIP = req.ip;

    if (user.lastUserAgent && user.lastUserAgent !== incomingAgent) {
      console.warn('⚠️ User-Agent inattendu');
    }

    req.user = user;
    return next();
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
