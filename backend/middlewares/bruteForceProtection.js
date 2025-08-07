const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// Store pour les tentatives échouées (en production, utiliser Redis)
const failedAttempts = new Map();
const blockedIPs = new Map();

// Configuration
const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

/**
 * Protection avancée contre les attaques brute force
 */
const bruteForceProtection = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  // Vérifier si l'IP est bloquée
  if (blockedIPs.has(clientIP)) {
    const blockTime = blockedIPs.get(clientIP);
    if (now - blockTime < BLOCK_DURATION) {
      const remainingTime = Math.ceil((BLOCK_DURATION - (now - blockTime)) / 1000 / 60);
      logger.warn(`🚫 IP bloquée tentant d'accéder: ${clientIP}`);
      return res.status(429).json({
        error: `IP bloquée pour ${remainingTime} minutes suite à trop de tentatives échouées`,
        retryAfter: remainingTime * 60
      });
    } else {
      // Débloquer l'IP après expiration
      blockedIPs.delete(clientIP);
      failedAttempts.delete(clientIP);
    }
  }
  
  next();
};

/**
 * Enregistrer une tentative échouée
 */
const recordFailedAttempt = (req, type = 'login') => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!failedAttempts.has(clientIP)) {
    failedAttempts.set(clientIP, []);
  }
  
  const attempts = failedAttempts.get(clientIP);
  
  // Nettoyer les anciennes tentatives
  const recentAttempts = attempts.filter(attempt => 
    now - attempt.timestamp < ATTEMPT_WINDOW
  );
  
  // Ajouter la nouvelle tentative
  recentAttempts.push({
    timestamp: now,
    type,
    userAgent: req.get('User-Agent'),
    path: req.path
  });
  
  failedAttempts.set(clientIP, recentAttempts);
  
  logger.warn(`❌ Tentative ${type} échouée #${recentAttempts.length} pour IP: ${clientIP}`);
  
  // Bloquer si trop de tentatives
  if (recentAttempts.length >= MAX_FAILED_ATTEMPTS) {
    blockedIPs.set(clientIP, now);
    logger.error(`🚫 IP bloquée pour ${BLOCK_DURATION/1000/60}min: ${clientIP} (${recentAttempts.length} tentatives)`);
    
    // Optionnel: alerter l'admin
    if (recentAttempts.length >= MAX_FAILED_ATTEMPTS * 2) {
      logger.error(`🚨 ALERTE SÉCURITÉ: Attaque brute force détectée de ${clientIP}`);
    }
  }
  
  return recentAttempts.length;
};

/**
 * Enregistrer une tentative réussie (nettoie l'historique)
 */
const recordSuccessfulAttempt = (req) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (failedAttempts.has(clientIP)) {
    failedAttempts.delete(clientIP);
    logger.info(`✅ Connexion réussie, historique nettoyé pour IP: ${clientIP}`);
  }
};

/**
 * Rate limiter progressif (augmente avec les échecs)
 */
const progressiveRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const attempts = failedAttempts.get(clientIP) || [];
    
    // Réduire les tentatives autorisées basé sur l'historique
    if (attempts.length >= 3) return 2; // 2 tentatives après 3 échecs
    if (attempts.length >= 1) return 3; // 3 tentatives après 1 échec
    return 5; // 5 tentatives initiales
  },
  message: (req) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const attempts = failedAttempts.get(clientIP) || [];
    return {
      error: `Trop de tentatives (${attempts.length} échecs récents). Réessayez dans 15 minutes.`,
      failedAttempts: attempts.length
    };
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

/**
 * Nettoyer périodiquement les anciennes entrées
 */
const cleanupOldEntries = () => {
  const now = Date.now();
  
  // Nettoyer les tentatives expirées
  for (const [ip, attempts] of failedAttempts.entries()) {
    const recentAttempts = attempts.filter(attempt => 
      now - attempt.timestamp < ATTEMPT_WINDOW
    );
    
    if (recentAttempts.length === 0) {
      failedAttempts.delete(ip);
    } else {
      failedAttempts.set(ip, recentAttempts);
    }
  }
  
  // Nettoyer les IP bloquées expirées
  for (const [ip, blockTime] of blockedIPs.entries()) {
    if (now - blockTime >= BLOCK_DURATION) {
      blockedIPs.delete(ip);
      logger.info(`🔓 IP débloquée: ${ip}`);
    }
  }
};

// Nettoyer toutes les 5 minutes
setInterval(cleanupOldEntries, 5 * 60 * 1000);

module.exports = {
  bruteForceProtection,
  recordFailedAttempt,
  recordSuccessfulAttempt,
  progressiveRateLimit,
  // Stats pour monitoring
  getStats: () => ({
    failedAttempts: failedAttempts.size,
    blockedIPs: blockedIPs.size,
    totalBlocked: [...blockedIPs.values()].length
  })
};