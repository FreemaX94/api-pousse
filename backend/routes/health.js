const express = require('express');
const router = express.Router();
const healthCheckService = require('../services/healthCheckService');
const logger = require('../utils/logger');

/**
 * @swagger
 * components:
 *   schemas:
 *     HealthStatus:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [healthy, degraded, unhealthy]
 *         timestamp:
 *           type: string
 *           format: date-time
 *         responseTime:
 *           type: number
 *         version:
 *           type: string
 *         environment:
 *           type: string
 *         uptime:
 *           type: number
 *         checks:
 *           type: object
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Basic health check
 *     description: Returns basic health status of the application
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy or degraded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthStatus'
 *       503:
 *         description: Service is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthStatus'
 */
router.get('/', async (req, res) => {
  try {
    const healthReport = await healthCheckService.runAllChecks(false);
    const statusCode = healthCheckService.getStatusCode(healthReport.status);
    
    res.status(statusCode).json(healthReport);
  } catch (error) {
    logger.error('Health check endpoint error', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/health/detailed:
 *   get:
 *     summary: Detailed health check
 *     description: Returns detailed health status with full diagnostic information
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health information
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/HealthStatus'
 *                 - type: object
 *                   properties:
 *                     checks:
 *                       type: object
 *                       properties:
 *                         database:
 *                           type: object
 *                           properties:
 *                             status:
 *                               type: string
 *                             message:
 *                               type: string
 *                             responseTime:
 *                               type: number
 *                         filesystem:
 *                           type: object
 *                           properties:
 *                             status:
 *                               type: string
 *                             message:
 *                               type: string
 *                             details:
 *                               type: object
 *                             responseTime:
 *                               type: number
 *                         memory:
 *                           type: object
 *                           properties:
 *                             status:
 *                               type: string
 *                             message:
 *                               type: string
 *                             details:
 *                               type: object
 *                             responseTime:
 *                               type: number
 *                         nieuwkoop_api:
 *                           type: object
 *                           properties:
 *                             status:
 *                               type: string
 *                             message:
 *                               type: string
 *                             details:
 *                               type: object
 *                             responseTime:
 *                               type: number
 *                         google_calendar:
 *                           type: object
 *                           properties:
 *                             status:
 *                               type: string
 *                             message:
 *                               type: string
 *                             details:
 *                               type: object
 *                             responseTime:
 *                               type: number
 *       503:
 *         description: Service is unhealthy
 */
router.get('/detailed', async (req, res) => {
  try {
    const healthReport = await healthCheckService.runAllChecks(true);
    const statusCode = healthCheckService.getStatusCode(healthReport.status);
    
    res.status(statusCode).json(healthReport);
  } catch (error) {
    logger.error('Detailed health check endpoint error', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      message: 'Detailed health check failed',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/health/liveness:
 *   get:
 *     summary: Liveness probe
 *     description: Simple endpoint to check if the service is alive (for Kubernetes/Docker)
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is alive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: alive
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/liveness', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime())
  });
});

/**
 * @swagger
 * /api/health/readiness:
 *   get:
 *     summary: Readiness probe
 *     description: Check if the service is ready to accept traffic (for Kubernetes/Docker)
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 *       503:
 *         description: Service is not ready
 */
router.get('/readiness', async (req, res) => {
  try {
    const criticalChecks = ['database'];
    const results = {};
    
    for (const checkName of criticalChecks) {
      results[checkName] = await healthCheckService.runCheck(checkName, 5000);
    }
    
    const isReady = Object.values(results).every(r => r.status !== 'unhealthy');
    const status = isReady ? 'ready' : 'not_ready';
    const statusCode = isReady ? 200 : 503;
    
    res.status(statusCode).json({
      status,
      timestamp: new Date().toISOString(),
      criticalChecks: results
    });
  } catch (error) {
    logger.error('Readiness check error', error);
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router;