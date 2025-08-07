const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// 🚀 New Relic Winston integration - DÉSACTIVÉ
let newrelicFormatter = null;
// try {
//   newrelicFormatter = require('@newrelic/winston-enricher')(winston);
// } catch (error) {
//   console.log('⚠️ New Relic Winston enricher non disponible');
// }

// 📁 Configuration des fichiers de logs
const logDir = path.join(__dirname, '..', 'logs');

// 🎨 Format JSON structuré pour api-pousse avec New Relic
const baseFormats = [
  winston.format.timestamp(),
  winston.format.errors({ stack: true })
];

// Ajouter le formatter New Relic si disponible
if (newrelicFormatter) {
  baseFormats.push(newrelicFormatter());
}

const jsonFormat = winston.format.combine(
  ...baseFormats,
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
    const logEntry = {
      timestamp,
      level,
      service: service || 'api-pousse-backend',
      message,
      ...meta
    };
    
    return JSON.stringify(logEntry);
  })
);

// 🎨 Format console coloré pour le développement
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  })
);

// 📝 Configuration des transports
const transports = [
  // Console pour développement avec couleurs
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? jsonFormat : consoleFormat,
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')
  }),
  
  // Fichier pour tous les logs (rotation quotidienne)
  new DailyRotateFile({
    filename: path.join(logDir, 'api-pousse-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: jsonFormat,
    level: 'debug'
  }),
  
  // Fichier séparé pour les erreurs
  new DailyRotateFile({
    filename: path.join(logDir, 'api-pousse-errors-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    format: jsonFormat,
    level: 'error'
  })
];

// 🚀 Création du logger Winston
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: jsonFormat,
  defaultMeta: { 
    service: 'api-pousse-backend',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },
  transports,
  exitOnError: false
});

// 📊 Méthodes structurées pour api-pousse
const structuredLogger = {
  // Logs système
  log: (message, meta = {}) => logger.info(message, meta),
  info: (message, meta = {}) => logger.info(message, meta),
  warn: (message, meta = {}) => logger.warn(message, meta),
  error: (message, meta = {}) => logger.error(message, meta),
  debug: (message, meta = {}) => logger.debug(message, meta),
  
  // 🔐 Logs d'authentification
  auth: {
    login: (userId, email, ip, userAgent) => logger.info('User login', {
      event: 'user_login',
      userId,
      email,
      ip,
      userAgent,
      category: 'authentication'
    }),
    
    logout: (userId, email) => logger.info('User logout', {
      event: 'user_logout',
      userId,
      email,
      category: 'authentication'
    }),
    
    loginFailed: (email, ip, reason) => logger.warn('Login failed', {
      event: 'login_failed',
      email,
      ip,
      reason,
      category: 'authentication'
    })
  },
  
  // 📦 Logs métier Nieuwkoop
  nieuwkoop: {
    search: (userId, query, resultsCount, duration) => logger.info('Nieuwkoop search', {
      event: 'nieuwkoop_search',
      userId,
      query,
      resultsCount,
      duration,
      category: 'business'
    }),
    
    stockUpdate: (userId, productId, oldQty, newQty) => logger.info('Stock updated', {
      event: 'stock_update',
      userId,
      productId,
      oldQuantity: oldQty,
      newQuantity: newQty,
      category: 'business'
    }),
    
    apiError: (endpoint, error, duration) => logger.error('Nieuwkoop API error', {
      event: 'nieuwkoop_api_error',
      endpoint,
      error: error.message,
      stack: error.stack,
      duration,
      category: 'integration'
    })
  },
  
  // 💰 Logs factures et finances
  invoice: {
    created: (userId, invoiceId, amount, clientId) => logger.info('Invoice created', {
      event: 'invoice_created',
      userId,
      invoiceId,
      amount,
      clientId,
      category: 'business'
    }),
    
    paid: (invoiceId, amount, paymentMethod) => logger.info('Invoice paid', {
      event: 'invoice_paid',
      invoiceId,
      amount,
      paymentMethod,
      category: 'business'
    })
  },
  
  // 📊 Logs performance
  performance: {
    slowQuery: (query, duration, collection) => logger.warn('Slow database query', {
      event: 'slow_query',
      query,
      duration,
      collection,
      category: 'performance'
    }),
    
    apiResponse: (endpoint, method, statusCode, duration, userId) => logger.info('API response', {
      event: 'api_response',
      endpoint,
      method,
      statusCode,
      duration,
      userId,
      category: 'performance'
    })
  },
  
  // ⚠️ Logs sécurité
  security: {
    suspiciousActivity: (userId, activity, ip, details) => logger.warn('Suspicious activity', {
      event: 'suspicious_activity',
      userId,
      activity,
      ip,
      details,
      category: 'security'
    }),
    
    rateLimitHit: (ip, endpoint, limit) => logger.warn('Rate limit exceeded', {
      event: 'rate_limit_exceeded',
      ip,
      endpoint,
      limit,
      category: 'security'
    })
  }
};

// Créer le dossier logs s'il n'existe pas
const fs = require('fs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

module.exports = structuredLogger;
