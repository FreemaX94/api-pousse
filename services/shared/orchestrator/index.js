const AuthService = require('../../auth-service');
const StockService = require('../../stock-service');
const CatalogService = require('../../catalog-service');
const InvoiceService = require('../../invoice-service');
const eventBus = require('../event-bus');
const logger = require('../../../backend/utils/logger');

class ServiceOrchestrator {
  constructor() {
    this.services = new Map();
    this.isInitialized = false;
    this.healthCheckInterval = null;
  }

  /**
   * Initialiser et démarrer tous les services
   */
  async initialize() {
    try {
      logger.info('🚀 Initialisation de l\'orchestrateur de services...');

      // Initialiser le bus d'événements
      await eventBus.initialize();

      // Créer les instances de services
      this.services.set('auth', new AuthService());
      this.services.set('stock', new StockService());
      this.services.set('catalog', new CatalogService());
      this.services.set('invoice', new InvoiceService());

      // Démarrer les services avec des ports différents
      const ports = {
        auth: 3002,
        stock: 3003,
        catalog: 3004,
        invoice: 3005
      };

      const startPromises = [];
      for (const [serviceName, service] of this.services) {
        const port = ports[serviceName];
        startPromises.push(
          service.start(port).then(() => {
            logger.info(`✅ Service ${serviceName} démarré sur le port ${port}`);
          }).catch(error => {
            logger.error(`❌ Erreur démarrage service ${serviceName}:`, error);
            throw error;
          })
        );
      }

      // Attendre que tous les services soient démarrés
      await Promise.all(startPromises);

      // Configurer les événements inter-services
      this.setupCrossServiceEvents();

      // Démarrer le monitoring
      this.startHealthChecks();

      this.isInitialized = true;
      logger.info('🎉 Tous les services microservices sont opérationnels !');

      // Émettre événement de démarrage complet
      await eventBus.emit('system.startup.complete', {
        services: Array.from(this.services.keys()),
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }, {
        service: 'orchestrator'
      });

    } catch (error) {
      logger.error('💥 Erreur initialisation orchestrateur:', error);
      throw error;
    }
  }

  /**
   * Configurer les événements inter-services
   */
  setupCrossServiceEvents() {
    logger.info('🔗 Configuration des événements inter-services...');

    // Événements de synchronisation des données
    eventBus.on('user.deleted', async (eventData) => {
      logger.info('🔄 Propagation suppression utilisateur à tous les services', eventData);
    });

    eventBus.on('catalog.item.updated', async (eventData) => {
      logger.info('🔄 Synchronisation article catalogue avec stock', eventData);
    });

    eventBus.on('invoice.paid', async (eventData) => {
      logger.info('🔄 Traitement paiement facture', eventData);
      
      // Déclencher mise à jour cash-flow
      await eventBus.emit('finance.cash.flow.updated', {
        amount: eventData.amount,
        type: 'income',
        date: eventData.paymentDate,
        source: 'invoice',
        sourceId: eventData.invoiceId
      }, {
        service: 'orchestrator'
      });
    });

    eventBus.on('stock.low.alert', async (eventData) => {
      logger.warn('🚨 Stock faible détecté', eventData);
      
      // Déclencher événement de réapprovisionnement
      await eventBus.emit('procurement.reorder.suggested', {
        items: eventData.items,
        threshold: eventData.threshold,
        suggestedBy: 'stock-service'
      }, {
        service: 'orchestrator'
      });
    });

    // Événements de monitoring et alertes
    eventBus.on('*.error', async (eventData) => {
      logger.error('🚨 Erreur détectée dans le système:', eventData);
      
      // Implémenter alertes administrateur
      await this.sendSystemAlert('error', eventData);
    });

    eventBus.on('*.performance.degraded', async (eventData) => {
      logger.warn('⚠️ Dégradation performance détectée:', eventData);
      
      await this.sendSystemAlert('performance', eventData);
    });
  }

  /**
   * Démarrer les vérifications de santé
   */
  startHealthChecks() {
    logger.info('💓 Démarrage du monitoring de santé des services...');

    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, 30000); // Toutes les 30 secondes

    // Vérification immédiate
    setTimeout(() => this.performHealthCheck(), 5000);
  }

  /**
   * Effectuer une vérification de santé
   */
  async performHealthCheck() {
    const healthStatus = {
      timestamp: new Date().toISOString(),
      overall: 'healthy',
      services: {}
    };

    const axios = require('axios');
    const healthPromises = [];

    // Vérifier chaque service
    const servicePorts = {
      auth: 3002,
      stock: 3003,
      catalog: 3004,
      invoice: 3005
    };

    for (const [serviceName, port] of Object.entries(servicePorts)) {
      healthPromises.push(
        axios.get(`http://localhost:${port}/health`, { timeout: 5000 })
          .then(response => {
            healthStatus.services[serviceName] = {
              status: 'healthy',
              timestamp: response.data.timestamp,
              responseTime: response.headers['x-response-time'] || 'N/A'
            };
          })
          .catch(error => {
            healthStatus.services[serviceName] = {
              status: 'unhealthy',
              error: error.message,
              timestamp: new Date().toISOString()
            };
            healthStatus.overall = 'degraded';
          })
      );
    }

    await Promise.all(healthPromises);

    // Vérifier Redis (Event Bus)
    try {
      const redisHealth = eventBus.getStats();
      healthStatus.eventBus = {
        status: redisHealth.isInitialized ? 'healthy' : 'unhealthy',
        stats: redisHealth
      };
    } catch (error) {
      healthStatus.eventBus = {
        status: 'unhealthy',
        error: error.message
      };
      healthStatus.overall = 'degraded';
    }

    // Émettre événement de santé
    await eventBus.emit('system.health.check', healthStatus, {
      service: 'orchestrator'
    });

    // Logger si problème détecté
    if (healthStatus.overall !== 'healthy') {
      logger.warn('⚠️ Problème de santé système détecté:', healthStatus);
    }

    // Stocker le statut pour l'API
    this.lastHealthStatus = healthStatus;
  }

  /**
   * Envoyer une alerte système
   */
  async sendSystemAlert(type, eventData) {
    const alert = {
      type: type,
      severity: this.calculateSeverity(type, eventData),
      message: this.generateAlertMessage(type, eventData),
      timestamp: new Date().toISOString(),
      data: eventData
    };

    // Émettre événement d'alerte
    await eventBus.emit('system.alert', alert, {
      service: 'orchestrator'
    });

    // Implémenter envoi email/SMS selon la sévérité
    if (alert.severity === 'critical') {
      await this.sendCriticalAlert(alert);
    }
  }

  /**
   * Calculer la sévérité d'une alerte
   */
  calculateSeverity(type, eventData) {
    switch (type) {
      case 'error':
        if (eventData.service === 'auth-service') return 'critical';
        if (eventData.event?.includes('database')) return 'high';
        return 'medium';
      case 'performance':
        if (eventData.processingTime > 5000) return 'high';
        if (eventData.processingTime > 2000) return 'medium';
        return 'low';
      default:
        return 'low';
    }
  }

  /**
   * Générer un message d'alerte
   */
  generateAlertMessage(type, eventData) {
    switch (type) {
      case 'error':
        return `Erreur dans ${eventData.service}: ${eventData.reason || eventData.error}`;
      case 'performance':
        return `Performance dégradée: ${eventData.processingTime}ms pour ${eventData.operation}`;
      default:
        return `Alerte système: ${type}`;
    }
  }

  /**
   * Envoyer une alerte critique
   */
  async sendCriticalAlert(alert) {
    // Implémenter envoi d'urgence (email, SMS, Slack, PagerDuty)
    logger.error('🚨 ALERTE CRITIQUE:', alert);
  }

  /**
   * Obtenir le statut des services
   */
  getServicesStatus() {
    return {
      initialized: this.isInitialized,
      services: Array.from(this.services.keys()),
      eventBus: eventBus.getStats(),
      lastHealthCheck: this.lastHealthStatus
    };
  }

  /**
   * Redémarrer un service spécifique
   */
  async restartService(serviceName) {
    try {
      logger.info(`🔄 Redémarrage du service ${serviceName}...`);

      const service = this.services.get(serviceName);
      if (!service) {
        throw new Error(`Service ${serviceName} non trouvé`);
      }

      // Arrêter le service
      await service.stop();

      // Attendre un peu
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Redémarrer le service
      const ports = { auth: 3002, stock: 3003, catalog: 3004, invoice: 3005 };
      await service.start(ports[serviceName]);

      await eventBus.emit('service.restarted', {
        serviceName,
        timestamp: new Date().toISOString()
      }, {
        service: 'orchestrator'
      });

      logger.info(`✅ Service ${serviceName} redémarré avec succès`);
    } catch (error) {
      logger.error(`❌ Erreur redémarrage service ${serviceName}:`, error);
      throw error;
    }
  }

  /**
   * Arrêter gracieusement tous les services
   */
  async shutdown() {
    try {
      logger.info('🛑 Arrêt gracieux des services...');

      // Arrêter le monitoring
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
      }

      // Émettre événement d'arrêt
      await eventBus.emit('system.shutdown.initiated', {
        timestamp: new Date().toISOString()
      }, {
        service: 'orchestrator'
      });

      // Arrêter tous les services
      const shutdownPromises = [];
      for (const [serviceName, service] of this.services) {
        shutdownPromises.push(
          service.stop().then(() => {
            logger.info(`✅ Service ${serviceName} arrêté`);
          }).catch(error => {
            logger.error(`❌ Erreur arrêt service ${serviceName}:`, error);
          })
        );
      }

      await Promise.all(shutdownPromises);

      // Fermer le bus d'événements
      await eventBus.close();

      this.isInitialized = false;
      logger.info('✅ Arrêt gracieux terminé');

    } catch (error) {
      logger.error('❌ Erreur arrêt gracieux:', error);
      throw error;
    }
  }
}

module.exports = ServiceOrchestrator;