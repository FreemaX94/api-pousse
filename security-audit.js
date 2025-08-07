#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const SECURITY_CONFIG = {
  auditLevel: 'moderate',
  maxVulnerabilities: {
    critical: 0,
    high: 5,
    moderate: 10
  },
  excludeDevDependencies: false,
  outputDir: './security-reports'
};

class SecurityAuditor {
  constructor() {
    this.results = {
      backend: null,
      frontend: null,
      summary: {
        totalVulnerabilities: 0,
        criticalCount: 0,
        highCount: 0,
        status: 'unknown'
      }
    };
  }

  async init() {
    console.log('🔍 API Pousse Security Auditor');
    console.log('==============================\n');
    
    // Ensure output directory exists
    if (!fs.existsSync(SECURITY_CONFIG.outputDir)) {
      fs.mkdirSync(SECURITY_CONFIG.outputDir, { recursive: true });
    }
  }

  async auditProject(projectPath, projectName) {
    return new Promise((resolve) => {
      const auditCmd = `npm audit --audit-level=${SECURITY_CONFIG.auditLevel} --json`;
      
      console.log(`📊 Auditing ${projectName}...`);
      
      exec(auditCmd, { 
        cwd: projectPath,
        maxBuffer: 1024 * 1024 * 5 // 5MB buffer
      }, (error, stdout, stderr) => {
        try {
          if (stdout) {
            const auditData = JSON.parse(stdout);
            const result = this.parseAuditResults(auditData, projectName);
            resolve(result);
          } else {
            resolve({
              project: projectName,
              status: 'clean',
              vulnerabilities: { critical: 0, high: 0, moderate: 0, low: 0, info: 0 },
              message: 'No vulnerabilities found'
            });
          }
        } catch (parseError) {
          resolve({
            project: projectName,
            status: 'error',
            error: parseError.message,
            message: 'Failed to parse audit results'
          });
        }
      });
    });
  }

  parseAuditResults(auditData, projectName) {
    const metadata = auditData.metadata || {};
    const vulnerabilities = metadata.vulnerabilities || {};
    
    const result = {
      project: projectName,
      vulnerabilities,
      totalPackages: metadata.totalDependencies || 0,
      advisories: []
    };

    // Extract top vulnerabilities
    if (auditData.advisories) {
      result.advisories = Object.values(auditData.advisories)
        .filter(advisory => advisory.severity === 'critical' || advisory.severity === 'high')
        .slice(0, 10)
        .map(advisory => ({
          title: advisory.title,
          severity: advisory.severity,
          module: advisory.module_name,
          recommendation: advisory.recommendation,
          url: advisory.url
        }));
    }

    // Determine status
    if (vulnerabilities.critical > SECURITY_CONFIG.maxVulnerabilities.critical) {
      result.status = 'critical';
    } else if (vulnerabilities.high > SECURITY_CONFIG.maxVulnerabilities.high) {
      result.status = 'high';
    } else if (vulnerabilities.moderate > SECURITY_CONFIG.maxVulnerabilities.moderate) {
      result.status = 'moderate';
    } else {
      result.status = 'clean';
    }

    result.message = this.generateStatusMessage(result);
    
    return result;
  }

  generateStatusMessage(result) {
    const { vulnerabilities, status } = result;
    const total = Object.values(vulnerabilities).reduce((sum, count) => sum + count, 0);
    
    if (status === 'clean') {
      return 'No significant vulnerabilities found';
    }
    
    return `Found ${total} vulnerabilities (${vulnerabilities.critical || 0} critical, ${vulnerabilities.high || 0} high)`;
  }

  async generateReport() {
    const timestamp = new Date().toISOString();
    const report = {
      generatedAt: timestamp,
      config: SECURITY_CONFIG,
      results: this.results,
      recommendations: this.generateRecommendations()
    };

    const reportPath = path.join(SECURITY_CONFIG.outputDir, `security-audit-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📋 Report saved: ${reportPath}`);
    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    const { backend, frontend, summary } = this.results;

    if (summary.criticalCount > 0) {
      recommendations.push({
        priority: 'CRITICAL',
        action: 'Fix critical vulnerabilities immediately',
        description: 'Critical vulnerabilities pose immediate security risks'
      });
    }

    if (summary.highCount > 5) {
      recommendations.push({
        priority: 'HIGH',
        action: 'Schedule high-priority vulnerability fixes',
        description: 'High vulnerabilities should be addressed within 48 hours'
      });
    }

    if (backend?.status === 'critical' || frontend?.status === 'critical') {
      recommendations.push({
        priority: 'HIGH',
        action: 'Consider dependency update strategy',
        description: 'Implement automated dependency updates and monitoring'
      });
    }

    recommendations.push({
      priority: 'MEDIUM',
      action: 'Set up continuous security monitoring',
      description: 'Integrate security scanning into CI/CD pipeline'
    });

    return recommendations;
  }

  printSummary() {
    console.log('\n🔐 Security Audit Summary');
    console.log('========================');
    
    if (this.results.backend) {
      console.log(`Backend: ${this.results.backend.status.toUpperCase()}`);
      console.log(`  - ${this.results.backend.message}`);
      if (this.results.backend.advisories?.length > 0) {
        console.log(`  - Top issues: ${this.results.backend.advisories.length} critical/high findings`);
      }
    }

    if (this.results.frontend) {
      console.log(`Frontend: ${this.results.frontend.status.toUpperCase()}`);
      console.log(`  - ${this.results.frontend.message}`);
      if (this.results.frontend.advisories?.length > 0) {
        console.log(`  - Top issues: ${this.results.frontend.advisories.length} critical/high findings`);
      }
    }

    console.log(`\nOverall Status: ${this.results.summary.status.toUpperCase()}`);
    
    if (this.results.summary.totalVulnerabilities > 0) {
      console.log(`Total Vulnerabilities: ${this.results.summary.totalVulnerabilities}`);
      console.log(`Critical: ${this.results.summary.criticalCount} | High: ${this.results.summary.highCount}`);
    }
  }

  async run() {
    await this.init();

    // Audit backend
    const backendPath = path.join(__dirname, 'backend');
    if (fs.existsSync(path.join(backendPath, 'package.json'))) {
      this.results.backend = await this.auditProject(backendPath, 'backend');
    }

    // Audit frontend
    const frontendPath = path.join(__dirname, 'frontend');
    if (fs.existsSync(path.join(frontendPath, 'package.json'))) {
      this.results.frontend = await this.auditProject(frontendPath, 'frontend');
    }

    // Calculate summary
    this.calculateSummary();
    
    // Generate report
    await this.generateReport();
    
    // Print summary
    this.printSummary();

    // Exit with appropriate code
    const exitCode = this.getExitCode();
    if (exitCode > 0) {
      console.log('\n❌ Security issues found. Review and fix before deployment.');
    } else {
      console.log('\n✅ Security audit passed!');
    }
    
    process.exit(exitCode);
  }

  calculateSummary() {
    let totalVulns = 0;
    let criticalCount = 0;
    let highCount = 0;
    let overallStatus = 'clean';

    [this.results.backend, this.results.frontend].forEach(result => {
      if (result && result.vulnerabilities) {
        const vulns = result.vulnerabilities;
        totalVulns += Object.values(vulns).reduce((sum, count) => sum + count, 0);
        criticalCount += vulns.critical || 0;
        highCount += vulns.high || 0;
        
        if (result.status === 'critical' && overallStatus !== 'critical') {
          overallStatus = 'critical';
        } else if (result.status === 'high' && !['critical'].includes(overallStatus)) {
          overallStatus = 'high';
        } else if (result.status === 'moderate' && !['critical', 'high'].includes(overallStatus)) {
          overallStatus = 'moderate';
        }
      }
    });

    this.results.summary = {
      totalVulnerabilities: totalVulns,
      criticalCount,
      highCount,
      status: overallStatus
    };
  }

  getExitCode() {
    const { status } = this.results.summary;
    
    switch (status) {
      case 'critical': return 2;
      case 'high': return 1;
      case 'moderate': return 0; // Allow moderate vulnerabilities
      case 'clean': return 0;
      default: return 1;
    }
  }
}

// Run if called directly
if (require.main === module) {
  const auditor = new SecurityAuditor();
  auditor.run().catch(error => {
    console.error('❌ Security audit failed:', error.message);
    process.exit(1);
  });
}

module.exports = SecurityAuditor;