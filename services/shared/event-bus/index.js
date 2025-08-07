const redis = require('redis');
const logger = require('../../../backend/utils/logger');

class EventBus {
  constructor() {
    this.publisher = null;
    this.subscriber = null;
    this.handlers = new Map();
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Configuration Redis pour Event Bus
      const redisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true
      };

      // Créer les clients Publisher et Subscriber
      this.publisher = redis.createClient(redisConfig);
      this.subscriber = redis.createClient(redisConfig);

      // Gestion des erreurs
      this.publisher.on('error', (err) => {
        logger.error('🔴 EventBus Publisher Error:', err);
      });

      this.subscriber.on('error', (err) => {
        logger.error('🔴 EventBus Subscriber Error:', err);
      });

      // Connexion
      await this.publisher.connect();
      await this.subscriber.connect();

      // Configuration du subscriber pour les patterns
      this.subscriber.on('message', (channel, message) => {
        this.handleMessage(channel, message);
      });

      this.isInitialized = true;
      logger.info('🟢 EventBus initialisé avec succès');

    } catch (error) {
      logger.error('❌ Erreur initialisation EventBus:', error);
      throw error;
    }
  }

  /**
   * Émettre un événement
   * @param {string} event - Nom de l'événement (ex: 'stock.updated')
   * @param {object} data - Données de l'événement
   * @param {object} options - Options (service, userId, etc.)
   */
  async emit(event, data, options = {}) {
    if (!this.isInitialized) {
      logger.warn('⚠️ EventBus non initialisé, événement ignoré:', event);
      return;
    }

    try {
      const eventData = {
        event,
        data,
        timestamp: new Date().toISOString(),
        service: options.service || 'unknown',
        userId: options.userId || null,
        correlationId: options.correlationId || this.generateCorrelationId(),
        version: '1.0'
      };

      const channel = `api-pousse:${event}`;
      await this.publisher.publish(channel, JSON.stringify(eventData));

      logger.info(`📡 Événement émis: ${event}`, {
        channel,
        correlationId: eventData.correlationId,
        service: eventData.service
      });

    } catch (error) {
      logger.error(`❌ Erreur émission événement ${event}:`, error);
      throw error;
    }
  }

  /**
   * S'abonner à un événement
   * @param {string} pattern - Pattern d'événement (ex: 'stock.*' ou 'stock.updated')
   * @param {function} handler - Fonction de traitement
   */
  async on(pattern, handler) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const channel = `api-pousse:${pattern}`;
      
      // Stocker le handler
      if (!this.handlers.has(channel)) {
        this.handlers.set(channel, []);
      }
      this.handlers.get(channel).push(handler);

      // S'abonner au pattern
      if (pattern.includes('*')) {
        await this.subscriber.pSubscribe(channel);
        logger.info(`🎯 Abonné au pattern: ${pattern}`);
      } else {
        await this.subscriber.subscribe(channel);
        logger.info(`🎯 Abonné à l'événement: ${pattern}`);
      }

    } catch (error) {
      logger.error(`❌ Erreur abonnement ${pattern}:`, error);
      throw error;
    }
  }

  /**
   * Traiter un message reçu
   */
  async handleMessage(channel, message) {
    try {
      const eventData = JSON.parse(message);
      const handlers = this.handlers.get(channel) || [];

      logger.info(`📥 Événement reçu: ${eventData.event}`, {
        channel,
        correlationId: eventData.correlationId,
        service: eventData.service
      });

      // Exécuter tous les handlers
      const promises = handlers.map(async (handler) => {
        try {
          await handler(eventData);
        } catch (error) {
          logger.error(`❌ Erreur handler pour ${eventData.event}:`, error);
        }
      });

      await Promise.allSettled(promises);

    } catch (error) {
      logger.error('❌ Erreur traitement message:', error);
    }
  }

  /**
   * Générer un ID de corrélation unique
   */
  generateCorrelationId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Fermer les connexions
   */
  async close() {
    try {
      if (this.publisher) {
        await this.publisher.quit();
      }
      if (this.subscriber) {
        await this.subscriber.quit();
      }
      logger.info('🔴 EventBus fermé');
    } catch (error) {
      logger.error('❌ Erreur fermeture EventBus:', error);
    }
  }

  /**
   * Obtenir les statistiques du bus d'événements
   */
  getStats() {
    return {
      isInitialized: this.isInitialized,
      handlersCount: Array.from(this.handlers.values()).reduce((total, handlers) => total + handlers.length, 0),
      subscribedChannels: Array.from(this.handlers.keys())
    };
  }
}

// Instance singleton
const eventBus = new EventBus();

module.exports = eventBus;