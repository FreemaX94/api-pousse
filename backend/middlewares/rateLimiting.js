/**
 * Rate Limiting Granulaire avec Redis Store
 * Configuration adaptée selon les endpoints et utilisateurs
 */

const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('../config/redis'); // Utilise la config Redis existante
const logger = require('../utils/logger');

/**
 * Store Redis pour partager les limites entre instances
 */
const createRedisStore = () => {
  try {
    return new RedisStore({
      sendCommand: (...args) => redis.sendCommand(args),
      prefix: 'rl:', // Rate Limit prefix
    });
  } catch (error) {
    logger.warn('⚠️ Redis Store non disponible, utilisation mémoire:', error.message);
    return undefined; // Fallback vers MemoryStore
  }
};

/**
 * Configuration des limites par endpoint
 */
const rateLimitConfigs = {
  // Authentification - Très restrictif
  auth: {
    login: { window: 15 * 60 * 1000, max: 5, message: 'Trop de tentatives de connexion' },
    register: { window: 60 * 60 * 1000, max: 3, message: 'Trop de créations de compte' },
    resetPassword: { window: 60 * 60 * 1000, max: 2, message: 'Trop de demandes de reset' },
    refreshToken: { window: 5 * 60 * 1000, max: 10, message: 'Trop de rafraîchissements de token' }
  },

  // API externes - Limites adaptées pour usage intensif
  external: {
    nieuwkoop: { window: 60 * 1000, max: 500, message: 'Limite API Nieuwkoop atteinte' },
    email: { window: 60 * 1000, max: 50, message: 'Trop d\'emails envoyés' },
    upload: { window: 60 * 1000, max: 100, message: 'Trop d\'uploads' }
  },

  // API standard - Limites adaptées pour usage professionnel
  api: {
    general: { window: 15 * 60 * 1000, max: 5000, message: 'Limite API générale atteinte' },
    search: { window: 60 * 1000, max: 1000, message: 'Trop de recherches' },
    crud: { window: 60 * 1000, max: 1500, message: 'Trop d\'opérations CRUD' }
  },

  // Admin - Limites élevées mais surveillées
  admin: {
    operations: { window: 60 * 1000, max: 500, message: 'Limite admin atteinte' },
    users: { window: 60 * 1000, max: 100, message: 'Trop d\'opérations utilisateurs' },
    reports: { window: 60 * 1000, max: 50, message: 'Trop de génération de rapports' }
  }
};

/**
 * Créer un middleware de rate limiting
 */
const createRateLimit = (config, options = {}) => {
  const {
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    keyGenerator = (req) => req.ip,
    skip = () => false,
    onLimitReached = null
  } = options;

  return rateLimit({
    windowMs: config.window,
    max: config.max,
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore(),
    skipSuccessfulRequests,
    skipFailedRequests,
    keyGenerator,
    skip,
    
    handler: (req, res, next) => {
      const endpoint = req.route?.path || req.path;
      const userInfo = req.user ? `user:${req.user.id}` : `ip:${req.ip}`;
      
      logger.warn(`🚨 Rate limit exceeded: ${userInfo} on ${endpoint}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint,
        userId: req.user?.id,
        remainingAttempts: 0
      });

      // Callback personnalisé si fourni
      if (onLimitReached) {
        onLimitReached(req, res, next);
      }

      res.status(429).json({
        error: config.message || 'Trop de requêtes',
        retryAfter: Math.ceil(config.window / 1000),
        limit: config.max,
        window: config.window
      });
    },

    // Skip function pour bypasser certaines conditions
    skip: (req) => {
      // Bypass pour les tests en mode développement
      if (process.env.NODE_ENV === 'test') {
        return true;
      }

      // Bypass pour certaines IPs (développement local)
      if (process.env.NODE_ENV === 'development' && 
          ['127.0.0.1', '::1', 'localhost'].includes(req.ip)) {
        return false; // Appliquer quand même en dev pour tester
      }

      // Bypass personnalisé
      return skip(req);
    }
  });
};

/**
 * Rate limiting spécialisé par endpoint
 */
const rateLimiters = {
  // Authentification
  authLogin: createRateLimit(rateLimitConfigs.auth.login, {
    keyGenerator: (req) => `auth:login:${req.ip}:${req.body?.email || 'unknown'}`,
    skipSuccessfulRequests: false, // Compter même les succès pour la sécurité
    onLimitReached: (req, res, next) => {
      // Log spécial pour tentatives de brute force
      logger.error('🔒 Potential brute force attack detected', {
        ip: req.ip,
        email: req.body?.email,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
    }
  }),

  authRegister: createRateLimit(rateLimitConfigs.auth.register, {
    keyGenerator: (req) => `auth:register:${req.ip}`,
    skipFailedRequests: true // Ne pas compter les échecs de validation
  }),

  authResetPassword: createRateLimit(rateLimitConfigs.auth.resetPassword, {
    keyGenerator: (req) => `auth:reset:${req.body?.email || req.ip}`
  }),

  authRefreshToken: createRateLimit(rateLimitConfigs.auth.refreshToken, {
    keyGenerator: (req) => `auth:refresh:${req.user?.id || req.ip}`
  }),

  // API externes
  nieuwkoopAPI: createRateLimit(rateLimitConfigs.external.nieuwkoop, {
    keyGenerator: (req) => `nieuwkoop:${req.user?.id || req.ip}`,
    skipFailedRequests: true
  }),

  emailAPI: createRateLimit(rateLimitConfigs.external.email, {
    keyGenerator: (req) => `email:${req.user?.id || req.ip}`
  }),

  uploadAPI: createRateLimit(rateLimitConfigs.external.upload, {
    keyGenerator: (req) => `upload:${req.user?.id || req.ip}`,
    skip: (req) => {
      // Skip pour les admins
      return req.user?.role === 'admin';
    }
  }),

  // API général
  generalAPI: createRateLimit(rateLimitConfigs.api.general, {
    keyGenerator: (req) => {
      // Rate limit par utilisateur si connecté, sinon par IP
      return req.user ? `api:user:${req.user.id}` : `api:ip:${req.ip}`;
    },
    skipSuccessfulRequests: true
  }),

  searchAPI: createRateLimit(rateLimitConfigs.api.search, {
    keyGenerator: (req) => `search:${req.user?.id || req.ip}`
  }),

  crudAPI: createRateLimit(rateLimitConfigs.api.crud, {
    keyGenerator: (req) => `crud:${req.user?.id || req.ip}`,
    skipSuccessfulRequests: true
  }),

  // Admin
  adminOperations: createRateLimit(rateLimitConfigs.admin.operations, {
    keyGenerator: (req) => `admin:ops:${req.user?.id}`,
    skip: (req) => req.user?.role !== 'admin' // Applique seulement aux admins
  }),

  adminUsers: createRateLimit(rateLimitConfigs.admin.users, {
    keyGenerator: (req) => `admin:users:${req.user?.id}`
  }),

  adminReports: createRateLimit(rateLimitConfigs.admin.reports, {
    keyGenerator: (req) => `admin:reports:${req.user?.id}`
  })
};

/**
 * Middleware intelligent qui choisit le bon rate limiter
 */
const smartRateLimit = (req, res, next) => {
  const path = req.path;
  const method = req.method;

  // Mapping des chemins vers les limiters appropriés
  const pathMappings = [
    { pattern: /^\/api\/auth\/login/, limiter: rateLimiters.authLogin },
    { pattern: /^\/api\/auth\/register/, limiter: rateLimiters.authRegister },
    { pattern: /^\/api\/auth\/reset-password/, limiter: rateLimiters.authResetPassword },
    { pattern: /^\/api\/auth\/refresh/, limiter: rateLimiters.authRefreshToken },
    
    { pattern: /^\/api\/nieuwkoop/, limiter: rateLimiters.nieuwkoopAPI },
    { pattern: /^\/api\/email/, limiter: rateLimiters.emailAPI },
    { pattern: /^\/api\/upload/, limiter: rateLimiters.uploadAPI },
    
    { pattern: /^\/api\/search/, limiter: rateLimiters.searchAPI },
    { pattern: /^\/api\/admin\/users/, limiter: rateLimiters.adminUsers },
    { pattern: /^\/api\/admin\/reports/, limiter: rateLimiters.adminReports },
    { pattern: /^\/api\/admin/, limiter: rateLimiters.adminOperations },
    
    // CRUD operations
    { pattern: /^\/api\/.+/, limiter: method !== 'GET' ? rateLimiters.crudAPI : rateLimiters.generalAPI }
  ];

  // Trouve le premier pattern qui match
  const mapping = pathMappings.find(m => m.pattern.test(path));
  const limiter = mapping?.limiter || rateLimiters.generalAPI;

  // Applique le rate limiter approprié
  limiter(req, res, next);
};

/**
 * Middleware de monitoring des rate limits
 */
const rateLimitMonitoring = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Log si proche de la limite
    const remaining = parseInt(res.get('RateLimit-Remaining')) || 0;
    const limit = parseInt(res.get('RateLimit-Limit')) || 0;
    
    if (remaining < limit * 0.1 && remaining > 0) { // Moins de 10% restant
      logger.warn(`⚠️ Rate limit warning: ${req.user?.id || req.ip} has ${remaining}/${limit} requests remaining on ${req.path}`);
    }

    return originalSend.call(this, data);
  };

  next();
};

/**
 * Fonction pour obtenir les statistiques de rate limiting
 */
const getRateLimitStats = async () => {
  try {
    const keys = await redis.keys('rl:*');
    const stats = {
      totalKeys: keys.length,
      activeWindows: 0,
      topEndpoints: {},
      recentBlocks: []
    };

    // Analyser les clés pour obtenir des statistiques
    for (const key of keys.slice(0, 100)) { // Limiter pour performance
      try {
        const value = await redis.get(key);
        if (value) {
          const [, endpoint] = key.split(':');
          stats.topEndpoints[endpoint] = (stats.topEndpoints[endpoint] || 0) + parseInt(value);
          stats.activeWindows++;
        }
      } catch (err) {
        // Ignorer les erreurs sur les clés individuelles
      }
    }

    return stats;
  } catch (error) {
    logger.error('Erreur récupération stats rate limiting:', error);
    return { error: 'Stats non disponibles' };
  }
};

module.exports = {
  createRateLimit,
  rateLimiters,
  smartRateLimit,
  rateLimitMonitoring,
  getRateLimitStats,
  rateLimitConfigs
};