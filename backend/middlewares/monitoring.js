/**
 * Middleware de monitoring pour API Pousse
 * Intégration avec New Relic APM
 */

const logger = require('../utils/logger');

// Helper pour New Relic (désactivé temporairement)
let newrelic = null;
try {
  // newrelic = require('newrelic');
} catch (err) {
  // New Relic pas disponible
}

// Safe wrapper pour New Relic
const safeNewRelic = {
  setTransactionName: (type, name) => newrelic?.setTransactionName?.(type, name),
  addCustomAttributes: (attrs) => newrelic?.addCustomAttributes?.(attrs),
  recordCustomEvent: (name, attrs) => newrelic?.recordCustomEvent?.(name, attrs),
  recordMetric: (name, value) => newrelic?.recordMetric?.(name, value),
  noticeError: (err, attrs) => newrelic?.noticeError?.(err, attrs)
};

// 📊 Middleware APM pour toutes les requêtes
const apmMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  // Nommer la transaction de manière significative
  const routeName = req.route?.path || req.path;
  safeNewRelic.setTransactionName('web', `${req.method} ${routeName}`);
      
      // Ajouter des attributs de requête
      safeNewRelic.addCustomAttributes({
        'user.id': req.user?.id || 'anonymous',
        'user.role': req.user?.role || 'guest',
        'request.route': routeName,
        'request.userAgent': req.get('User-Agent'),
        'request.ip': req.ip,
        'request.contentLength': req.get('Content-Length') || 0
      });
      
    } catch (error) {
      // New Relic pas installé, continuer silencieusement
      logger.debug('New Relic not available:', error.message);
    }
  }
  
  // Intercepter la réponse pour mesurer la durée
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Log des métriques
    logger.info(`${req.method} ${req.path}`, {
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id
    });
    
    // Enregistrer les métriques personnalisées
    try {
      // New Relic désactivé temporairement
      
      // Événement personnalisé pour chaque appel API
      safeNewRelic.recordCustomEvent('ApiCall', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        userId: req.user?.id || 'anonymous',
        userAgent: req.get('User-Agent'),
        contentLength: parseInt(req.get('Content-Length')) || 0,
        responseSize: parseInt(res.get('Content-Length')) || 0
      });
      
      // Métriques de performance par endpoint
      const endpoint = req.path.replace(/\/\d+/g, '/:id'); // Normaliser les IDs
      safeNewRelic.recordMetric(`Custom/API/ResponseTime/${endpoint}`, duration);
      safeNewRelic.recordMetric(`Custom/API/StatusCode/${res.statusCode}`, 1);
      
      // Alertes pour les réponses lentes
      if (duration > 1000) {
        safeNewRelic.recordMetric('Custom/API/SlowResponse', duration);
      }
      
      // Alertes pour les erreurs
      if (res.statusCode >= 400) {
        safeNewRelic.recordMetric(`Custom/API/Error/${res.statusCode}`, 1);
      }
      
    } catch (error) {
      // Continuer sans New Relic
    }
  });
  
  next();
};

// 🎯 Middleware spécifique pour les opérations business critiques
const businessMetricsMiddleware = (operationType) => {
  return (req, res, next) => {
    const startTime = Date.now();
    
    // Intercepter la réponse
    const originalSend = res.send;
    res.send = function(data) {
      const duration = Date.now() - startTime;
      
      try {
        // New Relic désactivé temporairement
        
        // Métriques business spécifiques
        safeNewRelic.recordCustomEvent('BusinessOperation', {
          type: operationType,
          success: res.statusCode < 400,
          duration,
          userId: req.user?.id,
          timestamp: Date.now()
        });
        
        // Métriques spécifiques par type d'opération
        switch (operationType) {
          case 'nieuwkoop_search':
            const searchData = typeof data === 'string' ? JSON.parse(data) : data;
            safeNewRelic.recordCustomEvent('CatalogSearch', {
              resultsCount: Array.isArray(searchData) ? searchData.length : 0,
              searchTerm: req.query.search || req.body.search,
              duration
            });
            break;
            
          case 'stock_operation':
            safeNewRelic.recordCustomEvent('StockOperation', {
              operation: req.method,
              quantity: req.body.quantity,
              value: req.body.price * req.body.quantity,
              duration
            });
            break;
            
          case 'invoice_creation':
            safeNewRelic.recordCustomEvent('Invoice', {
              amount: req.body.total,
              itemsCount: req.body.items?.length || 0,
              duration
            });
            break;
        }
        
      } catch (error) {
        // Continuer sans New Relic
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};

// 🚨 Middleware de gestion d'erreurs avec APM
const errorTrackingMiddleware = (err, req, res, next) => {
  try {
    // New Relic désactivé temporairement
    
    // Enrichir l'erreur avec le contexte
    safeNewRelic.noticeError(err, {
      'request.method': req.method,
      'request.path': req.path,
      'request.query': JSON.stringify(req.query),
      'user.id': req.user?.id || 'anonymous',
      'error.context': 'api-middleware'
    });
    
    // Métrique d'erreur
    safeNewRelic.recordCustomEvent('ApplicationError', {
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode || 500,
      path: req.path,
      method: req.method,
      userId: req.user?.id
    });
    
  } catch (newrelicError) {
    // Continuer sans New Relic
  }
  
  // Log l'erreur
  logger.error('Application error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id
  });
  
  next(err);
};

// 📈 Middleware pour les métriques de base de données
const databaseMetricsMiddleware = () => {
  // Hook Mongoose pour monitorer les requêtes
  if (typeof require !== 'undefined') {
    try {
      const mongoose = require('mongoose');
      // New Relic désactivé temporairement
      
      // Monitorer les requêtes MongoDB
      mongoose.set('debug', (collection, method, query, doc) => {
        const startTime = Date.now();
        
        // Enregistrer la requête
        safeNewRelic.recordCustomEvent('DatabaseQuery', {
          collection,
          method,
          querySize: JSON.stringify(query).length,
          timestamp: Date.now()
        });
        
        // Métrique de performance DB
        safeNewRelic.recordMetric(`Custom/Database/${collection}/${method}`, Date.now() - startTime);
      });
      
    } catch (error) {
      // MongoDB monitoring non disponible
    }
  }
  
  return (req, res, next) => next();
};

// 🔄 Middleware pour les métriques de cache
const cacheMetricsMiddleware = (cacheType = 'default') => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      try {
        // New Relic désactivé temporairement
        
        const cacheStatus = res.get('X-Cache-Status') || 'MISS';
        
        safeNewRelic.recordCustomEvent('CacheOperation', {
          type: cacheType,
          status: cacheStatus,
          path: req.path,
          hit: cacheStatus === 'HIT'
        });
        
        safeNewRelic.recordMetric(`Custom/Cache/${cacheType}/${cacheStatus}`, 1);
        
      } catch (error) {
        // Continuer sans New Relic
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};

module.exports = {
  apmMiddleware,
  businessMetricsMiddleware,
  errorTrackingMiddleware,
  databaseMetricsMiddleware,
  cacheMetricsMiddleware
};