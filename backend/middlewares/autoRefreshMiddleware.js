// backend/middlewares/autoRefreshMiddleware.js
// Middleware pour l'auto-refresh des tokens côté frontend

const logger = require('../utils/logger');

/**
 * Middleware pour ajouter les headers d'auto-refresh
 * Informe le frontend quand rafraîchir les tokens
 */
const autoRefreshHeaders = (req, res, next) => {
  // Intercepter la réponse pour ajouter les headers
  const originalSend = res.send;
  
  res.send = function(data) {
    // Si l'utilisateur est connecté et le token expire bientôt
    if (req.user && req.user.tokenIssuedAt) {
      const now = Math.floor(Date.now() / 1000);
      const tokenAge = now - req.user.tokenIssuedAt;
      const maxAge = 15 * 60; // 15 minutes
      
      // Si le token a plus de 10 minutes, suggérer un refresh
      if (tokenAge > 10 * 60) {
        res.setHeader('X-Token-Refresh-Suggested', 'true');
        res.setHeader('X-Token-Age', tokenAge);
        res.setHeader('X-Token-Max-Age', maxAge);
      }
      
      // Si le token expire dans moins de 2 minutes, forcer le refresh
      if (tokenAge > 13 * 60) {
        res.setHeader('X-Token-Refresh-Required', 'true');
      }
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

/**
 * Middleware pour les endpoints sensibles
 * Force le refresh des tokens anciens
 */
const requireFreshToken = (maxAgeMinutes = 5) => {
  return (req, res, next) => {
    if (!req.user || !req.user.tokenIssuedAt) {
      return next();
    }
    
    const now = Math.floor(Date.now() / 1000);
    const tokenAge = now - req.user.tokenIssuedAt;
    const maxAgeSeconds = maxAgeMinutes * 60;
    
    if (tokenAge > maxAgeSeconds) {
      logger.warn(`🔄 Token trop ancien pour opération sensible (${tokenAge}s > ${maxAgeSeconds}s)`);
      return res.status(401).json({
        error: 'Token trop ancien pour cette opération',
        code: 'TOKEN_TOO_OLD',
        tokenAge,
        maxAge: maxAgeSeconds,
        refreshRequired: true
      });
    }
    
    next();
  };
};

/**
 * Intercepteur global pour détecter les tokens expirés
 */
const tokenExpirationInterceptor = (req, res, next) => {
  // Intercepter les erreurs 401 pour ajouter des infos de refresh
  const originalStatus = res.status;
  
  res.status = function(code) {
    if (code === 401) {
      res.setHeader('X-Token-Expired', 'true');
      res.setHeader('X-Refresh-Endpoint', '/api/auth/refresh');
      res.setHeader('X-Auto-Refresh-Endpoint', '/api/auth/auto-refresh');
    }
    
    return originalStatus.call(this, code);
  };
  
  next();
};

/**
 * Configuration pour le frontend SPA
 */
const corsWithTokenHeaders = (req, res, next) => {
  // Exposer les headers custom au frontend
  res.setHeader('Access-Control-Expose-Headers', [
    'X-Token-Refresh-Suggested',
    'X-Token-Refresh-Required',
    'X-Token-Age',
    'X-Token-Max-Age',
    'X-Token-Expired',
    'X-Refresh-Endpoint',
    'X-Auto-Refresh-Endpoint'
  ].join(', '));
  
  next();
};

module.exports = {
  autoRefreshHeaders,
  requireFreshToken,
  tokenExpirationInterceptor,
  corsWithTokenHeaders
};