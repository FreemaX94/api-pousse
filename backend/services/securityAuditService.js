const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../utils/logger');

class SecurityAuditService {
  constructor() {
    this.auditResults = new Map();
    this.lastAuditTime = null;
    this.auditInterval = 30 * 60 * 1000; // 30 minutes
    this.cachePath = path.join(__dirname, '../security-cache.json');
  }

  async runNpmAudit(projectPath, projectType = 'backend') {
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      const auditCommand = 'npm audit --audit-level=moderate --json';
      
      exec(auditCommand, { 
        cwd: projectPath,
        timeout: 30000,
        maxBuffer: 1024 * 1024 * 2 // 2MB buffer
      }, (error, stdout, stderr) => {
        const responseTime = Date.now() - startTime;
        
        try {
          if (stdout) {
            const auditData = JSON.parse(stdout);
            const result = this.parseNpmAuditResults(auditData, projectType, responseTime);
            resolve(result);
          } else if (error) {
            resolve({
              status: 'error',
              projectType,
              message: `npm audit failed: ${error.message}`,
              vulnerabilities: {},
              totalVulnerabilities: 0,
              responseTime,
              error: error.code || 'AUDIT_FAILED'
            });
          } else {
            resolve({
              status: 'healthy',
              projectType,
              message: 'No vulnerabilities found',
              vulnerabilities: {},
              totalVulnerabilities: 0,
              responseTime
            });
          }
        } catch (parseError) {
          resolve({
            status: 'error',
            projectType,
            message: `Failed to parse audit results: ${parseError.message}`,
            vulnerabilities: {},
            totalVulnerabilities: 0,
            responseTime,
            error: 'PARSE_ERROR'
          });
        }
      });
    });
  }

  parseNpmAuditResults(auditData, projectType, responseTime) {
    const metadata = auditData.metadata || {};
    const vulnerabilities = metadata.vulnerabilities || {};
    
    const totalVulns = vulnerabilities.info || 0 + 
                      vulnerabilities.low || 0 + 
                      vulnerabilities.moderate || 0 + 
                      vulnerabilities.high || 0 + 
                      vulnerabilities.critical || 0;

    let status = 'healthy';
    if (vulnerabilities.critical > 0) {
      status = 'critical';
    } else if (vulnerabilities.high > 0) {
      status = 'unhealthy';
    } else if (vulnerabilities.moderate > 0) {
      status = 'degraded';
    }

    const advisories = auditData.advisories || {};
    const topVulnerabilities = Object.values(advisories)
      .filter(advisory => advisory.severity === 'critical' || advisory.severity === 'high')
      .slice(0, 5)
      .map(advisory => ({
        title: advisory.title,
        severity: advisory.severity,
        module: advisory.module_name,
        cves: advisory.cves,
        recommendation: advisory.recommendation
      }));

    return {
      status,
      projectType,
      message: totalVulns > 0 ? 
        `Found ${totalVulns} vulnerabilities (${vulnerabilities.critical || 0} critical, ${vulnerabilities.high || 0} high)` :
        'No vulnerabilities found',
      vulnerabilities,
      totalVulnerabilities: totalVulns,
      topVulnerabilities,
      packagesAudited: metadata.totalDependencies || 0,
      responseTime,
      timestamp: new Date().toISOString()
    };
  }

  async runDependencyCheck(projectPath, projectType = 'backend') {
    const startTime = Date.now();
    
    try {
      const packageJsonPath = path.join(projectPath, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
      
      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };

      const outdatedPackages = await this.checkOutdatedPackages(projectPath);
      const securityInfo = await this.analyzePackageSecurity(dependencies);

      return {
        status: securityInfo.riskLevel,
        projectType,
        message: `Analyzed ${Object.keys(dependencies).length} packages`,
        packages: {
          total: Object.keys(dependencies).length,
          outdated: outdatedPackages.length,
          highRisk: securityInfo.highRiskPackages.length
        },
        outdatedPackages: outdatedPackages.slice(0, 10),
        highRiskPackages: securityInfo.highRiskPackages.slice(0, 5),
        recommendations: securityInfo.recommendations,
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        projectType,
        message: `Dependency check failed: ${error.message}`,
        responseTime: Date.now() - startTime,
        error: error.code || 'DEPENDENCY_CHECK_FAILED'
      };
    }
  }

  async checkOutdatedPackages(projectPath) {
    return new Promise((resolve) => {
      exec('npm outdated --json', { 
        cwd: projectPath,
        timeout: 20000 
      }, (error, stdout) => {
        try {
          if (stdout) {
            const outdated = JSON.parse(stdout);
            return resolve(Object.entries(outdated).map(([name, info]) => ({
              name,
              current: info.current,
              wanted: info.wanted,
              latest: info.latest,
              location: info.location
            })));
          }
          resolve([]);
        } catch {
          resolve([]);
        }
      });
    });
  }

  async analyzePackageSecurity(dependencies) {
    const highRiskPatterns = [
      'eval', 'exec', 'serialize', 'deserialize', 'unsafe',
      'prototype', 'lodash@4.17.15', 'moment@2.29.1'
    ];

    const highRiskPackages = [];
    const recommendations = [];

    for (const [packageName, version] of Object.entries(dependencies)) {
      if (highRiskPatterns.some(pattern => packageName.includes(pattern))) {
        highRiskPackages.push({
          name: packageName,
          version,
          risk: 'Potentially unsafe package name or known vulnerable version',
          recommendation: 'Review and update to latest secure version'
        });
      }

      if (version.includes('^') || version.includes('~')) {
        continue;
      }

      const versionParts = version.replace(/[^\d.]/g, '').split('.');
      if (versionParts[0] === '0') {
        recommendations.push(`${packageName}: Consider stable version (currently pre-1.0)`);
      }
    }

    let riskLevel = 'healthy';
    if (highRiskPackages.length > 5) {
      riskLevel = 'unhealthy';
    } else if (highRiskPackages.length > 2) {
      riskLevel = 'degraded';
    }

    return {
      riskLevel,
      highRiskPackages,
      recommendations: recommendations.slice(0, 5)
    };
  }

  async runDockerSecurityScan() {
    const startTime = Date.now();
    
    try {
      const dockerfilePath = path.join(__dirname, '../../Dockerfile');
      const dockerfileExists = await fs.access(dockerfilePath).then(() => true).catch(() => false);
      
      if (!dockerfileExists) {
        return {
          status: 'skipped',
          message: 'No Dockerfile found',
          responseTime: Date.now() - startTime
        };
      }

      const dockerfileContent = await fs.readFile(dockerfilePath, 'utf8');
      const securityIssues = this.analyzeDockerfile(dockerfileContent);

      return {
        status: securityIssues.length > 0 ? 'degraded' : 'healthy',
        message: `Docker analysis: ${securityIssues.length} security recommendations`,
        issues: securityIssues,
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Docker security scan failed: ${error.message}`,
        responseTime: Date.now() - startTime,
        error: error.code || 'DOCKER_SCAN_FAILED'
      };
    }
  }

  analyzeDockerfile(content) {
    const issues = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('FROM') && line.includes(':latest')) {
        issues.push({
          line: index + 1,
          type: 'version_pinning',
          message: 'Avoid using :latest tag, pin specific versions',
          severity: 'medium'
        });
      }

      if (line.includes('USER root') || (!content.includes('USER ') && line.includes('RUN'))) {
        issues.push({
          line: index + 1,
          type: 'privilege_escalation',
          message: 'Consider running container as non-root user',
          severity: 'high'
        });
      }

      if (line.includes('ADD ') && line.includes('http')) {
        issues.push({
          line: index + 1,
          type: 'insecure_download',
          message: 'Downloading files via ADD can be insecure, use COPY with verification',
          severity: 'medium'
        });
      }
    });

    return issues;
  }

  async runFullSecurityAudit() {
    const startTime = Date.now();
    const results = {};

    logger.info('Starting comprehensive security audit');

    try {
      const backendPath = path.join(__dirname, '..');
      const frontendPath = path.join(__dirname, '../../frontend');

      const auditPromises = [
        this.runNpmAudit(backendPath, 'backend').then(result => {
          results.backend_npm_audit = result;
        }),
        this.runDependencyCheck(backendPath, 'backend').then(result => {
          results.backend_dependencies = result;
        }),
        this.runDockerSecurityScan().then(result => {
          results.docker_security = result;
        })
      ];

      const frontendExists = await fs.access(frontendPath).then(() => true).catch(() => false);
      if (frontendExists) {
        auditPromises.push(
          this.runNpmAudit(frontendPath, 'frontend').then(result => {
            results.frontend_npm_audit = result;
          }),
          this.runDependencyCheck(frontendPath, 'frontend').then(result => {
            results.frontend_dependencies = result;
          })
        );
      }

      await Promise.allSettled(auditPromises);

      const overallStatus = this.calculateSecurityStatus(results);
      const summary = this.generateSecuritySummary(results);

      const auditReport = {
        status: overallStatus,
        summary,
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        results
      };

      this.auditResults.set('latest', auditReport);
      this.lastAuditTime = Date.now();

      await this.saveAuditCache(auditReport);

      logger.info('Security audit completed', {
        status: overallStatus,
        duration: auditReport.responseTime,
        vulnerabilities: summary.totalVulnerabilities
      });

      return auditReport;
    } catch (error) {
      logger.error('Security audit failed', error);
      return {
        status: 'error',
        message: `Security audit failed: ${error.message}`,
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        error: error.stack
      };
    }
  }

  calculateSecurityStatus(results) {
    const statuses = Object.values(results).map(r => r.status);
    
    if (statuses.includes('critical')) return 'critical';
    if (statuses.includes('unhealthy')) return 'unhealthy';
    if (statuses.includes('degraded')) return 'degraded';
    if (statuses.includes('error')) return 'degraded';
    return 'healthy';
  }

  generateSecuritySummary(results) {
    let totalVulnerabilities = 0;
    let criticalVulnerabilities = 0;
    let highVulnerabilities = 0;
    const recommendations = [];

    Object.values(results).forEach(result => {
      if (result.totalVulnerabilities) {
        totalVulnerabilities += result.totalVulnerabilities;
      }
      if (result.vulnerabilities) {
        criticalVulnerabilities += result.vulnerabilities.critical || 0;
        highVulnerabilities += result.vulnerabilities.high || 0;
      }
      if (result.recommendations) {
        recommendations.push(...result.recommendations);
      }
    });

    return {
      totalVulnerabilities,
      criticalVulnerabilities,
      highVulnerabilities,
      topRecommendations: recommendations.slice(0, 5),
      projectsScanned: Object.keys(results).length
    };
  }

  async saveAuditCache(auditReport) {
    try {
      await fs.writeFile(this.cachePath, JSON.stringify(auditReport, null, 2));
    } catch (error) {
      logger.warn('Failed to save audit cache', error);
    }
  }

  async getLastAuditResults() {
    if (this.auditResults.has('latest')) {
      return this.auditResults.get('latest');
    }

    try {
      const cached = await fs.readFile(this.cachePath, 'utf8');
      return JSON.parse(cached);
    } catch {
      return null;
    }
  }

  shouldRunAudit() {
    if (!this.lastAuditTime) return true;
    return (Date.now() - this.lastAuditTime) > this.auditInterval;
  }

  async getSecurityStatus() {
    const cached = await this.getLastAuditResults();
    
    if (!cached || this.shouldRunAudit()) {
      return await this.runFullSecurityAudit();
    }
    
    return cached;
  }
}

module.exports = new SecurityAuditService();