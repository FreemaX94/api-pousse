const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/userModel');
const logger = require('../utils/logger');

// Middleware d'authentification avec rôle optionnel
const authMiddleware = (requiredRole = null) => async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return next(createError(401, 'Token manquant'));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(createError(401, 'Token expiré'));
      }
      logger.error('❗ Erreur authMiddleware :', err.message);
      return next(createError(401, 'Token invalide'));
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return next(createError(403, 'Accès interdit'));
    }

    if (requiredRole && user.role !== requiredRole) {
      return next(createError(403, 'Accès réservé aux administrateurs'));
    }

    req.user = user;
    next();
  } catch (err) {
    logger.error('❗ Erreur authMiddleware :', err.message);
    next(createError(500, 'Erreur serveur'));
  }
};

// Middleware spécifique pour vérifier le rôle admin (utilisé en test unitaire)
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(createError(403, 'Accès réservé aux administrateurs'));
  }
  next();
};

module.exports = {
  authMiddleware,
  requireAdmin // ✅ maintenant exporté
};
