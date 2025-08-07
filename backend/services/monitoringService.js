// backend/services/monitoringService.js
// Service de monitoring et alertes pour erreurs critiques

const logger = require('../utils/logger');
const { redisManager } = require('../config/redis');

class MonitoringService {
  constructor() {
    this.metrics = {
      requests: new Map(),
      errors: new Map(),
      performance: new Map(),
      health: new Map()
    };

    this.alertThresholds = {
      errorRate: 0.05, // 5% d'erreurs
      responseTime: 5000, // 5 secondes
      errorCount: 10, // 10 erreurs par minute
      dbConnections: 0.9, // 90% des connexions utilisées
      memoryUsage: 0.85, // 85% de la mémoire utilisée
      cpuUsage: 0.8 // 80% CPU
    };

    this.startMonitoring();
  }

  /**
   * Démarrer le monitoring périodique
   */
  startMonitoring() {
    // Monitoring des métriques système toutes les 30 secondes
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);

    // Nettoyage des métriques anciennes toutes les 5 minutes
    setInterval(() => {
      this.cleanupOldMetrics();
    }, 300000);

    // Vérification des alertes toutes les minutes
    setInterval(() => {
      this.checkAlerts();
    }, 60000);
  }

  /**
   * Enregistrer une requête
   */
  recordRequest(req, res, responseTime) {
    const minute = Math.floor(Date.now() / 60000);
    const key = `requests:${minute}`;

    const existing = this.metrics.requests.get(key) || {
      total: 0,
      errors: 0,
      responseTime: [],
      timestamp: minute * 60000
    };

    existing.total++;
    existing.responseTime.push(responseTime);

    if (res.statusCode >= 400) {
      existing.errors++;
    }

    this.metrics.requests.set(key, existing);

    // Persister dans Redis pour la durabilité
    this.persistMetrics('requests', key, existing);
  }

  /**
   * Enregistrer une erreur
   */
  recordError(error, req, severity = 'medium') {
    const minute = Math.floor(Date.now() / 60000);
    const errorKey = `${error.name}:${this.hashMessage(error.message)}`;
    const key = `error:${errorKey}:${minute}`;

    const existing = this.metrics.errors.get(key) || {
      count: 0,
      errorName: error.name,
      message: error.message,
      severity,
      stack: error.stack,
      firstOccurred: Date.now(),
      lastOccurred: Date.now(),
      requests: []
    };

    existing.count++;
    existing.lastOccurred = Date.now();
    existing.requests.push({
      method: req?.method,
      url: req?.originalUrl,
      userAgent: req?.get('User-Agent'),
      ip: req?.ip,
      userId: req?.user?.id,
      timestamp: Date.now()
    });

    this.metrics.errors.set(key, existing);

    // Persister dans Redis
    this.persistMetrics('errors', key, existing);

    // Vérifier si alerte immédiate nécessaire
    this.checkImmediateAlert(existing);
  }

  /**
   * Collecter les métriques système
   */
  collectSystemMetrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    const metrics = {
      timestamp: Date.now(),
      memory: {
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external,
        usage: memUsage.heapUsed / memUsage.heapTotal
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      uptime: process.uptime(),
      pid: process.pid
    };

    const minute = Math.floor(Date.now() / 60000);
    this.metrics.performance.set(`system:${minute}`, metrics);

    // Persister dans Redis
    this.persistMetrics('performance', `system:${minute}`, metrics);
  }

  /**
   * Vérifier les seuils d'alerte
   */
  async checkAlerts() {
    try {
      const currentMinute = Math.floor(Date.now() / 60000);
      
      // Vérifier le taux d'erreur
      await this.checkErrorRate(currentMinute);
      
      // Vérifier les temps de réponse
      await this.checkResponseTime(currentMinute);
      
      // Vérifier l'utilisation mémoire
      await this.checkMemoryUsage(currentMinute);
      
      // Vérifier les erreurs répétées
      await this.checkRepeatedErrors();
      
    } catch (error) {
      logger.error('❌ Erreur lors de la vérification des alertes:', error.message);
    }
  }

  /**
   * Vérifier le taux d'erreur
   */
  async checkErrorRate(currentMinute) {
    for (let i = 0; i < 5; i++) { // 5 dernières minutes
      const minute = currentMinute - i;
      const key = `requests:${minute}`;
      const metrics = this.metrics.requests.get(key);
      
      if (metrics && metrics.total > 0) {
        const errorRate = metrics.errors / metrics.total;
        
        if (errorRate > this.alertThresholds.errorRate) {
          await this.sendAlert('HIGH_ERROR_RATE', {
            errorRate: (errorRate * 100).toFixed(2),
            threshold: (this.alertThresholds.errorRate * 100).toFixed(2),
            period: `minute ${minute}`,
            total: metrics.total,
            errors: metrics.errors
          });
        }
      }
    }
  }

  /**
   * Vérifier les temps de réponse
   */
  async checkResponseTime(currentMinute) {
    const key = `requests:${currentMinute}`;
    const metrics = this.metrics.requests.get(key);
    
    if (metrics && metrics.responseTime.length > 0) {
      const avgResponseTime = metrics.responseTime.reduce((a, b) => a + b, 0) / metrics.responseTime.length;
      const maxResponseTime = Math.max(...metrics.responseTime);
      
      if (avgResponseTime > this.alertThresholds.responseTime) {
        await this.sendAlert('HIGH_RESPONSE_TIME', {
          average: avgResponseTime.toFixed(2),
          maximum: maxResponseTime.toFixed(2),
          threshold: this.alertThresholds.responseTime,
          requests: metrics.responseTime.length
        });
      }
    }
  }

  /**
   * Vérifier l'utilisation mémoire
   */
  async checkMemoryUsage(currentMinute) {
    const key = `system:${currentMinute}`;
    const metrics = this.metrics.performance.get(key);
    
    if (metrics && metrics.memory.usage > this.alertThresholds.memoryUsage) {
      await this.sendAlert('HIGH_MEMORY_USAGE', {
        usage: (metrics.memory.usage * 100).toFixed(2),
        threshold: (this.alertThresholds.memoryUsage * 100).toFixed(2),
        heapUsed: this.formatBytes(metrics.memory.heapUsed),
        heapTotal: this.formatBytes(metrics.memory.heapTotal),
        rss: this.formatBytes(metrics.memory.rss)
      });
    }
  }

  /**
   * Vérifier les erreurs répétées
   */
  async checkRepeatedErrors() {
    const currentMinute = Math.floor(Date.now() / 60000);
    
    for (const [key, errorData] of this.metrics.errors.entries()) {
      if (errorData.count >= this.alertThresholds.errorCount) {
        const minutesSinceFirst = (Date.now() - errorData.firstOccurred) / 60000;
        
        if (minutesSinceFirst <= 5) { // Dans les 5 dernières minutes
          await this.sendAlert('REPEATED_ERROR', {
            errorName: errorData.errorName,
            message: errorData.message,
            count: errorData.count,
            severity: errorData.severity,
            period: `${minutesSinceFirst.toFixed(1)} minutes`,
            affectedRequests: errorData.requests.length
          });
        }
      }
    }
  }

  /**
   * Vérifier si une alerte immédiate est nécessaire
   */
  async checkImmediateAlert(errorData) {
    // Alertes immédiates pour erreurs critiques
    if (errorData.severity === 'critical' || 
        errorData.errorName.includes('Database') ||
        errorData.errorName.includes('Connection') ||
        errorData.message.includes('ENOTFOUND') ||
        errorData.message.includes('ECONNREFUSED')) {
      
      await this.sendAlert('CRITICAL_ERROR', {
        errorName: errorData.errorName,
        message: errorData.message,
        count: errorData.count,
        severity: errorData.severity
      });
    }
  }

  /**
   * Envoyer une alerte
   */
  async sendAlert(type, data) {
    const alert = {
      type,
      severity: this.getAlertSeverity(type),
      timestamp: new Date().toISOString(),
      data,
      environment: process.env.NODE_ENV || 'development',
      service: 'api-pousse-backend'
    };

    // Logger l'alerte
    logger.error(`🚨 ALERTE ${type}:`, alert);

    // Persister l'alerte dans Redis
    await this.persistAlert(alert);

    // Ici on pourrait intégrer avec des services externes:
    // - Slack/Discord webhook
    // - Email notifications
    // - PagerDuty
    // - Sentry
    // - etc.

    return alert;
  }

  /**
   * Déterminer la sévérité d'une alerte
   */
  getAlertSeverity(type) {
    const severityMap = {
      'CRITICAL_ERROR': 'critical',
      'HIGH_ERROR_RATE': 'high',
      'HIGH_RESPONSE_TIME': 'medium',
      'HIGH_MEMORY_USAGE': 'medium',
      'REPEATED_ERROR': 'high',
      'SERVICE_DOWN': 'critical',
      'DATABASE_ERROR': 'high'
    };

    return severityMap[type] || 'low';
  }

  /**
   * Persister les métriques dans Redis
   */
  async persistMetrics(category, key, data) {
    try {
      const redisKey = `metrics:${category}:${key}`;
      await redisManager.set(redisKey, data, 3600); // 1 heure
    } catch (error) {
      logger.warn('⚠️ Impossible de persister les métriques:', error.message);
    }
  }

  /**
   * Persister une alerte dans Redis
   */
  async persistAlert(alert) {
    try {
      const alertKey = `alert:${alert.type}:${Date.now()}`;
      await redisManager.set(alertKey, alert, 86400); // 24 heures
    } catch (error) {
      logger.warn('⚠️ Impossible de persister l\'alerte:', error.message);
    }
  }

  /**
   * Nettoyer les anciennes métriques
   */
  cleanupOldMetrics() {
    const now = Date.now();
    const maxAge = 3600000; // 1 heure

    for (const [category, metrics] of Object.entries(this.metrics)) {
      for (const [key, data] of metrics.entries()) {
        if (data.timestamp && (now - data.timestamp) > maxAge) {
          metrics.delete(key);
        }
      }
    }
  }

  /**
   * Obtenir les statistiques de monitoring
   */
  getStats() {
    const stats = {
      requests: this.metrics.requests.size,
      errors: this.metrics.errors.size,
      performance: this.metrics.performance.size,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      pid: process.pid
    };

    return stats;
  }

  /**
   * Obtenir les métriques récentes
   */
  getRecentMetrics(category, minutes = 5) {
    const currentMinute = Math.floor(Date.now() / 60000);
    const metrics = [];

    for (let i = 0; i < minutes; i++) {
      const minute = currentMinute - i;
      const key = category === 'system' ? `system:${minute}` : `${category}:${minute}`;
      const data = this.metrics[category]?.get(key);
      
      if (data) {
        metrics.push(data);
      }
    }

    return metrics.reverse(); // Plus ancien en premier
  }

  /**
   * Utilitaires
   */
  hashMessage(message) {
    return message.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Instance singleton
const monitoringService = new MonitoringService();

/**
 * Middleware de monitoring des requêtes
 */
const monitoringMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Intercepter la fin de la réponse
  const originalEnd = res.end;
  res.end = function(...args) {
    const responseTime = Date.now() - startTime;
    
    // Enregistrer la requête
    monitoringService.recordRequest(req, res, responseTime);
    
    originalEnd.apply(this, args);
  };

  next();
};

module.exports = {
  monitoringService,
  monitoringMiddleware,
  MonitoringService
};