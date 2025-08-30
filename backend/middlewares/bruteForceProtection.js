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
 * Protection brute force désactivée pour permettre plusieurs connexions simultanées
 */
const bruteForceProtection = (req, res, next) => {
  next(); // Désactivé
};

/**
 * Enregistrement des tentatives échouées désactivé
 */
const recordFailedAttempt = (req, type = 'login') => {
  return 0; // Désactivé
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
 * Rate limiter progressif désactivé
 */
const progressiveRateLimit = (req, res, next) => next(); // Désactivé

/**
 * Nettoyage désactivé
 */
const cleanupOldEntries = () => {
  // Désactivé
};

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