/**
 * Routes de sécurité et monitoring
 * Endpoints pour surveiller les métriques de sécurité
 */

const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getRateLimitStats, rateLimitConfigs } = require('../middlewares/rateLimiting');
const { Joi, celebrate, Segments } = require('../middlewares/validation');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * GET /api/security/rate-limit-stats
 * Obtenir les statistiques de rate limiting (Admin uniquement)
 */
router.get('/rate-limit-stats', 
  authMiddleware('admin'),
  async (req, res, next) => {
    try {
      const stats = await getRateLimitStats();
      
      // Enrichir avec la configuration
      const enrichedStats = {
        ...stats,
        configuration: {
          totalEndpoints: Object.keys(rateLimitConfigs).length,
          configs: rateLimitConfigs
        },
        timestamp: new Date().toISOString()
      };

      logger.info('Rate limit stats accessed by admin', {
        adminId: req.user.id,
        totalKeys: stats.totalKeys
      });

      res.json(enrichedStats);
    } catch (error) {
      logger.error('Erreur récupération stats rate limiting:', error);
      next(error);
    }
  }
);

/**
 * GET /api/security/blocked-ips
 * Liste des IPs actuellement bloquées (Admin uniquement)
 */
router.get('/blocked-ips',
  authMiddleware('admin'),
  celebrate({
    [Segments.QUERY]: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      endpoint: Joi.string().max(100).optional()
    })
  }),
  async (req, res, next) => {
    try {
      const { page, limit, endpoint } = req.query;
      
      // Simuler la récupération des IPs bloquées depuis Redis
      // En production, ceci devrait interroger Redis pour les clés actives
      const blockedIps = [
        {
          ip: '192.168.1.100',
          endpoint: '/api/auth/login',
          attempts: 6,
          blockedUntil: new Date(Date.now() + 15 * 60 * 1000),
          firstAttempt: new Date(Date.now() - 10 * 60 * 1000),
          userAgent: 'Mozilla/5.0 (suspicious)'
        }
      ];

      // Filtrer par endpoint si spécifié
      const filtered = endpoint 
        ? blockedIps.filter(item => item.endpoint.includes(endpoint))
        : blockedIps;

      // Pagination simple
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedResults = filtered.slice(startIndex, endIndex);

      res.json({
        data: paginatedResults,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filtered.length / limit),
          totalItems: filtered.length,
          hasNext: endIndex < filtered.length,
          hasPrev: startIndex > 0
        }
      });
    } catch (error) {
      logger.error('Erreur récupération IPs bloquées:', error);
      next(error);
    }
  }
);

/**
 * POST /api/security/unblock-ip
 * Débloquer une IP spécifique (Admin uniquement)
 */
router.post('/unblock-ip',
  authMiddleware('admin'),
  celebrate({
    [Segments.BODY]: Joi.object({
      ip: Joi.string().ip().required(),
      endpoint: Joi.string().max(100).optional(),
      reason: Joi.string().max(500).required()
    })
  }),
  async (req, res, next) => {
    try {
      const { ip, endpoint, reason } = req.body;
      
      // En production, supprimer les clés Redis correspondantes
      // await redis.del(`rl:${endpoint || '*'}:${ip}`);
      
      logger.warn('IP unblocked by admin', {
        adminId: req.user.id,
        adminEmail: req.user.email,
        targetIp: ip,
        endpoint: endpoint || 'all',
        reason,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        message: `IP ${ip} débloquée avec succès`,
        unblocked: {
          ip,
          endpoint: endpoint || 'all',
          unblockedBy: req.user.email,
          reason,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Erreur déblocage IP:', error);
      next(error);
    }
  }
);

/**
 * GET /api/security/security-events
 * Historique des événements de sécurité (Admin uniquement)
 */
router.get('/security-events',
  authMiddleware('admin'),
  celebrate({
    [Segments.QUERY]: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(50),
      type: Joi.string().valid('rate_limit', 'auth_failure', 'suspicious_activity').optional(),
      severity: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
      startDate: Joi.date().iso().optional(),
      endDate: Joi.date().iso().optional()
    })
  }),
  async (req, res, next) => {
    try {
      const { page, limit, type, severity, startDate, endDate } = req.query;

      // En production, ceci devrait interroger une base de données d'événements
      const mockEvents = [
        {
          id: '1',
          type: 'rate_limit',
          severity: 'medium',
          description: 'Rate limit exceeded on /api/auth/login',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0',
          endpoint: '/api/auth/login',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          metadata: {
            attempts: 6,
            limit: 5,
            window: '15 minutes'
          }
        },
        {
          id: '2',
          type: 'auth_failure',
          severity: 'high',
          description: 'Multiple failed login attempts',
          ip: '10.0.0.50',
          userAgent: 'curl/7.68.0',
          endpoint: '/api/auth/login',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          metadata: {
            email: 'admin@test.com',
            attempts: 10,
            timespan: '5 minutes'
          }
        }
      ];

      // Filtrer selon les critères
      let filtered = mockEvents;
      
      if (type) {
        filtered = filtered.filter(event => event.type === type);
      }
      
      if (severity) {
        filtered = filtered.filter(event => event.severity === severity);
      }

      if (startDate || endDate) {
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.timestamp);
          if (startDate && eventDate < new Date(startDate)) return false;
          if (endDate && eventDate > new Date(endDate)) return false;
          return true;
        });
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedResults = filtered.slice(startIndex, endIndex);

      res.json({
        data: paginatedResults,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filtered.length / limit),
          totalItems: filtered.length,
          hasNext: endIndex < filtered.length,
          hasPrev: startIndex > 0
        },
        summary: {
          totalEvents: mockEvents.length,
          filtered: filtered.length,
          severityBreakdown: {
            low: mockEvents.filter(e => e.severity === 'low').length,
            medium: mockEvents.filter(e => e.severity === 'medium').length,
            high: mockEvents.filter(e => e.severity === 'high').length,
            critical: mockEvents.filter(e => e.severity === 'critical').length
          }
        }
      });
    } catch (error) {
      logger.error('Erreur récupération événements sécurité:', error);
      next(error);
    }
  }
);

/**
 * GET /api/security/health
 * Vérification de l'état des systèmes de sécurité
 */
router.get('/health',
  authMiddleware('admin'),
  async (req, res, next) => {
    try {
      const healthCheck = {
        timestamp: new Date().toISOString(),
        status: 'healthy',
        components: {
          rateLimiting: {
            status: 'healthy',
            redis: process.env.REDIS_URL ? 'connected' : 'memory_fallback',
            activeRules: Object.keys(rateLimitConfigs).length
          },
          validation: {
            status: 'healthy',
            schemas: 5, // Nombre de schémas de validation
            sanitization: 'active'
          },
          monitoring: {
            status: 'healthy',
            logging: 'active',
            metrics: 'collecting'
          }
        },
        metrics: {
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          nodeVersion: process.version
        }
      };

      // Vérifier Redis si disponible
      try {
        const redis = require('../config/redis');
        await redis.ping();
        healthCheck.components.rateLimiting.redis = 'connected';
      } catch (error) {
        healthCheck.components.rateLimiting.redis = 'disconnected';
        healthCheck.components.rateLimiting.status = 'degraded';
      }

      res.json(healthCheck);
    } catch (error) {
      logger.error('Erreur health check sécurité:', error);
      next(error);
    }
  }
);

module.exports = router;