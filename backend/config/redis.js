// backend/config/redis.js
// Configuration Redis pour cache et sessions

const { createClient } = require('redis');
const logger = require('../utils/logger');

class RedisManager {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.retryAttempts = 0;
    this.maxRetries = 5;
  }

  async connect() {
    try {
      const redisConfig = {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          connectTimeout: 5000,
          lazyConnect: true,
          reconnectStrategy: (retries) => {
            if (retries > this.maxRetries) {
              logger.error('🔴 Redis: Maximum retries reached, abandoning connection');
              return false;
            }
            const delay = Math.min(retries * 100, 3000);
            logger.warn(`🔄 Redis: Retry ${retries}/${this.maxRetries} in ${delay}ms`);
            return delay;
          }
        },
        // Configuration pour production
        password: process.env.REDIS_PASSWORD || undefined,
        database: parseInt(process.env.REDIS_DB || '0'),
        // Pool de connexions
        pool: {
          min: 2,
          max: 10
        }
      };

      this.client = createClient(redisConfig);

      // Event listeners
      this.client.on('connect', () => {
        logger.info('🟢 Redis: Connexion établie');
        this.isConnected = true;
        this.retryAttempts = 0;
      });

      this.client.on('ready', () => {
        logger.info('🚀 Redis: Prêt à recevoir des commandes');
      });

      this.client.on('error', (err) => {
        logger.error('🔴 Redis: Erreur de connexion:', err.message);
        this.isConnected = false;
      });

      this.client.on('end', () => {
        logger.warn('⚠️ Redis: Connexion fermée');
        this.isConnected = false;
      });

      this.client.on('reconnecting', () => {
        logger.info('🔄 Redis: Reconnexion en cours...');
      });

      await this.client.connect();
      
      // Test de connectivité
      await this.client.ping();
      logger.info('✅ Redis: Cache actif et opérationnel');

      return this.client;
    } catch (error) {
      logger.error('❌ Redis: Échec de connexion:', error.message);
      
      // Mode dégradé sans Redis
      logger.warn('⚠️ Redis: Fonctionnement en mode dégradé (sans cache)');
      this.isConnected = false;
      return null;
    }
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      try {
        await this.client.quit();
        logger.info('👋 Redis: Déconnexion propre');
      } catch (error) {
        logger.error('❌ Redis: Erreur lors de la déconnexion:', error.message);
      }
    }
  }

  getClient() {
    return this.client;
  }

  isReady() {
    return this.isConnected && this.client && this.client.isReady;
  }

  // Méthodes utilitaires pour le cache
  async set(key, value, ttl = 3600) {
    if (!this.isReady()) return false;
    
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      await this.client.setEx(key, ttl, serializedValue);
      return true;
    } catch (error) {
      logger.error(`❌ Redis SET error for key ${key}:`, error.message);
      return false;
    }
  }

  async get(key) {
    if (!this.isReady()) return null;
    
    try {
      const value = await this.client.get(key);
      if (!value) return null;
      
      // Essayer de parser JSON, sinon retourner la string
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      logger.error(`❌ Redis GET error for key ${key}:`, error.message);
      return null;
    }
  }

  async del(key) {
    if (!this.isReady()) return false;
    
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error(`❌ Redis DEL error for key ${key}:`, error.message);
      return false;
    }
  }

  async exists(key) {
    if (!this.isReady()) return false;
    
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`❌ Redis EXISTS error for key ${key}:`, error.message);
      return false;
    }
  }

  async flushall() {
    if (!this.isReady()) return false;
    
    try {
      await this.client.flushAll();
      logger.info('🧹 Redis: Cache vidé complètement');
      return true;
    } catch (error) {
      logger.error('❌ Redis FLUSHALL error:', error.message);
      return false;
    }
  }

  // Méthodes pour les sessions
  async setSession(sessionId, sessionData, ttl = 86400) {
    return this.set(`session:${sessionId}`, sessionData, ttl);
  }

  async getSession(sessionId) {
    return this.get(`session:${sessionId}`);
  }

  async deleteSession(sessionId) {
    return this.del(`session:${sessionId}`);
  }

  // Méthodes pour le rate limiting
  async incrementRateLimit(key, windowMs) {
    if (!this.isReady()) return null;
    
    try {
      const multi = this.client.multi();
      multi.incr(key);
      multi.expire(key, Math.ceil(windowMs / 1000));
      const results = await multi.exec();
      return results[0];
    } catch (error) {
      logger.error(`❌ Redis rate limit error for key ${key}:`, error.message);
      return null;
    }
  }

  // Cache pour les requêtes DB fréquentes
  async cacheDbQuery(queryKey, queryFunction, ttl = 300) {
    // Vérifier le cache d'abord
    const cached = await this.get(`db:${queryKey}`);
    if (cached !== null) {
      logger.debug(`🎯 Cache HIT: ${queryKey}`);
      return cached;
    }

    // Exécuter la requête
    try {
      const result = await queryFunction();
      
      // Mettre en cache si résultat valide
      if (result !== null && result !== undefined) {
        await this.set(`db:${queryKey}`, result, ttl);
        logger.debug(`💾 Cache SET: ${queryKey}`);
      }
      
      return result;
    } catch (error) {
      logger.error(`❌ DB query cache error for ${queryKey}:`, error.message);
      throw error;
    }
  }

  // Invalidation de cache par pattern
  async invalidatePattern(pattern) {
    if (!this.isReady()) return false;
    
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
        logger.info(`🗑️ Cache invalidé: ${keys.length} clés (${pattern})`);
      }
      return true;
    } catch (error) {
      logger.error(`❌ Cache invalidation error for pattern ${pattern}:`, error.message);
      return false;
    }
  }
}

// Instance singleton
const redisManager = new RedisManager();

module.exports = {
  redisManager,
  RedisManager
};