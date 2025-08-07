const redis = require('../config/redisClient');
const logger = require('./logger');

/**
 * Gestionnaire de cache Redis avec stratégies d'optimisation
 * Améliore les performances en cachant les requêtes fréquentes
 */

class CacheManager {
  constructor() {
    this.defaultTTL = 300; // 5 minutes
    this.prefix = 'api-pousse:';
    this.statistics = {
      hits: 0,
      misses: 0,
      errors: 0
    };
  }

  /**
   * Générer une clé de cache normalisée
   */
  generateKey(namespace, identifier, params = {}) {
    const paramString = Object.keys(params).length > 0 
      ? ':' + JSON.stringify(params).replace(/[{}",]/g, '') 
      : '';
    
    return `${this.prefix}${namespace}:${identifier}${paramString}`;
  }

  /**
   * Cache avec fallback automatique
   */
  async getOrSet(key, fallbackFunction, ttl = this.defaultTTL) {
    try {
      // Tentative de récupération depuis le cache
      const cached = await redis.get(key);
      
      if (cached) {
        this.statistics.hits++;
        logger.debug(`🎯 Cache hit: ${key}`);
        return JSON.parse(cached);
      }

      // Cache miss - exécuter la fonction fallback
      this.statistics.misses++;
      logger.debug(`❌ Cache miss: ${key}`);
      
      const startTime = Date.now();
      const result = await fallbackFunction();
      const duration = Date.now() - startTime;

      // Mettre en cache le résultat
      if (result !== null && result !== undefined) {
        await redis.setex(key, ttl, JSON.stringify(result));
        logger.debug(`💾 Cached: ${key} (${duration}ms)`);
      }

      return result;

    } catch (error) {
      this.statistics.errors++;
      logger.error(`❌ Cache error for ${key}:`, error);
      
      // Fallback: exécuter directement la fonction
      return await fallbackFunction();
    }
  }

  /**
   * Cache pour les requêtes utilisateur fréquentes
   */
  async cacheUserQuery(userId, queryType, queryFunction, ttl = 300) {
    const key = this.generateKey('user', userId, { type: queryType });
    return this.getOrSet(key, queryFunction, ttl);
  }

  /**
   * Cache pour les données de catalogue avec invalidation intelligente
   */
  async cacheCatalogData(operation, params, queryFunction, ttl = 1800) { // 30 min
    const key = this.generateKey('catalog', operation, params);
    return this.getOrSet(key, queryFunction, ttl);
  }

  /**
   * Cache pour les statistiques et rapports
   */
  async cacheReportData(reportType, params, queryFunction, ttl = 3600) { // 1 heure
    const key = this.generateKey('report', reportType, params);
    return this.getOrSet(key, queryFunction, ttl);
  }

  /**
   * Cache pour les recherches Nieuwkoop
   */
  async cacheNieuwkoopSearch(searchTerm, filters, queryFunction, ttl = 1800) {
    const key = this.generateKey('nieuwkoop', 'search', { 
      term: searchTerm, 
      ...filters 
    });
    return this.getOrSet(key, queryFunction, ttl);
  }

  /**
   * Cache pour les données de stock avec durée courte
   */
  async cacheStockData(operation, params, queryFunction, ttl = 300) { // 5 min
    const key = this.generateKey('stock', operation, params);
    return this.getOrSet(key, queryFunction, ttl);
  }

  /**
   * Invalidation par pattern
   */
  async invalidatePattern(pattern) {
    try {
      const keys = await redis.keys(`${this.prefix}${pattern}*`);
      
      if (keys.length > 0) {
        await redis.del(...keys);
        logger.info(`🗑️ Cache invalidé: ${keys.length} clés pour pattern ${pattern}`);
      }

      return keys.length;

    } catch (error) {
      logger.error(`❌ Erreur invalidation cache pattern ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Invalidation par namespace
   */
  async invalidateNamespace(namespace) {
    return this.invalidatePattern(namespace);
  }

  /**
   * Invalidation spécifique pour mise à jour catalogue
   */
  async invalidateCatalogCache(itemId = null) {
    const patterns = ['catalog:*'];
    
    if (itemId) {
      patterns.push(`catalog:*${itemId}*`);
    }

    let totalInvalidated = 0;
    for (const pattern of patterns) {
      totalInvalidated += await this.invalidatePattern(pattern);
    }

    return totalInvalidated;
  }

  /**
   * Invalidation pour données utilisateur
   */
  async invalidateUserCache(userId) {
    return this.invalidatePattern(`user:${userId}`);
  }

  /**
   * Cache warming - préchauffer les données fréquemment utilisées
   */
  async warmCache() {
    logger.info('🔥 Démarrage du cache warming...');

    const warmingTasks = [
      this.warmCatalogCache(),
      this.warmStockCache(),
      this.warmReportCache()
    ];

    try {
      await Promise.allSettled(warmingTasks);
      logger.info('✅ Cache warming terminé');
    } catch (error) {
      logger.error('❌ Erreur cache warming:', error);
    }
  }

  /**
   * Préchauffer le cache catalogue
   */
  async warmCatalogCache() {
    try {
      const CatalogueItem = require('../models/CatalogueItem');
      
      // Cache des catégories populaires
      const categories = ['Plantes', 'Contenants', 'Décor'];
      
      for (const category of categories) {
        await this.cacheCatalogData(
          'category',
          { category, limit: 20 },
          () => CatalogueItem.find({ categorie: category, status: 'active' })
            .select('nom categorie price.sellPrice')
            .limit(20)
            .lean(),
          1800
        );
      }

      // Cache des articles les plus populaires
      await this.cacheCatalogData(
        'popular',
        { limit: 50 },
        () => CatalogueItem.find({ status: 'active' })
          .select('nom categorie price.sellPrice stock.quantity')
          .sort({ 'ratings.average': -1 })
          .limit(50)
          .lean(),
        3600
      );

      logger.info('✅ Cache catalogue préchauffé');

    } catch (error) {
      logger.error('❌ Erreur warming cache catalogue:', error);
    }
  }

  /**
   * Préchauffer le cache stock
   */
  async warmStockCache() {
    try {
      const StockEntry = require('../models/StockEntry');
      
      // Cache des stocks récents
      await this.cacheStockData(
        'recent',
        { limit: 100 },
        () => StockEntry.find()
          .select('stockId product quantity type date')
          .sort({ createdAt: -1 })
          .limit(100)
          .lean(),
        600
      );

      logger.info('✅ Cache stock préchauffé');

    } catch (error) {
      logger.error('❌ Erreur warming cache stock:', error);
    }
  }

  /**
   * Préchauffer le cache des rapports
   */
  async warmReportCache() {
    try {
      const Invoice = require('../models/Invoice');
      
      // Cache des statistiques du mois en cours
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      await this.cacheReportData(
        'monthly-stats',
        { month: startOfMonth.getMonth(), year: startOfMonth.getFullYear() },
        () => Invoice.aggregate([
          {
            $match: {
              createdAt: { $gte: startOfMonth },
              status: 'paid'
            }
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$total' },
              totalInvoices: { $sum: 1 },
              avgAmount: { $avg: '$total' }
            }
          }
        ]),
        3600
      );

      logger.info('✅ Cache rapports préchauffé');

    } catch (error) {
      logger.error('❌ Erreur warming cache rapports:', error);
    }
  }

  /**
   * Métriques et monitoring du cache
   */
  getStatistics() {
    const hitRate = this.statistics.hits + this.statistics.misses > 0 
      ? (this.statistics.hits / (this.statistics.hits + this.statistics.misses) * 100).toFixed(2)
      : 0;

    return {
      ...this.statistics,
      hitRate: `${hitRate}%`,
      performance: hitRate > 80 ? 'excellent' : hitRate > 60 ? 'good' : 'poor'
    };
  }

  /**
   * Analyser l'utilisation du cache
   */
  async analyzeCacheUsage() {
    try {
      const keys = await redis.keys(`${this.prefix}*`);
      const usage = {
        totalKeys: keys.length,
        namespaces: {},
        largeKeys: []
      };

      // Analyser par namespace
      for (const key of keys.slice(0, 1000)) { // Limiter l'analyse
        const namespace = key.split(':')[1] || 'unknown';
        usage.namespaces[namespace] = (usage.namespaces[namespace] || 0) + 1;

        // Identifier les grandes clés
        try {
          const size = await redis.memory('usage', key);
          if (size > 1024) { // Plus de 1KB
            usage.largeKeys.push({ key, size });
          }
        } catch (error) {
          // Memory command pas supporté sur toutes les versions Redis
        }
      }

      // Trier les grandes clés
      usage.largeKeys.sort((a, b) => b.size - a.size);
      usage.largeKeys = usage.largeKeys.slice(0, 10); // Top 10

      return usage;

    } catch (error) {
      logger.error('❌ Erreur analyse cache:', error);
      return { error: error.message };
    }
  }

  /**
   * Nettoyage automatique du cache
   */
  async cleanup() {
    try {
      logger.info('🧹 Nettoyage automatique du cache...');

      // Supprimer les clés expirées manuellement si nécessaire
      const keys = await redis.keys(`${this.prefix}*`);
      let cleanedCount = 0;

      for (const key of keys.slice(0, 100)) { // Nettoyer par batch
        const ttl = await redis.ttl(key);
        if (ttl === -1) { // Clé sans expiration
          await redis.expire(key, this.defaultTTL);
          cleanedCount++;
        }
      }

      logger.info(`🧹 Nettoyage terminé: ${cleanedCount} clés ajustées`);
      return cleanedCount;

    } catch (error) {
      logger.error('❌ Erreur nettoyage cache:', error);
      return 0;
    }
  }

  /**
   * Cache multi-niveaux pour les données critiques
   */
  async multiLevelCache(key, queryFunction, options = {}) {
    const {
      l1TTL = 60,    // Cache niveau 1 (mémoire locale) - 1 minute
      l2TTL = 300,   // Cache niveau 2 (Redis) - 5 minutes
      staleWhileRevalidate = true
    } = options;

    // Niveau 1: Cache mémoire locale (pour cette instance)
    if (!this.memoryCache) {
      this.memoryCache = new Map();
    }

    const memKey = `mem:${key}`;
    const memEntry = this.memoryCache.get(memKey);

    if (memEntry && Date.now() - memEntry.timestamp < l1TTL * 1000) {
      return memEntry.data;
    }

    // Niveau 2: Cache Redis
    try {
      const cached = await redis.get(key);
      
      if (cached) {
        const data = JSON.parse(cached);
        
        // Mettre à jour le cache mémoire
        this.memoryCache.set(memKey, {
          data,
          timestamp: Date.now()
        });

        return data;
      }

      // Cache miss - exécuter la requête
      const result = await queryFunction();
      
      // Stocker dans Redis
      await redis.setex(key, l2TTL, JSON.stringify(result));
      
      // Stocker en mémoire
      this.memoryCache.set(memKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;

    } catch (error) {
      logger.error(`❌ Erreur cache multi-niveau ${key}:`, error);
      return await queryFunction();
    }
  }

  /**
   * Démarrer les tâches de maintenance automatique
   */
  startMaintenanceTasks() {
    // Nettoyage toutes les heures
    setInterval(() => {
      this.cleanup();
    }, 60 * 60 * 1000);

    // Warming cache toutes les 6 heures
    setInterval(() => {
      this.warmCache();
    }, 6 * 60 * 60 * 1000);

    // Nettoyage mémoire locale toutes les 10 minutes
    setInterval(() => {
      if (this.memoryCache && this.memoryCache.size > 1000) {
        this.memoryCache.clear();
        logger.info('🧹 Cache mémoire local nettoyé');
      }
    }, 10 * 60 * 1000);

    logger.info('✅ Tâches de maintenance cache démarrées');
  }
}

// Instance singleton
const cacheManager = new CacheManager();

module.exports = cacheManager;