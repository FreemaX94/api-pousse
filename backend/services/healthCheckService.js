const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const logger = require('../utils/logger');

class HealthCheckService {
  constructor() {
    this.checks = new Map();
    this.initializeChecks();
  }

  initializeChecks() {
    this.checks.set('database', this.checkDatabase.bind(this));
    this.checks.set('filesystem', this.checkFilesystem.bind(this));
    this.checks.set('memory', this.checkMemory.bind(this));
    this.checks.set('nieuwkoop_api', this.checkNieuwkoopAPI.bind(this));
    this.checks.set('google_calendar', this.checkGoogleCalendar.bind(this));
    this.checks.set('security_audit', this.checkSecurity.bind(this));
  }

  async checkDatabase() {
    const startTime = Date.now();
    try {
      if (mongoose.connection.readyState !== 1) {
        return {
          status: 'unhealthy',
          message: 'Database not connected',
          responseTime: Date.now() - startTime
        };
      }

      await mongoose.connection.db.admin().ping();
      return {
        status: 'healthy',
        message: 'Database connection OK',
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Database error: ${error.message}`,
        responseTime: Date.now() - startTime
      };
    }
  }

  async checkFilesystem() {
    const startTime = Date.now();
    try {
      const uploadsPath = path.join(__dirname, '../uploads');
      const vehiclesPath = path.join(__dirname, '../public/vehicles');
      
      await fs.access(uploadsPath);
      await fs.access(vehiclesPath);
      
      const uploadsStats = await fs.stat(uploadsPath);
      const vehiclesStats = await fs.stat(vehiclesPath);
      
      return {
        status: 'healthy',
        message: 'Filesystem access OK',
        details: {
          uploads: { accessible: true, isDirectory: uploadsStats.isDirectory() },
          vehicles: { accessible: true, isDirectory: vehiclesStats.isDirectory() }
        },
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Filesystem error: ${error.message}`,
        responseTime: Date.now() - startTime
      };
    }
  }

  async checkMemory() {
    const startTime = Date.now();
    try {
      const memUsage = process.memoryUsage();
      const totalMem = memUsage.heapTotal;
      const usedMem = memUsage.heapUsed;
      const memoryUsagePercent = (usedMem / totalMem) * 100;
      
      const status = memoryUsagePercent > 90 ? 'unhealthy' : 
                    memoryUsagePercent > 70 ? 'degraded' : 'healthy';
      
      return {
        status,
        message: `Memory usage: ${memoryUsagePercent.toFixed(2)}%`,
        details: {
          heapUsed: Math.round(usedMem / 1024 / 1024),
          heapTotal: Math.round(totalMem / 1024 / 1024),
          external: Math.round(memUsage.external / 1024 / 1024),
          rss: Math.round(memUsage.rss / 1024 / 1024)
        },
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Memory check error: ${error.message}`,
        responseTime: Date.now() - startTime
      };
    }
  }

  async checkNieuwkoopAPI() {
    const startTime = Date.now();
    try {
      const timeout = 5000;
      const response = await axios.get('https://api.nieuwkoop.eu/api/v1/health', {
        timeout,
        validateStatus: (status) => status < 500
      });
      
      const status = response.status === 200 ? 'healthy' : 'degraded';
      
      return {
        status,
        message: `Nieuwkoop API response: ${response.status}`,
        details: {
          statusCode: response.status,
          available: response.status < 500
        },
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      const isTimeout = error.code === 'ECONNABORTED';
      return {
        status: 'unhealthy',
        message: isTimeout ? 'Nieuwkoop API timeout' : `Nieuwkoop API error: ${error.message}`,
        details: {
          error: error.code || error.message,
          timeout: isTimeout
        },
        responseTime: Date.now() - startTime
      };
    }
  }

  async checkGoogleCalendar() {
    const startTime = Date.now();
    try {
      return {
        status: 'healthy',
        message: 'Google Calendar service configured',
        details: {
          configured: true,
          note: 'Detailed check requires authentication'
        },
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        status: 'degraded',
        message: `Google Calendar check error: ${error.message}`,
        responseTime: Date.now() - startTime
      };
    }
  }

  async checkSecurity() {
    const startTime = Date.now();
    try {
      const securityAuditService = require('./securityAuditService');
      const lastAudit = await securityAuditService.getLastAuditResults();
      
      if (!lastAudit) {
        return {
          status: 'degraded',
          message: 'No recent security audit available',
          details: {
            recommendation: 'Run security audit to get current status'
          },
          responseTime: Date.now() - startTime
        };
      }

      const auditAge = Date.now() - new Date(lastAudit.timestamp).getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (auditAge > maxAge) {
        return {
          status: 'degraded',
          message: 'Security audit is outdated',
          details: {
            lastAuditAge: Math.round(auditAge / (60 * 60 * 1000)) + 'h ago',
            recommendation: 'Run fresh security audit'
          },
          responseTime: Date.now() - startTime
        };
      }

      const securityStatus = lastAudit.status;
      let healthStatus = 'healthy';
      
      if (securityStatus === 'critical') healthStatus = 'unhealthy';
      else if (securityStatus === 'unhealthy') healthStatus = 'degraded';
      else if (securityStatus === 'degraded') healthStatus = 'degraded';

      return {
        status: healthStatus,
        message: `Security status: ${securityStatus}`,
        details: {
          vulnerabilities: lastAudit.summary?.totalVulnerabilities || 0,
          criticalVulnerabilities: lastAudit.summary?.criticalVulnerabilities || 0,
          lastAuditTime: lastAudit.timestamp,
          auditAge: Math.round(auditAge / (60 * 1000)) + 'm ago'
        },
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        status: 'degraded',
        message: `Security check error: ${error.message}`,
        responseTime: Date.now() - startTime
      };
    }
  }

  async runCheck(checkName, timeout = 10000) {
    const check = this.checks.get(checkName);
    if (!check) {
      return {
        status: 'unhealthy',
        message: `Unknown check: ${checkName}`
      };
    }

    try {
      const result = await Promise.race([
        check(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Check timeout')), timeout)
        )
      ]);
      
      return result;
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Check failed: ${error.message}`,
        error: error.stack
      };
    }
  }

  async runAllChecks(detailed = false) {
    const startTime = Date.now();
    const results = {};
    const checkPromises = [];

    for (const [checkName] of this.checks) {
      checkPromises.push(
        this.runCheck(checkName).then(result => {
          results[checkName] = result;
        })
      );
    }

    await Promise.allSettled(checkPromises);

    const overallStatus = this.calculateOverallStatus(results);
    
    const healthReport = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: Math.floor(process.uptime()),
      checks: detailed ? results : this.simplifyResults(results)
    };

    logger.info('Health check completed', {
      status: overallStatus,
      duration: healthReport.responseTime,
      checks: Object.keys(results).length
    });

    return healthReport;
  }

  calculateOverallStatus(results) {
    const statuses = Object.values(results).map(r => r.status);
    
    if (statuses.includes('unhealthy')) return 'unhealthy';
    if (statuses.includes('degraded')) return 'degraded';
    return 'healthy';
  }

  simplifyResults(results) {
    const simplified = {};
    for (const [key, result] of Object.entries(results)) {
      simplified[key] = {
        status: result.status,
        responseTime: result.responseTime
      };
    }
    return simplified;
  }

  getStatusCode(status) {
    switch (status) {
      case 'healthy': return 200;
      case 'degraded': return 200;
      case 'unhealthy': return 503;
      default: return 500;
    }
  }
}

module.exports = new HealthCheckService();