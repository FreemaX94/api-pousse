/**
 * Routes de Monitoring et Dashboard
 * Endpoints pour exposer les métriques et dashboard admin
 */

const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { BusinessMetrics, SystemMetrics } = require('../utils/metrics');
const dashboardService = require('../services/dashboardService');
const { Joi, celebrate, Segments } = require('../middlewares/validation');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * GET /api/monitoring/dashboard
 * Dashboard principal avec toutes les métriques (Admin uniquement)
 */
router.get('/dashboard',
  authMiddleware('admin'),
  celebrate({
    [Segments.QUERY]: Joi.object({
      timeRange: Joi.string().valid('1h', '24h', '7d', '30d').default('1h'),
      refresh: Joi.boolean().default(false)
    })
  }),
  async (req, res, next) => {
    try {
      const { timeRange, refresh } = req.query;
      
      // Si refresh forcé, invalider le cache
      if (refresh) {
        dashboardService.metricsCache.clear();
      }

      const dashboardData = await dashboardService.getDashboardData(timeRange);
      
      logger.info('Dashboard accessed', {
        adminId: req.user.id,
        timeRange,
        refresh
      });

      res.json(dashboardData);
    } catch (error) {
      logger.error('Erreur génération dashboard:', error);
      next(error);
    }
  }
);

/**
 * GET /api/monitoring/realtime
 * Métriques temps réel pour WebSocket/SSE (Admin uniquement)
 */
router.get('/realtime',
  authMiddleware('admin'),
  async (req, res, next) => {
    try {
      const realtimeData = await dashboardService.getRealtimeMetrics();
      
      res.json(realtimeData);
    } catch (error) {
      logger.error('Erreur métriques temps réel:', error);
      next(error);
    }
  }
);

/**
 * GET /api/monitoring/performance
 * Métriques de performance détaillées (Admin uniquement)
 */
router.get('/performance',
  authMiddleware('admin'),
  celebrate({
    [Segments.QUERY]: Joi.object({
      timeRange: Joi.string().valid('1h', '24h', '7d').default('1h'),
      endpoint: Joi.string().max(100).optional(),
      minDuration: Joi.number().integer().min(0).optional()
    })
  }),
  async (req, res, next) => {
    try {
      const { timeRange, endpoint, minDuration } = req.query;
      
      const performanceData = await dashboardService.getPerformanceMetrics(timeRange);
      
      // Filtrer par endpoint si spécifié
      if (endpoint) {
        performanceData.filtered = {
          endpoint,
          metrics: await dashboardService.getEndpointMetrics(endpoint, timeRange)
        };
      }

      res.json(performanceData);
    } catch (error) {
      logger.error('Erreur métriques performance:', error);
      next(error);
    }
  }
);

/**
 * GET /api/monitoring/business
 * Métriques business et KPI (Admin/Manager)
 */
router.get('/business',
  authMiddleware(['admin', 'manager']),
  celebrate({
    [Segments.QUERY]: Joi.object({
      timeRange: Joi.string().valid('1h', '24h', '7d', '30d').default('24h'),
      category: Joi.string().valid('stock', 'catalog', 'users', 'all').default('all')
    })
  }),
  async (req, res, next) => {
    try {
      const { timeRange, category } = req.query;
      
      const businessData = await dashboardService.getBusinessMetrics(timeRange);
      
      // Filtrer par catégorie si spécifiée
      const filteredData = category === 'all' ? businessData : {
        [category]: businessData[category]
      };

      // Enregistrer accès aux métriques business
      BusinessMetrics.recordFeatureUsage('business_metrics_access', {
        userId: req.user.id,
        userRole: req.user.role,
        category,
        timeRange,
        success: true
      });

      res.json(filteredData);
    } catch (error) {
      logger.error('Erreur métriques business:', error);
      next(error);
    }
  }
);

/**
 * GET /api/monitoring/alerts
 * Alertes et notifications système (Admin uniquement)
 */
router.get('/alerts',
  authMiddleware('admin'),
  celebrate({
    [Segments.QUERY]: Joi.object({
      severity: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
      acknowledged: Joi.boolean().optional(),
      limit: Joi.number().integer().min(1).max(100).default(50),
      type: Joi.string().valid('performance', 'business', 'system', 'security').optional()
    })
  }),
  async (req, res, next) => {
    try {
      const { severity, acknowledged, limit, type } = req.query;
      
      const alertsData = await dashboardService.getActiveAlerts();
      
      // Filtrer les alertes selon les critères
      let filteredAlerts = alertsData.recent;
      
      if (severity) {
        filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity);
      }
      
      if (acknowledged !== undefined) {
        filteredAlerts = filteredAlerts.filter(alert => alert.acknowledged === acknowledged);
      }
      
      if (type) {
        filteredAlerts = filteredAlerts.filter(alert => alert.type === type);
      }

      res.json({
        ...alertsData,
        filtered: filteredAlerts.slice(0, limit),
        filters: { severity, acknowledged, limit, type }
      });
    } catch (error) {
      logger.error('Erreur récupération alertes:', error);
      next(error);
    }
  }
);

/**
 * POST /api/monitoring/alerts/:id/acknowledge
 * Marquer une alerte comme acquittée (Admin uniquement)
 */
router.post('/alerts/:id/acknowledge',
  authMiddleware('admin'),
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().required()
    }),
    [Segments.BODY]: Joi.object({
      comment: Joi.string().max(500).optional()
    })
  }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { comment } = req.body;

      // En production, mettre à jour la base de données
      logger.info('Alert acknowledged', {
        alertId: id,
        adminId: req.user.id,
        comment,
        timestamp: new Date().toISOString()
      });

      BusinessMetrics.recordFeatureUsage('alert_acknowledge', {
        userId: req.user.id,
        userRole: req.user.role,
        success: true,
        metadata: { alertId: id, comment }
      });

      res.json({
        success: true,
        message: 'Alerte acquittée avec succès',
        alertId: id,
        acknowledgedBy: req.user.email,
        timestamp: new Date().toISOString(),
        comment
      });
    } catch (error) {
      logger.error('Erreur acquittement alerte:', error);
      next(error);
    }
  }
);

/**
 * GET /api/monitoring/export
 * Exporter les métriques (Admin uniquement)
 */
router.get('/export',
  authMiddleware('admin'),
  celebrate({
    [Segments.QUERY]: Joi.object({
      format: Joi.string().valid('json', 'csv', 'prometheus').default('json'),
      timeRange: Joi.string().valid('1h', '24h', '7d', '30d').default('24h'),
      metrics: Joi.string().valid('all', 'performance', 'business', 'system').default('all')
    })
  }),
  async (req, res, next) => {
    try {
      const { format, timeRange, metrics } = req.query;
      
      const exportData = await dashboardService.exportMetrics(format, timeRange);

      // Enregistrer l'export
      BusinessMetrics.recordFeatureUsage('metrics_export', {
        userId: req.user.id,
        userRole: req.user.role,
        success: true,
        dataSize: JSON.stringify(exportData).length,
        metadata: { format, timeRange, metrics }
      });

      // Définir le Content-Type selon le format
      switch (format) {
        case 'csv':
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', `attachment; filename="metrics-${timeRange}.csv"`);
          break;
        case 'prometheus':
          res.setHeader('Content-Type', 'text/plain');
          break;
        default:
          res.setHeader('Content-Type', 'application/json');
      }

      if (format === 'csv' || format === 'prometheus') {
        res.send(exportData);
      } else {
        res.json(exportData);
      }
    } catch (error) {
      logger.error('Erreur export métriques:', error);
      next(error);
    }
  }
);

/**
 * POST /api/monitoring/metrics/custom
 * Enregistrer une métrique custom (Admin/Manager)
 */
router.post('/metrics/custom',
  authMiddleware(['admin', 'manager']),
  celebrate({
    [Segments.BODY]: Joi.object({
      type: Joi.string().valid('business', 'performance', 'user_action').required(),
      name: Joi.string().max(100).required(),
      value: Joi.number().required(),
      metadata: Joi.object().optional(),
      tags: Joi.array().items(Joi.string().max(50)).max(10).optional()
    })
  }),
  async (req, res, next) => {
    try {
      const { type, name, value, metadata, tags } = req.body;

      // Enregistrer la métrique custom
      switch (type) {
        case 'business':
          BusinessMetrics.recordBusinessKPI(name, value, {
            userId: req.user.id,
            metadata,
            tags
          });
          break;
        case 'performance':
          SystemMetrics.recordDatabaseOperation(name, {
            duration: value,
            ...metadata
          });
          break;
        case 'user_action':
          BusinessMetrics.recordFeatureUsage(name, {
            userId: req.user.id,
            userRole: req.user.role,
            success: true,
            metadata
          });
          break;
      }

      logger.info('Custom metric recorded', {
        type,
        name,
        value,
        userId: req.user.id,
        metadata
      });

      res.json({
        success: true,
        message: 'Métrique enregistrée avec succès',
        metric: { type, name, value },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erreur enregistrement métrique custom:', error);
      next(error);
    }
  }
);

/**
 * GET /api/monitoring/health
 * Health check détaillé du système (Public avec limite)
 */
router.get('/health',
  async (req, res, next) => {
    try {
      const healthData = await dashboardService.getSystemMetrics();
      
      // Version publique simplifiée
      const publicHealth = {
        status: healthData.memory.usage < 90 && healthData.connections.redis.status === 'connected' ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime: healthData.process.uptime,
        version: healthData.process.nodeVersion,
        environment: process.env.NODE_ENV || 'development',
        services: {
          api: 'operational',
          database: healthData.connections.database.status,
          cache: healthData.connections.redis.status
        }
      };

      res.json(publicHealth);
    } catch (error) {
      logger.error('Erreur health check:', error);
      res.status(503).json({
        status: 'error',
        message: 'Service unavailable',
        timestamp: new Date().toISOString()
      });
    }
  }
);

module.exports = router;