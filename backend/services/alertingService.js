/**
 * Service d'Alerting Intelligent
 * Système d'alertes automatiques basé sur les métriques business et système
 */

const { BusinessMetrics } = require('../utils/metrics');
const logger = require('../utils/logger');
const nodemailer = require('nodemailer');

class AlertingService {
  constructor() {
    this.alertRules = new Map();
    this.activeAlerts = new Map();
    this.alertHistory = [];
    this.emailTransporter = null;
    this.initEmailTransporter();
    this.setupDefaultRules();
    this.startMonitoring();
  }

  /**
   * Initialiser le transporteur email
   */
  initEmailTransporter() {
    try {
      if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        this.emailTransporter = nodemailer.createTransporter({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT || 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        logger.info('📧 Email transporter initialized for alerts');
      } else {
        logger.warn('⚠️ Email configuration missing, alerts will be logged only');
      }
    } catch (error) {
      logger.error('Erreur initialisation email transporter:', error);
    }
  }

  /**
   * Configurer les règles d'alerte par défaut
   */
  setupDefaultRules() {
    // Alertes de performance
    this.addAlertRule('slow_api_response', {
      condition: (data) => data.duration > 2000,
      severity: 'medium',
      message: (data) => `API response time too slow: ${data.duration}ms on ${data.endpoint}`,
      cooldown: 5 * 60 * 1000, // 5 minutes
      notification: ['email', 'log']
    });

    this.addAlertRule('high_error_rate', {
      condition: (data) => data.errorRate > 5, // Plus de 5% d'erreurs
      severity: 'high',
      message: (data) => `High error rate detected: ${data.errorRate}% on ${data.endpoint}`,
      cooldown: 10 * 60 * 1000,
      notification: ['email', 'log']
    });

    // Alertes business
    this.addAlertRule('low_stock_critical', {
      condition: (data) => data.quantity <= data.minThreshold && data.critical === true,
      severity: 'high',
      message: (data) => `CRITICAL: Stock très bas pour ${data.productName}: ${data.quantity} restant(s)`,
      cooldown: 60 * 60 * 1000, // 1 heure
      notification: ['email', 'log']
    });

    this.addAlertRule('large_stock_movement', {
      condition: (data) => data.quantity > 1000 || data.totalValue > 50000,
      severity: 'medium',
      message: (data) => `Large stock movement: ${data.quantity} items, value: ${data.totalValue}€`,
      cooldown: 30 * 60 * 1000,
      notification: ['log']
    });

    // Alertes système
    this.addAlertRule('high_memory_usage', {
      condition: (data) => data.memoryUsagePercent > 85,
      severity: 'high',
      message: (data) => `High memory usage: ${data.memoryUsagePercent}%`,
      cooldown: 15 * 60 * 1000,
      notification: ['email', 'log']
    });

    this.addAlertRule('database_slow_query', {
      condition: (data) => data.duration > 1000,
      severity: 'medium',
      message: (data) => `Slow database query: ${data.duration}ms on ${data.collection}`,
      cooldown: 5 * 60 * 1000,
      notification: ['log']
    });

    // Alertes sécurité
    this.addAlertRule('multiple_failed_logins', {
      condition: (data) => data.failedAttempts >= 5,
      severity: 'high',
      message: (data) => `Multiple failed login attempts: ${data.failedAttempts} from IP ${data.ip}`,
      cooldown: 30 * 60 * 1000,
      notification: ['email', 'log']
    });

    this.addAlertRule('suspicious_activity', {
      condition: (data) => data.suspiciousScore > 80,
      severity: 'critical',
      message: (data) => `Suspicious activity detected: score ${data.suspiciousScore}% from ${data.source}`,
      cooldown: 0, // Pas de cooldown pour activité suspecte
      notification: ['email', 'log']
    });

    logger.info(`📋 ${this.alertRules.size} alert rules configured`);
  }

  /**
   * Ajouter une règle d'alerte
   */
  addAlertRule(name, rule) {
    const alertRule = {
      name,
      condition: rule.condition,
      severity: rule.severity || 'medium',
      message: rule.message,
      cooldown: rule.cooldown || 5 * 60 * 1000, // 5 minutes par défaut
      notification: rule.notification || ['log'],
      enabled: rule.enabled !== false,
      createdAt: new Date()
    };

    this.alertRules.set(name, alertRule);
    logger.debug(`Alert rule added: ${name}`);
  }

  /**
   * Supprimer une règle d'alerte
   */
  removeAlertRule(name) {
    if (this.alertRules.delete(name)) {
      logger.info(`Alert rule removed: ${name}`);
      return true;
    }
    return false;
  }

  /**
   * Activer/désactiver une règle
   */
  toggleAlertRule(name, enabled) {
    const rule = this.alertRules.get(name);
    if (rule) {
      rule.enabled = enabled;
      logger.info(`Alert rule ${name} ${enabled ? 'enabled' : 'disabled'}`);
      return true;
    }
    return false;
  }

  /**
   * Évaluer une métrique contre toutes les règles
   */
  async evaluateMetric(metricType, data) {
    for (const [ruleName, rule] of this.alertRules) {
      if (!rule.enabled) continue;

      try {
        // Vérifier si la condition est remplie
        if (rule.condition(data)) {
          await this.triggerAlert(ruleName, rule, data);
        }
      } catch (error) {
        logger.error(`Error evaluating alert rule ${ruleName}:`, error);
      }
    }
  }

  /**
   * Déclencher une alerte
   */
  async triggerAlert(ruleName, rule, data) {
    const alertId = `${ruleName}_${Date.now()}`;
    const now = new Date();

    // Vérifier le cooldown
    const lastAlert = this.getLastAlert(ruleName);
    if (lastAlert && (now - lastAlert.timestamp) < rule.cooldown) {
      logger.debug(`Alert ${ruleName} in cooldown, skipping`);
      return;
    }

    // Créer l'alerte
    const alert = {
      id: alertId,
      ruleName,
      severity: rule.severity,
      message: typeof rule.message === 'function' ? rule.message(data) : rule.message,
      timestamp: now,
      data,
      acknowledged: false,
      resolvedAt: null
    };

    // Stocker l'alerte
    this.activeAlerts.set(alertId, alert);
    this.alertHistory.push(alert);

    // Envoyer les notifications
    await this.sendNotifications(alert, rule.notification);

    // Enregistrer la métrique d'alerte
    BusinessMetrics.recordAlert(ruleName, {
      severity: rule.severity,
      message: alert.message,
      data: JSON.stringify(data)
    });

    logger.warn(`🚨 ALERT TRIGGERED [${ruleName}]: ${alert.message}`, {
      alertId,
      severity: rule.severity,
      data
    });

    return alert;
  }

  /**
   * Envoyer les notifications
   */
  async sendNotifications(alert, notificationTypes) {
    const promises = notificationTypes.map(type => {
      switch (type) {
        case 'email':
          return this.sendEmailNotification(alert);
        case 'log':
          return this.logAlert(alert);
        case 'webhook':
          return this.sendWebhookNotification(alert);
        default:
          logger.warn(`Unknown notification type: ${type}`);
          return Promise.resolve();
      }
    });

    try {
      await Promise.allSettled(promises);
    } catch (error) {
      logger.error('Error sending notifications:', error);
    }
  }

  /**
   * Envoyer notification email
   */
  async sendEmailNotification(alert) {
    if (!this.emailTransporter) {
      logger.debug('Email transporter not available, skipping email notification');
      return;
    }

    try {
      const subject = `[API-POUSSE] Alert ${alert.severity.toUpperCase()}: ${alert.ruleName}`;
      const html = this.generateEmailTemplate(alert);

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: process.env.ALERT_EMAIL_TO || process.env.EMAIL_USER,
        subject,
        html
      };

      await this.emailTransporter.sendMail(mailOptions);
      logger.info(`📧 Alert email sent for ${alert.ruleName}`);
    } catch (error) {
      logger.error('Error sending alert email:', error);
    }
  }

  /**
   * Générer template email pour alerte
   */
  generateEmailTemplate(alert) {
    const severityColors = {
      low: '#28a745',
      medium: '#ffc107',
      high: '#fd7e14',
      critical: '#dc3545'
    };

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${severityColors[alert.severity]}; color: white; padding: 20px; text-align: center;">
          <h1>🚨 Alert ${alert.severity.toUpperCase()}</h1>
          <h2>${alert.ruleName}</h2>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <h3>Message</h3>
          <p style="font-size: 16px; background: white; padding: 15px; border-left: 4px solid ${severityColors[alert.severity]};">
            ${alert.message}
          </p>
          
          <h3>Détails</h3>
          <ul>
            <li><strong>ID:</strong> ${alert.id}</li>
            <li><strong>Timestamp:</strong> ${alert.timestamp.toISOString()}</li>
            <li><strong>Severity:</strong> ${alert.severity}</li>
          </ul>
          
          <h3>Data</h3>
          <pre style="background: #f1f3f4; padding: 10px; border-radius: 4px; overflow-x: auto;">
${JSON.stringify(alert.data, null, 2)}
          </pre>
        </div>
        
        <div style="background: #6c757d; color: white; padding: 10px; text-align: center; font-size: 12px;">
          API Pousse Monitoring System
        </div>
      </div>
    `;
  }

  /**
   * Logger l'alerte
   */
  async logAlert(alert) {
    const logLevel = alert.severity === 'critical' || alert.severity === 'high' ? 'error' : 'warn';
    logger[logLevel](`🚨 ALERT [${alert.ruleName}] ${alert.severity.toUpperCase()}: ${alert.message}`, {
      alertId: alert.id,
      timestamp: alert.timestamp,
      data: alert.data
    });
  }

  /**
   * Envoyer notification webhook
   */
  async sendWebhookNotification(alert) {
    if (!process.env.WEBHOOK_URL) {
      logger.debug('Webhook URL not configured, skipping webhook notification');
      return;
    }

    try {
      const axios = require('axios');
      const payload = {
        alertId: alert.id,
        ruleName: alert.ruleName,
        severity: alert.severity,
        message: alert.message,
        timestamp: alert.timestamp,
        data: alert.data
      };

      await axios.post(process.env.WEBHOOK_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });

      logger.info(`📡 Webhook notification sent for ${alert.ruleName}`);
    } catch (error) {
      logger.error('Error sending webhook notification:', error);
    }
  }

  /**
   * Acquitter une alerte
   */
  acknowledgeAlert(alertId, acknowledgedBy, comment = '') {
    const alert = this.activeAlerts.get(alertId);
    if (!alert) {
      return false;
    }

    alert.acknowledged = true;
    alert.acknowledgedBy = acknowledgedBy;
    alert.acknowledgedAt = new Date();
    alert.comment = comment;

    logger.info(`Alert acknowledged: ${alertId} by ${acknowledgedBy}`);
    return true;
  }

  /**
   * Résoudre une alerte
   */
  resolveAlert(alertId, resolvedBy, resolution = '') {
    const alert = this.activeAlerts.get(alertId);
    if (!alert) {
      return false;
    }

    alert.resolvedAt = new Date();
    alert.resolvedBy = resolvedBy;
    alert.resolution = resolution;

    // Supprimer des alertes actives
    this.activeAlerts.delete(alertId);

    logger.info(`Alert resolved: ${alertId} by ${resolvedBy}`);
    return true;
  }

  /**
   * Obtenir les alertes actives
   */
  getActiveAlerts() {
    return Array.from(this.activeAlerts.values()).sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Obtenir l'historique des alertes
   */
  getAlertHistory(limit = 100) {
    return this.alertHistory
      .slice(-limit)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Obtenir la dernière alerte pour une règle
   */
  getLastAlert(ruleName) {
    return this.alertHistory
      .filter(alert => alert.ruleName === ruleName)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
  }

  /**
   * Obtenir statistiques des alertes
   */
  getAlertStats() {
    const now = new Date();
    const last24h = new Date(now - 24 * 60 * 60 * 1000);
    const last7d = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const recent = this.alertHistory.filter(alert => alert.timestamp > last24h);
    const weekly = this.alertHistory.filter(alert => alert.timestamp > last7d);

    return {
      active: this.activeAlerts.size,
      total: this.alertHistory.length,
      last24h: recent.length,
      last7d: weekly.length,
      bySeverity: {
        critical: recent.filter(a => a.severity === 'critical').length,
        high: recent.filter(a => a.severity === 'high').length,
        medium: recent.filter(a => a.severity === 'medium').length,
        low: recent.filter(a => a.severity === 'low').length
      },
      topRules: this.getTopAlertRules(recent),
      avgResolutionTime: this.calculateAvgResolutionTime(weekly)
    };
  }

  /**
   * Obtenir les règles d'alerte les plus fréquentes
   */
  getTopAlertRules(alerts) {
    const counts = {};
    alerts.forEach(alert => {
      counts[alert.ruleName] = (counts[alert.ruleName] || 0) + 1;
    });

    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([rule, count]) => ({ rule, count }));
  }

  /**
   * Calculer temps de résolution moyen
   */
  calculateAvgResolutionTime(alerts) {
    const resolved = alerts.filter(alert => alert.resolvedAt);
    if (resolved.length === 0) return 0;

    const totalTime = resolved.reduce((sum, alert) => {
      return sum + (alert.resolvedAt - alert.timestamp);
    }, 0);

    return Math.round(totalTime / resolved.length / 1000 / 60); // minutes
  }

  /**
   * Démarrer monitoring périodique
   */
  startMonitoring() {
    // Monitoring toutes les 30 secondes
    setInterval(async () => {
      await this.checkSystemMetrics();
    }, 30000);

    // Nettoyage de l'historique toutes les heures
    setInterval(() => {
      this.cleanupHistory();
    }, 60 * 60 * 1000);

    logger.info('📊 Alert monitoring started');
  }

  /**
   * Vérifier les métriques système
   */
  async checkSystemMetrics() {
    try {
      const memUsage = process.memoryUsage();
      const memoryUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

      // Évaluer les métriques système
      await this.evaluateMetric('system', {
        memoryUsagePercent,
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal
      });
    } catch (error) {
      logger.error('Error checking system metrics:', error);
    }
  }

  /**
   * Nettoyer l'historique ancien
   */
  cleanupHistory() {
    const maxHistory = 1000;
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 jours
    const cutoff = new Date(Date.now() - maxAge);

    // Supprimer les alertes anciennes
    this.alertHistory = this.alertHistory
      .filter(alert => alert.timestamp > cutoff)
      .slice(-maxHistory);

    logger.debug(`Alert history cleaned up, ${this.alertHistory.length} alerts remaining`);
  }
}

// Singleton instance
const alertingService = new AlertingService();

module.exports = alertingService;