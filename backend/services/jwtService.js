// backend/services/jwtService.js
// Service JWT avancé avec rotation et blacklist

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const logger = require('../utils/logger');

// Store pour les tokens révoqués (en production, utiliser Redis)
const tokenBlacklist = new Map();
const refreshTokenStore = new Map();

// Configuration JWT sécurisée
const JWT_CONFIG = {
  access: {
    secret: process.env.JWT_SECRET,
    expiresIn: '15m', // Réduit à 15 minutes (au lieu de 8h)
    algorithm: 'HS256'
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh',
    expiresIn: '7d', // Réduit à 7 jours (au lieu de 30d)
    algorithm: 'HS256'
  },
  // Rotation automatique toutes les 6h
  rotationInterval: 6 * 60 * 60 * 1000, // 6 heures en ms
  // Nettoyage des tokens expirés toutes les heures
  cleanupInterval: 60 * 60 * 1000 // 1 heure
};

/**
 * Générer une paire de tokens (access + refresh) avec rotation
 */
const generateTokenPair = (payload) => {
  try {
    const tokenId = crypto.randomBytes(16).toString('hex');
    const issuedAt = Math.floor(Date.now() / 1000);
    
    // Access Token (courte durée, contient les infos utilisateur)
    const accessTokenPayload = {
      ...payload,
      tokenId,
      iat: issuedAt,
      type: 'access'
    };
    
    // Refresh Token (longue durée, minimal info)
    const refreshTokenPayload = {
      userId: payload.userId,
      tokenId,
      iat: issuedAt,
      type: 'refresh'
    };
    
    const accessToken = jwt.sign(accessTokenPayload, JWT_CONFIG.access.secret, {
      expiresIn: JWT_CONFIG.access.expiresIn,
      algorithm: JWT_CONFIG.access.algorithm
    });
    
    const refreshToken = jwt.sign(refreshTokenPayload, JWT_CONFIG.refresh.secret, {
      expiresIn: JWT_CONFIG.refresh.expiresIn,
      algorithm: JWT_CONFIG.refresh.algorithm
    });
    
    // Stocker le refresh token pour validation
    refreshTokenStore.set(tokenId, {
      userId: payload.userId,
      createdAt: new Date(),
      lastUsed: new Date(),
      revoked: false
    });
    
    logger.info(`🔑 Nouvelle paire de tokens générée pour user ${payload.userId} (tokenId: ${tokenId})`);
    
    return {
      accessToken,
      refreshToken,
      tokenId,
      expiresIn: JWT_CONFIG.access.expiresIn,
      accessExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      refreshExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
    };
    
  } catch (error) {
    logger.error('❌ Erreur génération tokens:', error);
    throw new Error('Impossible de générer les tokens');
  }
};

/**
 * Vérifier et décoder un access token
 */
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.access.secret);
    
    // Vérifier que le token n'est pas blacklisté
    if (isTokenBlacklisted(token)) {
      throw new Error('Token révoqué');
    }
    
    // Vérifier le type de token
    if (decoded.type !== 'access') {
      throw new Error('Type de token invalide');
    }
    
    return decoded;
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expiré');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token invalide');
    }
    throw error;
  }
};

/**
 * Vérifier et décoder un refresh token
 */
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.refresh.secret);
    
    // Vérifier que le token n'est pas blacklisté
    if (isTokenBlacklisted(token)) {
      throw new Error('Refresh token révoqué');
    }
    
    // Vérifier le type de token
    if (decoded.type !== 'refresh') {
      throw new Error('Type de token invalide');
    }
    
    // Vérifier que le tokenId existe dans le store
    const storedToken = refreshTokenStore.get(decoded.tokenId);
    if (!storedToken || storedToken.revoked) {
      throw new Error('Refresh token non trouvé ou révoqué');
    }
    
    // Mettre à jour la dernière utilisation
    storedToken.lastUsed = new Date();
    refreshTokenStore.set(decoded.tokenId, storedToken);
    
    return decoded;
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expiré');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Refresh token invalide');
    }
    throw error;
  }
};

/**
 * Rafraîchir les tokens (rotation automatique)
 */
const refreshTokens = async (refreshToken, userPayload) => {
  try {
    // Vérifier le refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Révoquer l'ancien refresh token
    revokeToken(refreshToken);
    
    // Générer une nouvelle paire
    const newTokens = generateTokenPair(userPayload);
    
    logger.info(`🔄 Tokens rafraîchis pour user ${decoded.userId}`);
    
    return newTokens;
    
  } catch (error) {
    logger.error('❌ Erreur refresh tokens:', error);
    throw error;
  }
};

/**
 * Révoquer un token (ajout à la blacklist)
 */
const revokeToken = (token) => {
  try {
    // Ajouter à la blacklist avec expiration
    const now = Date.now();
    tokenBlacklist.set(token, {
      revokedAt: now,
      // Expirer après la durée maximale d'un refresh token
      expiresAt: now + (7 * 24 * 60 * 60 * 1000)
    });
    
    // Si c'est un refresh token, marquer comme révoqué dans le store
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.tokenId) {
        const storedToken = refreshTokenStore.get(decoded.tokenId);
        if (storedToken) {
          storedToken.revoked = true;
          refreshTokenStore.set(decoded.tokenId, storedToken);
        }
      }
    } catch (e) {
      // Ignorer les erreurs de décodage
    }
    
    logger.info('🚫 Token révoqué et ajouté à la blacklist');
    
  } catch (error) {
    logger.error('❌ Erreur révocation token:', error);
    throw error;
  }
};

/**
 * Vérifier si un token est blacklisté
 */
const isTokenBlacklisted = (token) => {
  const blacklistEntry = tokenBlacklist.get(token);
  if (!blacklistEntry) return false;
  
  // Vérifier si l'entrée blacklist a expiré
  if (Date.now() > blacklistEntry.expiresAt) {
    tokenBlacklist.delete(token);
    return false;
  }
  
  return true;
};

/**
 * Révoquer tous les tokens d'un utilisateur
 */
const revokeAllUserTokens = (userId) => {
  try {
    let revokedCount = 0;
    
    // Parcourir tous les refresh tokens stockés
    for (const [tokenId, tokenData] of refreshTokenStore.entries()) {
      if (tokenData.userId === userId && !tokenData.revoked) {
        tokenData.revoked = true;
        refreshTokenStore.set(tokenId, tokenData);
        revokedCount++;
      }
    }
    
    logger.info(`🚫 ${revokedCount} tokens révoqués pour user ${userId}`);
    return revokedCount;
    
  } catch (error) {
    logger.error('❌ Erreur révocation tokens utilisateur:', error);
    throw error;
  }
};

/**
 * Nettoyer les tokens expirés
 */
const cleanupExpiredTokens = () => {
  try {
    const now = Date.now();
    let cleanedBlacklist = 0;
    let cleanedRefresh = 0;
    
    // Nettoyer la blacklist
    for (const [token, entry] of tokenBlacklist.entries()) {
      if (now > entry.expiresAt) {
        tokenBlacklist.delete(token);
        cleanedBlacklist++;
      }
    }
    
    // Nettoyer les refresh tokens expirés
    for (const [tokenId, tokenData] of refreshTokenStore.entries()) {
      const age = now - tokenData.createdAt.getTime();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 jours
      
      if (age > maxAge || tokenData.revoked) {
        refreshTokenStore.delete(tokenId);
        cleanedRefresh++;
      }
    }
    
    if (cleanedBlacklist > 0 || cleanedRefresh > 0) {
      logger.info(`🧹 Nettoyage: ${cleanedBlacklist} blacklist, ${cleanedRefresh} refresh tokens`);
    }
    
  } catch (error) {
    logger.error('❌ Erreur nettoyage tokens:', error);
  }
};

/**
 * Obtenir les statistiques des tokens
 */
const getTokenStats = () => {
  return {
    blacklistedTokens: tokenBlacklist.size,
    activeRefreshTokens: Array.from(refreshTokenStore.values()).filter(t => !t.revoked).length,
    revokedRefreshTokens: Array.from(refreshTokenStore.values()).filter(t => t.revoked).length,
    totalRefreshTokens: refreshTokenStore.size
  };
};

/**
 * Vérifier si un token expire bientôt (pour rotation proactive)
 */
const shouldRotateToken = (decoded) => {
  if (!decoded.exp) return false;
  
  const now = Math.floor(Date.now() / 1000);
  const timeToExpiry = decoded.exp - now;
  const rotationThreshold = 5 * 60; // 5 minutes avant expiration
  
  return timeToExpiry <= rotationThreshold;
};

// Nettoyage automatique périodique
setInterval(cleanupExpiredTokens, JWT_CONFIG.cleanupInterval);

module.exports = {
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  refreshTokens,
  revokeToken,
  revokeAllUserTokens,
  isTokenBlacklisted,
  shouldRotateToken,
  getTokenStats,
  cleanupExpiredTokens,
  JWT_CONFIG
};