const express = require('express');
const router = express.Router();
const securityAuditService = require('../services/securityAuditService');
const { authenticateToken } = require('../middlewares/authMiddleware');
const logger = require('../utils/logger');

/**
 * @swagger
 * components:
 *   schemas:
 *     SecurityAuditReport:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [healthy, degraded, unhealthy, critical, error]
 *         summary:
 *           type: object
 *           properties:
 *             totalVulnerabilities:
 *               type: number
 *             criticalVulnerabilities:
 *               type: number
 *             highVulnerabilities:
 *               type: number
 *             topRecommendations:
 *               type: array
 *               items:
 *                 type: string
 *             projectsScanned:
 *               type: number
 *         timestamp:
 *           type: string
 *           format: date-time
 *         responseTime:
 *           type: number
 *         results:
 *           type: object
 */

/**
 * @swagger
 * /api/security/audit:
 *   get:
 *     summary: Run security audit
 *     description: Performs comprehensive security audit of dependencies and configurations
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Security audit completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SecurityAuditReport'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Audit failed
 */
router.get('/audit', authenticateToken, async (req, res) => {
  try {
    logger.info('Security audit requested', { 
      userId: req.user?.id, 
      ip: req.ip 
    });

    const auditReport = await securityAuditService.runFullSecurityAudit();
    
    const statusCode = auditReport.status === 'critical' ? 500 :
                      auditReport.status === 'unhealthy' ? 503 :
                      auditReport.status === 'error' ? 500 : 200;

    res.status(statusCode).json(auditReport);
  } catch (error) {
    logger.error('Security audit endpoint error', error);
    res.status(500).json({
      status: 'error',
      message: 'Security audit failed',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/security/status:
 *   get:
 *     summary: Get security status
 *     description: Returns cached security status or runs new audit if needed
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Security status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SecurityAuditReport'
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const securityStatus = await securityAuditService.getSecurityStatus();
    
    const statusCode = securityStatus.status === 'critical' ? 500 :
                      securityStatus.status === 'unhealthy' ? 503 :
                      securityStatus.status === 'error' ? 500 : 200;

    res.status(statusCode).json(securityStatus);
  } catch (error) {
    logger.error('Security status endpoint error', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get security status',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/security/npm-audit:
 *   post:
 *     summary: Run npm audit on specific project
 *     description: Runs npm audit on backend or frontend project
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               project:
 *                 type: string
 *                 enum: [backend, frontend]
 *                 example: backend
 *             required:
 *               - project
 *     responses:
 *       200:
 *         description: npm audit completed
 *       400:
 *         description: Invalid project specified
 *       401:
 *         description: Unauthorized
 */
router.post('/npm-audit', authenticateToken, async (req, res) => {
  try {
    const { project } = req.body;
    
    if (!project || !['backend', 'frontend'].includes(project)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid project. Must be "backend" or "frontend"'
      });
    }

    logger.info('npm audit requested', { 
      project, 
      userId: req.user?.id, 
      ip: req.ip 
    });

    const projectPath = project === 'backend' ? 
      require('path').join(__dirname, '..') :
      require('path').join(__dirname, '../../frontend');

    const auditResult = await securityAuditService.runNpmAudit(projectPath, project);
    
    const statusCode = auditResult.status === 'critical' ? 500 :
                      auditResult.status === 'unhealthy' ? 503 : 200;

    res.status(statusCode).json(auditResult);
  } catch (error) {
    logger.error('npm audit endpoint error', error);
    res.status(500).json({
      status: 'error',
      message: 'npm audit failed',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/security/dependencies:
 *   get:
 *     summary: Check dependency security
 *     description: Analyzes dependencies for security issues and outdated packages
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: project
 *         schema:
 *           type: string
 *           enum: [backend, frontend]
 *         description: Project to analyze (defaults to backend)
 *     responses:
 *       200:
 *         description: Dependency analysis completed
 *       401:
 *         description: Unauthorized
 */
router.get('/dependencies', authenticateToken, async (req, res) => {
  try {
    const project = req.query.project || 'backend';
    
    if (!['backend', 'frontend'].includes(project)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid project. Must be "backend" or "frontend"'
      });
    }

    const projectPath = project === 'backend' ? 
      require('path').join(__dirname, '..') :
      require('path').join(__dirname, '../../frontend');

    const dependencyCheck = await securityAuditService.runDependencyCheck(projectPath, project);
    
    const statusCode = dependencyCheck.status === 'unhealthy' ? 503 : 200;

    res.status(statusCode).json(dependencyCheck);
  } catch (error) {
    logger.error('Dependency check endpoint error', error);
    res.status(500).json({
      status: 'error',
      message: 'Dependency check failed',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/security/docker:
 *   get:
 *     summary: Docker security scan
 *     description: Analyzes Dockerfile for security best practices
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Docker security scan completed
 *       401:
 *         description: Unauthorized
 */
router.get('/docker', authenticateToken, async (req, res) => {
  try {
    const dockerScan = await securityAuditService.runDockerSecurityScan();
    
    const statusCode = dockerScan.status === 'unhealthy' ? 503 : 200;

    res.status(statusCode).json(dockerScan);
  } catch (error) {
    logger.error('Docker security scan endpoint error', error);
    res.status(500).json({
      status: 'error',
      message: 'Docker security scan failed',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/security/report:
 *   get:
 *     summary: Generate security report
 *     description: Generates comprehensive security report in PDF format
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Security report generated
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 */
router.get('/report', authenticateToken, async (req, res) => {
  try {
    const auditResults = await securityAuditService.getSecurityStatus();
    
    const report = {
      title: 'API Pousse - Security Audit Report',
      generatedAt: new Date().toISOString(),
      generatedBy: req.user?.email || 'System',
      status: auditResults.status,
      summary: auditResults.summary,
      executiveSummary: generateExecutiveSummary(auditResults),
      recommendations: generateRecommendations(auditResults),
      detailedFindings: auditResults.results
    };

    res.json(report);
  } catch (error) {
    logger.error('Security report generation error', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate security report',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

function generateExecutiveSummary(auditResults) {
  const { summary, status } = auditResults;
  
  let riskLevel = 'Low';
  if (status === 'critical') riskLevel = 'Critical';
  else if (status === 'unhealthy') riskLevel = 'High';
  else if (status === 'degraded') riskLevel = 'Medium';

  return {
    riskLevel,
    totalVulnerabilities: summary.totalVulnerabilities || 0,
    criticalFindings: summary.criticalVulnerabilities || 0,
    projectsAnalyzed: summary.projectsScanned || 0,
    overallRecommendation: riskLevel === 'Critical' ? 
      'Immediate action required to address critical vulnerabilities' :
      riskLevel === 'High' ?
      'Prioritize fixing high-risk vulnerabilities within 48 hours' :
      riskLevel === 'Medium' ?
      'Schedule vulnerability fixes in next development cycle' :
      'Continue regular security monitoring'
  };
}

function generateRecommendations(auditResults) {
  const recommendations = [];
  
  if (auditResults.summary.criticalVulnerabilities > 0) {
    recommendations.push({
      priority: 'Critical',
      action: 'Update packages with critical vulnerabilities immediately',
      impact: 'High',
      effort: 'Low'
    });
  }

  if (auditResults.summary.totalVulnerabilities > 10) {
    recommendations.push({
      priority: 'High',
      action: 'Implement automated dependency updates',
      impact: 'Medium',
      effort: 'Medium'
    });
  }

  recommendations.push({
    priority: 'Medium',
    action: 'Set up automated security scanning in CI/CD pipeline',
    impact: 'High',
    effort: 'Medium'
  });

  return recommendations;
}

module.exports = router;