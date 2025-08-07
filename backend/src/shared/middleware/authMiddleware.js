const jwt = require('jsonwebtoken');
const User = require('../../domains/auth/models/userModel');
const logger = require('../utils/logger');

// Middleware d'authentification avec rôle optionnel
const authMiddleware = (requiredRole = null) => async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.accessToken;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : cookieToken;

  if (!token || typeof token !== 'string' || token.length < 10) {
    logger.warn('🔐 Aucun token valide fourni');
    return res.status(401).json({ error: 'Token manquant ou invalide' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré' });
    }
    logger.error('❗ Erreur authMiddleware (jwt.verify) :', err.message);
    return res.status(401).json({ error: 'Token invalide' });
  }

  try {
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(403).json({ error: 'Accès interdit' });
    }

    if (requiredRole && user.role !== requiredRole) {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    req.user = user;
    next();
  } catch (err) {
    logger.error('❗ Erreur authMiddleware (DB) :', err.message);
    return res.status(500).json({ error: 'Erreur serveur' });
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
