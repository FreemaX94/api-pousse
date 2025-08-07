// backend/middlewares/errorHandler.js
// Gestionnaire d'erreurs avancé avec sécurité production

const logger = require('../utils/logger');
const { redisManager } = require('../config/redis');

/**
 * Types d'erreurs reconnus
 */
const ERROR_TYPES = {
  VALIDATION: 'ValidationError',
  CAST: 'CastError',
  DUPLICATE: 'DuplicateKeyError', 
  JWT: 'JsonWebTokenError',
  TOKEN_EXPIRED: 'TokenExpiredError',
  MONGO: 'MongoError',
  NETWORK: 'NetworkError',
  RATE_LIMIT: 'RateLimitError',
  BUSINESS: 'BusinessLogicError'
};

/**
 * Codes d'erreur standardisés
 */
const ERROR_CODES = {
  VALIDATION_FAILED: 'E1001',
  RESOURCE_NOT_FOUND: 'E1002',
  UNAUTHORIZED: 'E1003',
  FORBIDDEN: 'E1004',
  DUPLICATE_RESOURCE: 'E1005',
  RATE_LIMIT_EXCEEDED: 'E1006',
  INTERNAL_ERROR: 'E1007',
  SERVICE_UNAVAILABLE: 'E1008',
  DATABASE_ERROR: 'E1009',
  EXTERNAL_API_ERROR: 'E1010'
};

/**
 * Nettoie et sécurise les stack traces pour la production
 */
const sanitizeStackTrace = (error, isProduction = false) => {
  if (!isProduction) {
    return error.stack;
  }
  
  // En production, ne pas exposer les chemins internes
  const sanitized = error.stack
    ?.split('\n')
    ?.filter(line => {
      // Filtrer les lignes sensibles
      return !line.includes('node_modules') && 
             !line.includes('internal/') &&
             !line.includes(process.cwd());
    })
    ?.slice(0, 3) // Limiter à 3 lignes
    ?.join('\n');
    
  return sanitized || 'Stack trace not available in production';
};

/**
 * Détermine si une erreur est sensible (ne pas exposer)
 */
const isSensitiveError = (error) => {
  const sensitivePatterns = [
    /password/i,
    /secret/i,
    /token/i,
    /key/i,
    /credential/i,
    /auth/i,
    /connection string/i,
    /mongodb:/i
  ];
  
  const errorString = JSON.stringify(error).toLowerCase();
  return sensitivePatterns.some(pattern => pattern.test(errorString));
};

/**
 * Crée une réponse d'erreur normalisée
 */
const createErrorResponse = (error, statusCode, errorCode, isProduction = false) => {
  const response = {
    success: false,
    error: {
      code: errorCode,
      message: error.message || 'Une erreur est survenue',
      type: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      requestId: error.requestId || null
    }
  };

  // En développement, ajouter plus de détails
  if (!isProduction) {
    response.error.details = {
      stack: sanitizeStackTrace(error, false),
      originalError: error.originalError?.message || null,
      statusCode: statusCode
    };
  }

  // Ajouter des suggestions d'action si possible
  if (statusCode === 400) {
    response.error.suggestion = 'Vérifiez les données envoyées et réessayez';
  } else if (statusCode === 401) {
    response.error.suggestion = 'Authentifiez-vous et réessayez';
  } else if (statusCode === 429) {
    response.error.suggestion = 'Attendez un moment avant de réessayer';
  } else if (statusCode >= 500) {
    response.error.suggestion = 'Contactez le support si le problème persiste';
  }

  return response;
};

/**
 * Logger l'erreur avec le niveau approprié
 */
const logError = async (error, req, statusCode) => {
  const logData = {
    message: error.message,
    stack: error.stack,
    statusCode,
    method: req?.method,
    url: req?.originalUrl,
    userAgent: req?.get('User-Agent'),
    ip: req?.ip,
    userId: req?.user?.id,
    requestId: req?.id,
    timestamp: new Date().toISOString()
  };

  // Niveau de log selon la gravité
  if (statusCode >= 500) {
    logger.error('🚨 Erreur serveur critique:', logData);
    
    // Alerter en cas d'erreur critique
    await alertCriticalError(error, logData);
  } else if (statusCode >= 400) {
    logger.warn('⚠️ Erreur client:', logData);
  } else {
    logger.info('ℹ️ Erreur gérée:', logData);
  }
};

/**
 * Système d'alerte pour erreurs critiques
 */
const alertCriticalError = async (error, logData) => {
  try {
    // Compter les erreurs similaires
    const errorKey = `error:${error.name}:${error.message}`;
    const count = await redisManager.get(errorKey) || 0;
    await redisManager.set(errorKey, count + 1, 300); // 5 minutes

    // Alerter si trop d'erreurs similaires
    if (count > 5) {
      logger.error('🚨 ALERTE: Erreur critique répétée:', {
        error: error.message,
        count: count + 1,
        details: logData
      });
      
      // Ici on pourrait envoyer un email/Slack/etc.
      // await sendCriticalAlert(error, logData);
    }
  } catch (alertError) {
    logger.error('❌ Erreur système alerte:', alertError.message);
  }
};

/**
 * Gestionnaire spécialisé pour les erreurs MongoDB
 */
const handleMongoError = (error) => {
  let statusCode = 500;
  let errorCode = ERROR_CODES.DATABASE_ERROR;
  let message = 'Erreur de base de données';

  if (error.name === 'ValidationError') {
    statusCode = 400;
    errorCode = ERROR_CODES.VALIDATION_FAILED;
    const messages = Object.values(error.errors).map(e => e.message);
    message = `Erreur de validation: ${messages.join(', ')}`;
  } else if (error.name === 'CastError') {
    statusCode = 400;
    errorCode = ERROR_CODES.VALIDATION_FAILED;
    message = `Format invalide pour ${error.path}: ${error.value}`;
  } else if (error.code === 11000) {
    statusCode = 409;
    errorCode = ERROR_CODES.DUPLICATE_RESOURCE;
    const field = Object.keys(error.keyPattern)[0];
    message = `Cette valeur existe déjà pour ${field}`;
  }

  return { statusCode, errorCode, message };
};

/**
 * Gestionnaire spécialisé pour les erreurs JWT
 */
const handleJWTError = (error) => {
  let statusCode = 401;
  let errorCode = ERROR_CODES.UNAUTHORIZED;
  let message = 'Token invalide';

  if (error.name === 'TokenExpiredError') {
    message = 'Token expiré';
  } else if (error.name === 'JsonWebTokenError') {
    message = 'Token malformé';
  }

  return { statusCode, errorCode, message };
};

/**
 * Gestionnaire spécialisé pour les erreurs de validation Celebrate/Joi
 */
const handleValidationError = (error) => {
  const details = error.details?.map(detail => ({
    field: detail.path?.join('.'),
    message: detail.message,
    value: detail.context?.value
  })) || [];

  return {
    statusCode: 400,
    errorCode: ERROR_CODES.VALIDATION_FAILED,
    message: 'Données de requête invalides',
    details
  };
};

/**
 * Middleware principal de gestion d'erreurs
 */
const errorHandler = async (error, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  let statusCode = error.statusCode || error.status || 500;
  let errorCode = ERROR_CODES.INTERNAL_ERROR;
  let processedError = { ...error };

  // Traitement spécialisé selon le type d'erreur
  if (error.name?.includes('Mongo') || error.name === 'ValidationError' || error.name === 'CastError' || error.code === 11000) {
    const mongoResult = handleMongoError(error);
    statusCode = mongoResult.statusCode;
    errorCode = mongoResult.errorCode;
    processedError.message = mongoResult.message;
  } else if (error.name?.includes('JsonWebToken') || error.name === 'TokenExpiredError') {
    const jwtResult = handleJWTError(error);
    statusCode = jwtResult.statusCode;
    errorCode = jwtResult.errorCode;
    processedError.message = jwtResult.message;
  } else if (error.isJoi || error.name === 'ValidationError' && error.details) {
    const validationResult = handleValidationError(error);
    statusCode = validationResult.statusCode;
    errorCode = validationResult.errorCode;
    processedError.message = validationResult.message;
    processedError.validationDetails = validationResult.details;
  } else if (error.type === 'entity.too.large') {
    statusCode = 413;
    errorCode = ERROR_CODES.VALIDATION_FAILED;
    processedError.message = 'Fichier trop volumineux';
  } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    statusCode = 503;
    errorCode = ERROR_CODES.SERVICE_UNAVAILABLE;
    processedError.message = 'Service externe indisponible';
  }

  // Sécurité: Ne pas exposer les erreurs sensibles
  if (isSensitiveError(processedError) && isProduction) {
    processedError.message = 'Une erreur interne est survenue';
    delete processedError.stack;
  }

  // Logger l'erreur
  await logError(processedError, req, statusCode);

  // Créer la réponse d'erreur
  const errorResponse = createErrorResponse(processedError, statusCode, errorCode, isProduction);

  // Headers de sécurité
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  // Envoyer la réponse
  res.status(statusCode).json(errorResponse);
};

/**
 * Middleware pour les routes non trouvées
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route non trouvée: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  error.name = 'NotFoundError';
  next(error);
};

/**
 * Middleware pour capturer les erreurs async
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Gestionnaire pour les erreurs non capturées
 */
const unhandledErrorHandler = () => {
  process.on('uncaughtException', (error) => {
    logger.error('🚨 Exception non capturée:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // Arrêt gracieux
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('🚨 Promise rejetée non gérée:', {
      reason: reason?.message || reason,
      stack: reason?.stack,
      promise: promise,
      timestamp: new Date().toISOString()
    });
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  unhandledErrorHandler,
  ERROR_CODES,
  ERROR_TYPES
};