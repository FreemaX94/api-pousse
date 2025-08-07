const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const logger = require('../utils/logger');
const { verifyAccessToken, shouldRotateToken, generateTokenPair } = require('../services/jwtService');

// Middleware d'authentification avancé avec rotation automatique
const authMiddleware = (requiredRole = null) => async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.accessToken;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : cookieToken;

  if (!token || typeof token !== 'string' || token.length < 10) {
    logger.warn('🔐 Aucun token valide fourni');
    return res.status(401).json({ 
      error: 'Token manquant ou invalide',
      code: 'TOKEN_MISSING'
    });
  }

  let decoded;
  try {
    // Utiliser le service JWT sécurisé
    decoded = verifyAccessToken(token);
  } catch (err) {
    if (err.message === 'Token expiré') {
      return res.status(401).json({ 
        error: 'Token expiré', 
        code: 'TOKEN_EXPIRED',
        shouldRefresh: true
      });
    }
    if (err.message === 'Token révoqué') {
      return res.status(401).json({ 
        error: 'Token révoqué', 
        code: 'TOKEN_REVOKED'
      });
    }
    logger.error('❗ Erreur authMiddleware (token verification) :', err.message);
    return res.status(401).json({ 
      error: 'Token invalide',
      code: 'TOKEN_INVALID'
    });
  }

  try {
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(403).json({ 
        error: 'Accès interdit - Compte inactif',
        code: 'ACCOUNT_INACTIVE'
      });
    }

    if (requiredRole && user.role !== requiredRole) {
      return res.status(403).json({ 
        error: 'Accès réservé aux administrateurs',
        code: 'INSUFFICIENT_ROLE'
      });
    }

    // Vérifier si le token doit être renouvelé bientôt
    if (shouldRotateToken(decoded)) {
      // Ajouter un header pour indiquer au client de rafraîchir
      res.setHeader('X-Token-Refresh-Suggested', 'true');
      logger.info(`🔄 Suggestion de rotation pour user ${user._id}`);
    }

    // Ajouter les infos du token au user
    req.user = {
      ...user.toObject(),
      tokenId: decoded.tokenId,
      tokenIssuedAt: decoded.iat
    };
    
    next();
  } catch (err) {
    logger.error('❗ Erreur authMiddleware (DB) :', err.message);
    return res.status(500).json({ 
      error: 'Erreur serveur',
      code: 'SERVER_ERROR'
    });
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
