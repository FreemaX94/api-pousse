/**
 * Custom Business Metrics pour API Pousse
 * Système de métriques métier avec New Relic et fallback local
 */

const logger = require('./logger');

/**
 * Wrapper pour New Relic avec fallback gracieux
 */
class NewRelicWrapper {
  constructor() {
    this.newrelic = null;
    this.enabled = false;
    this.init();
  }

  init() {
    try {
      // Ne pas charger New Relic immédiatement
      if (global.newrelic) {
        this.newrelic = global.newrelic;
        this.enabled = true;
        logger.info('📊 New Relic metrics enabled');
      } else {
        this.enabled = false;
        logger.info('📊 Métriques locales activées (New Relic sera activé plus tard)');
      }
    } catch (error) {
      logger.warn('⚠️ New Relic non disponible, utilisation métriques locales');
      this.enabled = false;
    }
  }

  recordCustomEvent(eventType, attributes) {
    if (this.enabled && this.newrelic) {
      try {
        this.newrelic.recordCustomEvent(eventType, attributes);
      } catch (error) {
        logger.warn('Erreur enregistrement métrique New Relic:', error);
      }
    }
    
    // Fallback local : log structuré pour analyse
    logger.info(`📈 METRIC [${eventType}]`, attributes);
  }

  recordMetric(name, value) {
    if (this.enabled && this.newrelic) {
      try {
        this.newrelic.recordMetric(name, value);
      } catch (error) {
        logger.warn('Erreur enregistrement métrique New Relic:', error);
      }
    }
    
    logger.info(`📊 CUSTOM_METRIC [${name}]: ${value}`);
  }

  setTransactionName(name) {
    if (this.enabled && this.newrelic) {
      try {
        this.newrelic.setTransactionName('Custom', name);
      } catch (error) {
        logger.warn('Erreur définition nom transaction:', error);
      }
    }
  }

  addCustomAttribute(key, value) {
    if (this.enabled && this.newrelic) {
      try {
        this.newrelic.addCustomAttribute(key, value);
      } catch (error) {
        logger.warn('Erreur ajout attribut custom:', error);
      }
    }
  }
}

const newRelicWrapper = new NewRelicWrapper();

/**
 * Métriques métier pour l'application API Pousse
 */
class BusinessMetrics {
  
  /**
   * Enregistrer opération de stock
   */
  static recordStockOperation(operation, data) {
    const metrics = {
      operation: operation, // 'entry', 'exit', 'adjustment', 'transfer'
      category: data.category || 'unknown',
      value: data.totalValue || 0,
      quantity: data.quantity || 0,
      processingTime: data.duration || 0,
      userId: data.userId,
      stockId: data.stockId,
      location: data.location || 'default',
      supplier: data.supplier || null,
      timestamp: new Date().toISOString(),
      success: data.success !== false
    };

    newRelicWrapper.recordCustomEvent('StockOperation', metrics);

    // Métriques agrégées
    newRelicWrapper.recordMetric(`Custom/Stock/Operations/${operation}`, 1);
    newRelicWrapper.recordMetric(`Custom/Stock/Value/${operation}`, data.totalValue || 0);
    newRelicWrapper.recordMetric(`Custom/Stock/ProcessingTime`, data.duration || 0);

    // Alertes business
    if (data.duration > 5000) { // > 5 secondes
      this.recordAlert('slow_stock_operation', {
        operation,
        duration: data.duration,
        stockId: data.stockId
      });
    }

    if (data.quantity > 1000) { // Mouvement important
      this.recordAlert('large_stock_movement', {
        operation,
        quantity: data.quantity,
        value: data.totalValue
      });
    }
  }

  /**
   * Enregistrer recherche catalogue Nieuwkoop
   */
  static recordNieuwkoopSearch(searchData) {
    const metrics = {
      module: 'nieuwkoop',
      searchTerms: searchData.query || '',
      category: searchData.category || null,
      resultsCount: searchData.results?.length || 0,
      responseTime: searchData.duration || 0,
      cacheHit: searchData.fromCache || false,
      userId: searchData.userId,
      timestamp: new Date().toISOString(),
      filters: JSON.stringify(searchData.filters || {}),
      success: searchData.success !== false
    };

    newRelicWrapper.recordCustomEvent('CatalogSearch', metrics);

    // Métriques performance
    newRelicWrapper.recordMetric('Custom/Catalog/Nieuwkoop/Searches', 1);
    newRelicWrapper.recordMetric('Custom/Catalog/Nieuwkoop/ResponseTime', searchData.duration || 0);
    newRelicWrapper.recordMetric('Custom/Catalog/Nieuwkoop/ResultsCount', searchData.results?.length || 0);

    // Cache hit rate
    if (searchData.fromCache) {
      newRelicWrapper.recordMetric('Custom/Catalog/Nieuwkoop/CacheHits', 1);
    } else {
      newRelicWrapper.recordMetric('Custom/Catalog/Nieuwkoop/CacheMisses', 1);
    }

    // Alertes performance
    if (searchData.duration > 3000) { // > 3 secondes
      this.recordAlert('slow_catalog_search', {
        module: 'nieuwkoop',
        duration: searchData.duration,
        query: searchData.query
      });
    }
  }

  /**
   * Enregistrer opération utilisateur
   */
  static recordUserOperation(operation, data) {
    const metrics = {
      operation: operation, // 'login', 'register', 'profile_update', 'password_change'
      userId: data.userId,
      userRole: data.userRole || 'user',
      success: data.success !== false,
      duration: data.duration || 0,
      ip: data.ip || 'unknown',
      userAgent: data.userAgent || 'unknown',
      timestamp: new Date().toISOString(),
      source: data.source || 'web' // web, mobile, api
    };

    newRelicWrapper.recordCustomEvent('UserOperation', metrics);

    // Métriques utilisateurs
    newRelicWrapper.recordMetric(`Custom/Users/Operations/${operation}`, 1);
    
    if (operation === 'login') {
      newRelicWrapper.recordMetric('Custom/Users/Logins', 1);
      if (data.success) {
        newRelicWrapper.recordMetric('Custom/Users/LoginSuccesses', 1);
      } else {
        newRelicWrapper.recordMetric('Custom/Users/LoginFailures', 1);
      }
    }
  }

  /**
   * Enregistrer performance API
   */
  static recordAPIPerformance(endpoint, data) {
    const metrics = {
      endpoint: endpoint,
      method: data.method || 'GET',
      statusCode: data.statusCode || 200,
      responseTime: data.duration || 0,
      userId: data.userId,
      userRole: data.userRole,
      success: data.statusCode < 400,
      errorType: data.statusCode >= 400 ? data.errorType : null,
      timestamp: new Date().toISOString(),
      payloadSize: data.payloadSize || 0,
      queryCount: data.queryCount || 0
    };

    newRelicWrapper.recordCustomEvent('APIPerformance', metrics);

    // Métriques par endpoint
    const cleanEndpoint = endpoint.replace(/\/\d+/g, '/:id'); // Normaliser les IDs
    newRelicWrapper.recordMetric(`Custom/API/Requests/${cleanEndpoint}`, 1);
    newRelicWrapper.recordMetric(`Custom/API/ResponseTime/${cleanEndpoint}`, data.duration || 0);
    
    if (data.statusCode >= 400) {
      newRelicWrapper.recordMetric(`Custom/API/Errors/${cleanEndpoint}`, 1);
    }

    // Alertes performance API
    if (data.duration > 2000) { // > 2 secondes
      this.recordAlert('slow_api_response', {
        endpoint,
        duration: data.duration,
        method: data.method
      });
    }
  }

  /**
   * Enregistrer utilisation des fonctionnalités
   */
  static recordFeatureUsage(feature, data) {
    const metrics = {
      feature: feature, // 'export_stock', 'nieuwkoop_import', 'invoice_generation'
      userId: data.userId,
      userRole: data.userRole,
      success: data.success !== false,
      duration: data.duration || 0,
      dataSize: data.dataSize || 0,
      timestamp: new Date().toISOString(),
      metadata: JSON.stringify(data.metadata || {})
    };

    newRelicWrapper.recordCustomEvent('FeatureUsage', metrics);

    // Métriques par fonctionnalité
    newRelicWrapper.recordMetric(`Custom/Features/${feature}/Usage`, 1);
    newRelicWrapper.recordMetric(`Custom/Features/${feature}/Duration`, data.duration || 0);
    
    if (data.success === false) {
      newRelicWrapper.recordMetric(`Custom/Features/${feature}/Failures`, 1);
    }
  }

  /**
   * Enregistrer métriques business KPI
   */
  static recordBusinessKPI(kpi, value, metadata = {}) {
    const metrics = {
      kpi: kpi,
      value: value,
      timestamp: new Date().toISOString(),
      ...metadata
    };

    newRelicWrapper.recordCustomEvent('BusinessKPI', metrics);
    newRelicWrapper.recordMetric(`Custom/Business/KPI/${kpi}`, value);

    // Log KPI important
    logger.info(`📊 KPI [${kpi}]: ${value}`, metadata);
  }

  /**
   * Enregistrer erreurs business
   */
  static recordBusinessError(errorType, data) {
    const metrics = {
      errorType: errorType,
      message: data.message || 'Unknown error',
      userId: data.userId,
      endpoint: data.endpoint,
      severity: data.severity || 'medium', // low, medium, high, critical
      timestamp: new Date().toISOString(),
      context: JSON.stringify(data.context || {}),
      stack: data.stack ? data.stack.substring(0, 1000) : null // Limiter la taille
    };

    newRelicWrapper.recordCustomEvent('BusinessError', metrics);
    newRelicWrapper.recordMetric(`Custom/Errors/${errorType}`, 1);

    // Log erreur
    logger.error(`🚨 BUSINESS_ERROR [${errorType}]`, {
      message: data.message,
      severity: data.severity,
      userId: data.userId,
      context: data.context
    });
  }

  /**
   * Enregistrer alerte business
   */
  static recordAlert(alertType, data) {
    const alert = {
      alertType: alertType,
      severity: data.severity || 'medium',
      message: data.message || `Alert: ${alertType}`,
      timestamp: new Date().toISOString(),
      ...data
    };

    newRelicWrapper.recordCustomEvent('BusinessAlert', alert);
    
    // Log alerte avec niveau approprié
    const logLevel = data.severity === 'critical' ? 'error' : 'warn';
    logger[logLevel](`🚨 ALERT [${alertType}]`, alert);
  }

  /**
   * Middleware Express pour tracking automatique
   */
  static trackingMiddleware() {
    return (req, res, next) => {
      const startTime = Date.now();

      // Ajouter info utilisateur si disponible
      if (req.user) {
        newRelicWrapper.addCustomAttribute('userId', req.user.id);
        newRelicWrapper.addCustomAttribute('userRole', req.user.role);
      }

      // Override de res.send pour capturer les métriques
      const originalSend = res.send;
      res.send = function(data) {
        const duration = Date.now() - startTime;
        
        // Enregistrer performance API
        BusinessMetrics.recordAPIPerformance(req.path, {
          method: req.method,
          statusCode: res.statusCode,
          duration,
          userId: req.user?.id,
          userRole: req.user?.role,
          payloadSize: data ? JSON.stringify(data).length : 0,
          errorType: res.statusCode >= 400 ? 'http_error' : null
        });

        return originalSend.call(this, data);
      };

      next();
    };
  }

  /**
   * Créer snapshot des métriques business actuelles
   */
  static async createBusinessSnapshot() {
    try {
      const snapshot = {
        timestamp: new Date().toISOString(),
        metrics: {
          activeUsers: await this.getActiveUsersCount(),
          totalStockValue: await this.getTotalStockValue(),
          dailyOperations: await this.getDailyOperationsCount(),
          systemHealth: await this.getSystemHealthScore()
        }
      };

      newRelicWrapper.recordCustomEvent('BusinessSnapshot', snapshot.metrics);
      
      return snapshot;
    } catch (error) {
      logger.error('Erreur création snapshot business:', error);
      return null;
    }
  }

  /**
   * Helpers pour récupérer les KPIs (à implémenter selon vos besoins)
   */
  static async getActiveUsersCount() {
    // TODO: Implémenter selon votre logique métier
    return Math.floor(Math.random() * 100); // Mock
  }

  static async getTotalStockValue() {
    // TODO: Calculer la valeur totale du stock
    return Math.floor(Math.random() * 100000); // Mock
  }

  static async getDailyOperationsCount() {
    // TODO: Compter les opérations du jour
    return Math.floor(Math.random() * 50); // Mock
  }

  static async getSystemHealthScore() {
    // TODO: Calculer score de santé système (0-100)
    return Math.floor(Math.random() * 100); // Mock
  }
}

/**
 * Métriques système et performance
 */
class SystemMetrics {
  
  /**
   * Enregistrer métriques de base de données
   */
  static recordDatabaseOperation(operation, data) {
    const metrics = {
      operation: operation, // 'find', 'insert', 'update', 'delete', 'aggregate'
      collection: data.collection || 'unknown',
      duration: data.duration || 0,
      documentsCount: data.documentsCount || 0,
      indexUsed: data.indexUsed || false,
      bytesRead: data.bytesRead || 0,
      timestamp: new Date().toISOString()
    };

    newRelicWrapper.recordCustomEvent('DatabaseOperation', metrics);
    newRelicWrapper.recordMetric(`Custom/Database/${operation}`, 1);
    newRelicWrapper.recordMetric(`Custom/Database/Duration/${operation}`, data.duration || 0);

    // Alerte pour requêtes lentes
    if (data.duration > 1000) { // > 1 seconde
      BusinessMetrics.recordAlert('slow_database_query', {
        operation,
        collection: data.collection,
        duration: data.duration
      });
    }
  }

  /**
   * Surveiller l'usage mémoire
   */
  static recordMemoryUsage() {
    const memUsage = process.memoryUsage();
    
    newRelicWrapper.recordMetric('Custom/Memory/RSS', memUsage.rss);
    newRelicWrapper.recordMetric('Custom/Memory/HeapUsed', memUsage.heapUsed);
    newRelicWrapper.recordMetric('Custom/Memory/HeapTotal', memUsage.heapTotal);
    newRelicWrapper.recordMetric('Custom/Memory/External', memUsage.external);

    // Alerte si mémoire élevée
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
    if (heapUsedMB > 500) { // > 500MB
      BusinessMetrics.recordAlert('high_memory_usage', {
        heapUsedMB: Math.round(heapUsedMB),
        severity: heapUsedMB > 1000 ? 'critical' : 'medium'
      });
    }
  }
}

// Démarrer monitoring mémoire périodique
setInterval(() => {
  SystemMetrics.recordMemoryUsage();
}, 60000); // Toutes les minutes

module.exports = {
  BusinessMetrics,
  SystemMetrics,
  newRelicWrapper
};