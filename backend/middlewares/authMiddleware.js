const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const logger = require('../utils/logger');

// Middleware d'authentification avec rôle optionnel
const authMiddleware = (requiredRole = null) => async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token || typeof token !== 'string' || token.length < 10) {
    logger.warn('🔐 Aucun token valide fourni');
    const err = new Error('Token manquant ou invalide');
    err.status = 401;
    err.statusCode = 401;
    return next(err);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      const tokenErr = new Error('Token expiré');
      tokenErr.status = 401;
      tokenErr.statusCode = 401;
      return next(tokenErr);
    }
    logger.error('❗ Erreur authMiddleware (jwt.verify) :', err.message);
    const tokenErr = new Error('Token invalide');
    tokenErr.status = 401;
    tokenErr.statusCode = 401;
    return next(tokenErr);
  }

  try {
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      const err = new Error('Accès interdit');
      err.status = 403;
      err.statusCode = 403;
      return next(err);
    }

    if (requiredRole && user.role !== requiredRole) {
      const err = new Error('Accès réservé aux administrateurs');
      err.status = 403;
      err.statusCode = 403;
      return next(err);
    }

    req.user = user;
    next();
  } catch (err) {
    logger.error('❗ Erreur authMiddleware (DB) :', err.message);
    const serverErr = new Error('Erreur serveur');
    serverErr.status = 500;
    serverErr.statusCode = 500;
    return next(serverErr);
  }
};

// Middleware spécifique pour vérifier le rôle admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    const err = new Error('Accès réservé aux administrateurs');
    err.status = 403;
    err.statusCode = 403;
    return next(err);
  }
  next();
};

module.exports = {
  authMiddleware,
  requireAdmin
};
