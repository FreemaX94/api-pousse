/**
 * Service de Dashboard de Monitoring Temps Réel
 * Agrégation et exposition des métriques pour l'interface admin
 */

const { BusinessMetrics, SystemMetrics } = require('../utils/metrics');
const logger = require('../utils/logger');
const redis = require('../config/redis');

class DashboardService {
  constructor() {
    this.metricsCache = new Map();
    this.lastUpdate = null;
    this.updateInterval = 30000; // 30 secondes
    this.startPeriodicUpdate();
  }

  /**
   * Obtenir le dashboard complet
   */
  async getDashboardData(timeRange = '1h') {
    try {
      const dashboardData = {
        timestamp: new Date().toISOString(),
        timeRange,
        overview: await this.getOverviewMetrics(),
        performance: await this.getPerformanceMetrics(timeRange),
        business: await this.getBusinessMetrics(timeRange),
        system: await this.getSystemMetrics(),
        alerts: await this.getActiveAlerts(),
        trends: await this.getTrendData(timeRange)
      };

      // Cache le résultat
      this.metricsCache.set(`dashboard_${timeRange}`, dashboardData);
      this.lastUpdate = new Date();

      return dashboardData;
    } catch (error) {
      logger.error('Erreur génération dashboard:', error);
      throw error;
    }
  }

  /**
   * Métriques d'aperçu global
   */
  async getOverviewMetrics() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return {
      activeUsers: await this.getActiveUsersCount(),
      dailyOperations: await this.getDailyOperationsCount(),
      totalStockValue: await this.getTotalStockValue(),
      systemHealth: await this.getSystemHealthScore(),
      uptime: process.uptime(),
      version: process.version,
      environment: process.env.NODE_ENV || 'development'
    };
  }

  /**
   * Métriques de performance
   */
  async getPerformanceMetrics(timeRange) {
    const metrics = {
      api: {
        totalRequests: await this.getMetricSum('api_requests', timeRange),
        avgResponseTime: await this.getMetricAvg('api_response_time', timeRange),
        errorRate: await this.getErrorRate(timeRange),
        slowestEndpoints: await this.getSlowestEndpoints(timeRange)
      },
      database: {
        totalQueries: await this.getMetricSum('db_queries', timeRange),
        avgQueryTime: await this.getMetricAvg('db_query_time', timeRange),
        slowQueries: await this.getSlowQueries(timeRange),
        indexUsage: await this.getIndexUsageRate(timeRange)
      },
      cache: {
        hitRate: await this.getCacheHitRate(timeRange),
        operations: await this.getMetricSum('cache_operations', timeRange),
        memoryUsage: await this.getCacheMemoryUsage()
      }
    };

    return metrics;
  }

  /**
   * Métriques business
   */
  async getBusinessMetrics(timeRange) {
    return {
      stock: {
        totalOperations: await this.getStockOperationsCount(timeRange),
        valueTransferred: await this.getStockValueTransferred(timeRange),
        topCategories: await this.getTopStockCategories(timeRange),
        lowStockAlerts: await this.getLowStockAlerts()
      },
      catalog: {
        searches: await this.getCatalogSearchesCount(timeRange),
        avgSearchTime: await this.getAvgSearchTime(timeRange),
        popularSearches: await this.getPopularSearchTerms(timeRange),
        nieuwkoopUsage: await this.getNieuwkoopUsageStats(timeRange)
      },
      users: {
        newRegistrations: await this.getNewRegistrationsCount(timeRange),
        activeUsers: await this.getActiveUsersInPeriod(timeRange),
        topUsers: await this.getTopUsersByActivity(timeRange),
        loginSuccessRate: await this.getLoginSuccessRate(timeRange)
      }
    };
  }

  /**
   * Métriques système
   */
  async getSystemMetrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024), // MB
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
        usage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      process: {
        uptime: Math.round(process.uptime()),
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform
      },
      connections: {
        redis: await this.checkRedisConnection(),
        database: await this.checkDatabaseConnection()
      }
    };
  }

  /**
   * Alertes actives
   */
  async getActiveAlerts() {
    // En production, ceci devrait interroger une base de données d'alertes
    const mockAlerts = [
      {
        id: '1',
        type: 'performance',
        severity: 'medium',
        message: 'Temps de réponse API élevé',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        acknowledged: false,
        metric: 'api_response_time',
        value: 2500,
        threshold: 2000
      },
      {
        id: '2',
        type: 'business',
        severity: 'low',
        message: 'Stock faible détecté',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        acknowledged: true,
        metric: 'stock_quantity',
        value: 5,
        threshold: 10
      }
    ];

    return {
      total: mockAlerts.length,
      unacknowledged: mockAlerts.filter(a => !a.acknowledged).length,
      bySeverity: {
        critical: mockAlerts.filter(a => a.severity === 'critical').length,
        high: mockAlerts.filter(a => a.severity === 'high').length,
        medium: mockAlerts.filter(a => a.severity === 'medium').length,
        low: mockAlerts.filter(a => a.severity === 'low').length
      },
      recent: mockAlerts.slice(0, 10)
    };
  }

  /**
   * Données de tendance
   */
  async getTrendData(timeRange) {
    const intervals = this.getTimeIntervals(timeRange);
    
    return {
      apiRequests: await this.getMetricTrend('api_requests', intervals),
      responseTime: await this.getMetricTrend('api_response_time', intervals),
      stockOperations: await this.getMetricTrend('stock_operations', intervals),
      userActivity: await this.getMetricTrend('user_activity', intervals),
      errors: await this.getMetricTrend('errors', intervals)
    };
  }

  /**
   * Helpers pour calculer les métriques
   */
  async getActiveUsersCount() {
    // Mock - en production, interroger la base de données
    return Math.floor(Math.random() * 50) + 10;
  }

  async getDailyOperationsCount() {
    // Mock - compter les opérations du jour
    return Math.floor(Math.random() * 200) + 50;
  }

  async getTotalStockValue() {
    // Mock - calculer valeur totale du stock
    return Math.floor(Math.random() * 500000) + 100000;
  }

  async getSystemHealthScore() {
    // Calculer score de santé basé sur plusieurs métriques
    const memUsage = process.memoryUsage();
    const memScore = Math.max(0, 100 - (memUsage.heapUsed / memUsage.heapTotal * 100));
    const uptimeScore = Math.min(100, process.uptime() / 3600 * 10); // 10 points par heure, max 100
    
    return Math.round((memScore + uptimeScore) / 2);
  }

  async getMetricSum(metric, timeRange) {
    // Mock - en production, interroger Redis/base de données
    return Math.floor(Math.random() * 1000);
  }

  async getMetricAvg(metric, timeRange) {
    // Mock - calculer moyenne
    return Math.floor(Math.random() * 500) + 100;
  }

  async getErrorRate(timeRange) {
    // Mock - calculer taux d'erreur
    return Math.random() * 5; // 0-5%
  }

  async getSlowestEndpoints(timeRange) {
    return [
      { endpoint: '/api/nieuwkoop/search', avgTime: 2500, count: 45 },
      { endpoint: '/api/stocks/export', avgTime: 1800, count: 12 },
      { endpoint: '/api/invoices/generate', avgTime: 1500, count: 23 }
    ];
  }

  async getSlowQueries(timeRange) {
    return [
      { query: 'Stock.aggregate([...])', avgTime: 1200, count: 15 },
      { query: 'User.find({...})', avgTime: 800, count: 34 }
    ];
  }

  async getCacheHitRate(timeRange) {
    return Math.random() * 30 + 70; // 70-100%
  }

  async getStockOperationsCount(timeRange) {
    return Math.floor(Math.random() * 100) + 20;
  }

  async getCatalogSearchesCount(timeRange) {
    return Math.floor(Math.random() * 200) + 50;
  }

  async getNewRegistrationsCount(timeRange) {
    return Math.floor(Math.random() * 10) + 1;
  }

  async checkRedisConnection() {
    try {
      await redis.ping();
      return { status: 'connected', latency: Math.floor(Math.random() * 10) + 1 };
    } catch (error) {
      return { status: 'disconnected', error: error.message };
    }
  }

  async checkDatabaseConnection() {
    try {
      // Mock - en production, tester la connexion MongoDB
      return { status: 'connected', latency: Math.floor(Math.random() * 20) + 5 };
    } catch (error) {
      return { status: 'disconnected', error: error.message };
    }
  }

  /**
   * Helpers pour les tendances
   */
  getTimeIntervals(timeRange) {
    const now = new Date();
    const intervals = [];
    
    let intervalMs, count;
    
    switch (timeRange) {
      case '1h':
        intervalMs = 5 * 60 * 1000; // 5 minutes
        count = 12;
        break;
      case '24h':
        intervalMs = 60 * 60 * 1000; // 1 heure
        count = 24;
        break;
      case '7d':
        intervalMs = 24 * 60 * 60 * 1000; // 1 jour
        count = 7;
        break;
      default:
        intervalMs = 5 * 60 * 1000;
        count = 12;
    }

    for (let i = count - 1; i >= 0; i--) {
      intervals.push(new Date(now.getTime() - i * intervalMs));
    }

    return intervals;
  }

  async getMetricTrend(metric, intervals) {
    // Mock - en production, interroger les données historiques
    return intervals.map(time => ({
      timestamp: time.toISOString(),
      value: Math.floor(Math.random() * 100) + 10
    }));
  }

  /**
   * Mise à jour périodique du cache
   */
  startPeriodicUpdate() {
    setInterval(async () => {
      try {
        await this.getDashboardData('1h');
        logger.debug('Dashboard cache updated');
      } catch (error) {
        logger.error('Erreur mise à jour cache dashboard:', error);
      }
    }, this.updateInterval);
  }

  /**
   * Obtenir des métriques en temps réel via WebSocket
   */
  async getRealtimeMetrics() {
    return {
      timestamp: new Date().toISOString(),
      activeConnections: Math.floor(Math.random() * 20) + 5,
      currentRPS: Math.floor(Math.random() * 50) + 10,
      memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      responseTime: Math.floor(Math.random() * 200) + 50,
      errorCount: Math.floor(Math.random() * 3)
    };
  }

  /**
   * Exporter métriques pour analyse externe
   */
  async exportMetrics(format = 'json', timeRange = '24h') {
    const data = await this.getDashboardData(timeRange);
    
    switch (format) {
      case 'csv':
        return this.formatAsCSV(data);
      case 'prometheus':
        return this.formatAsPrometheus(data);
      default:
        return data;
    }
  }

  formatAsCSV(data) {
    // Simplification - en production, utiliser une lib CSV
    const lines = ['timestamp,metric,value'];
    
    // Ajouter quelques métriques clés
    const timestamp = data.timestamp;
    lines.push(`${timestamp},active_users,${data.overview.activeUsers}`);
    lines.push(`${timestamp},daily_operations,${data.overview.dailyOperations}`);
    lines.push(`${timestamp},system_health,${data.overview.systemHealth}`);
    
    return lines.join('\n');
  }

  formatAsPrometheus(data) {
    // Format Prometheus simple
    const metrics = [];
    
    metrics.push(`# HELP api_pousse_active_users Number of active users`);
    metrics.push(`# TYPE api_pousse_active_users gauge`);
    metrics.push(`api_pousse_active_users ${data.overview.activeUsers}`);
    
    metrics.push(`# HELP api_pousse_system_health System health score`);
    metrics.push(`# TYPE api_pousse_system_health gauge`);
    metrics.push(`api_pousse_system_health ${data.overview.systemHealth}`);
    
    return metrics.join('\n');
  }
}

// Singleton instance
const dashboardService = new DashboardService();

module.exports = dashboardService;