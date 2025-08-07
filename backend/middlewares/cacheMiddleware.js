// backend/middlewares/cacheMiddleware.js
// Middleware de cache Redis pour les réponses API

const { redisManager } = require('../config/redis');
const logger = require('../utils/logger');

/**
 * Middleware de cache pour les réponses GET
 * @param {number} ttl - Durée de vie du cache en secondes (défaut: 5 minutes)
 * @param {function} keyGenerator - Fonction pour générer la clé de cache personnalisée
 */
const cacheMiddleware = (ttl = 300, keyGenerator = null) => {
  return async (req, res, next) => {
    // Ne cacher que les requêtes GET
    if (req.method !== 'GET') {
      return next();
    }

    // Générer la clé de cache
    let cacheKey;
    if (keyGenerator && typeof keyGenerator === 'function') {
      cacheKey = keyGenerator(req);
    } else {
      // Clé par défaut basée sur l'URL et les query params
      const url = req.originalUrl || req.url;
      const userId = req.user?.id || 'anonymous';
      cacheKey = `api:${req.method}:${url}:${userId}`;
    }

    try {
      // Vérifier le cache
      const cachedResponse = await redisManager.get(cacheKey);
      
      if (cachedResponse) {
        logger.debug(`🎯 Cache HIT: ${cacheKey}`);
        
        // Ajouter les headers de cache
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Cache-Key', cacheKey);
        
        return res.json(cachedResponse);
      }

      logger.debug(`💾 Cache MISS: ${cacheKey}`);
      
      // Intercepter la réponse pour la mettre en cache
      const originalJson = res.json;
      res.json = function(data) {
        // Sauvegarder en cache si la réponse est successful
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redisManager.set(cacheKey, data, ttl).catch(err => {
            logger.warn(`⚠️ Cache SET failed for ${cacheKey}:`, err.message);
          });
        }
        
        // Ajouter les headers de cache
        res.setHeader('X-Cache', 'MISS');
        res.setHeader('X-Cache-Key', cacheKey);
        
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      logger.error('❌ Cache middleware error:', error.message);
      // Continuer sans cache en cas d'erreur
      next();
    }
  };
};

/**
 * Cache spécialisé pour les listes paginées
 */
const cacheListMiddleware = (ttl = 180) => {
  return cacheMiddleware(ttl, (req) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const sort = req.query.sort || '';
    const filter = JSON.stringify(req.query.filter || {});
    const userId = req.user?.id || 'anonymous';
    
    return `list:${req.route.path}:p${page}:l${limit}:s${sort}:f${Buffer.from(filter).toString('base64')}:u${userId}`;
  });
};

/**
 * Cache pour les données statiques (longue durée)
 */
const cacheStaticMiddleware = (ttl = 3600) => {
  return cacheMiddleware(ttl, (req) => {
    return `static:${req.route.path}:${req.originalUrl}`;
  });
};

/**
 * Cache pour les données utilisateur (courte durée)
 */
const cacheUserMiddleware = (ttl = 60) => {
  return cacheMiddleware(ttl, (req) => {
    const userId = req.user?.id || 'anonymous';
    return `user:${userId}:${req.route.path}:${req.originalUrl}`;
  });
};

/**
 * Middleware pour invalider le cache après mutations
 */
const invalidateCacheMiddleware = (patterns = []) => {
  return async (req, res, next) => {
    // Hook sur la réponse pour invalider après succès
    const originalJson = res.json;
    res.json = function(data) {
      // Invalider le cache seulement si la réponse est successful
      if (res.statusCode >= 200 && res.statusCode < 300) {
        patterns.forEach(pattern => {
          redisManager.invalidatePattern(pattern).catch(err => {
            logger.warn(`⚠️ Cache invalidation failed for pattern ${pattern}:`, err.message);
          });
        });
      }
      
      return originalJson.call(this, data);
    };

    next();
  };
};

/**
 * Cache pour les requêtes de recherche
 */
const cacheSearchMiddleware = (ttl = 120) => {
  return cacheMiddleware(ttl, (req) => {
    const search = req.query.search || req.query.q || '';
    const filters = JSON.stringify(req.query.filter || {});
    const page = req.query.page || 1;
    
    return `search:${req.route.path}:${search}:${Buffer.from(filters).toString('base64')}:p${page}`;
  });
};

/**
 * Cache conditionnel basé sur les headers
 */
const conditionalCacheMiddleware = (ttl = 300, condition = null) => {
  return (req, res, next) => {
    // Vérifier la condition si fournie
    if (condition && !condition(req)) {
      return next();
    }
    
    // Vérifier les headers de cache du client
    const ifNoneMatch = req.headers['if-none-match'];
    const ifModifiedSince = req.headers['if-modified-since'];
    
    if (ifNoneMatch || ifModifiedSince) {
      // Le client a déjà une version en cache
      return res.status(304).end();
    }
    
    return cacheMiddleware(ttl)(req, res, next);
  };
};

module.exports = {
  cacheMiddleware,
  cacheListMiddleware,
  cacheStaticMiddleware,
  cacheUserMiddleware,
  cacheSearchMiddleware,
  conditionalCacheMiddleware,
  invalidateCacheMiddleware
};