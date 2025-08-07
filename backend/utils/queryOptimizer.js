// backend/utils/queryOptimizer.js
// Optimiseur de requêtes MongoDB avec cache et indexation

const { redisManager } = require('../config/redis');
const logger = require('./logger');

class QueryOptimizer {
  constructor() {
    this.queryCache = new Map(); // Cache local pour les requêtes fréquentes
    this.slowQueryThreshold = 1000; // 1 seconde
    this.cacheEnabled = true;
  }

  /**
   * Optimise une requête Mongoose avec projection, lean(), et cache
   */
  static optimizeQuery(query, options = {}) {
    const {
      lean = true,
      projection = null,
      limit = null,
      sort = null,
      populate = null,
      select = null,
      cache = false,
      cacheKey = null,
      cacheTTL = 300
    } = options;

    // Appliquer lean() pour de meilleures performances
    if (lean) {
      query = query.lean();
    }

    // Appliquer la projection pour réduire les données
    if (projection) {
      query = query.select(projection);
    }

    if (select) {
      query = query.select(select);
    }

    // Appliquer la limite
    if (limit) {
      query = query.limit(limit);
    }

    // Appliquer le tri
    if (sort) {
      query = query.sort(sort);
    }

    // Appliquer les relations
    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach(pop => query = query.populate(pop));
      } else {
        query = query.populate(populate);
      }
    }

    return query;
  }

  /**
   * Exécute une requête avec monitoring des performances
   */
  static async executeWithMonitoring(query, queryName = 'unknown') {
    const startTime = Date.now();
    
    try {
      const result = await query;
      const duration = Date.now() - startTime;
      
      // Logger les requêtes lentes
      if (duration > this.slowQueryThreshold) {
        logger.warn(`🐌 Requête lente détectée: ${queryName} (${duration}ms)`);
      }
      
      logger.debug(`📊 Query ${queryName}: ${duration}ms`);
      return result;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`❌ Query failed ${queryName}: ${error.message} (${duration}ms)`);
      throw error;
    }
  }

  /**
   * Cache intelligent pour les requêtes
   */
  static async cachedQuery(query, cacheKey, ttl = 300, queryName = 'cached') {
    try {
      // Vérifier le cache Redis d'abord
      const cached = await redisManager.get(`query:${cacheKey}`);
      if (cached) {
        logger.debug(`🎯 Query cache HIT: ${cacheKey}`);
        return cached;
      }

      // Exécuter la requête avec monitoring
      const result = await this.executeWithMonitoring(query, queryName);
      
      // Mettre en cache si résultat valide
      if (result && (Array.isArray(result) ? result.length > 0 : true)) {
        await redisManager.set(`query:${cacheKey}`, result, ttl);
        logger.debug(`💾 Query cache SET: ${cacheKey}`);
      }
      
      return result;
      
    } catch (error) {
      logger.error(`❌ Cached query error for ${cacheKey}:`, error.message);
      throw error;
    }
  }

  /**
   * Optimisation spécialisée pour les requêtes d'utilisateurs
   */
  static optimizeUserQuery(query, options = {}) {
    const defaultOptions = {
      lean: true,
      projection: '-password -resetPasswordToken -resetPasswordExpires',
      limit: 100,
      sort: { createdAt: -1 },
      ...options
    };

    return this.optimizeQuery(query, defaultOptions);
  }

  /**
   * Optimisation pour les listes paginées
   */
  static async optimizePaginatedQuery(Model, filter = {}, options = {}) {
    const {
      page = 1,
      limit = 10,
      sort = { createdAt: -1 },
      projection = null,
      populate = null,
      lean = true,
      cache = false,
      cacheKey = null,
      cacheTTL = 180
    } = options;

    const skip = (page - 1) * limit;
    
    try {
      // Construire la requête optimisée
      let query = Model.find(filter);
      
      if (lean) query = query.lean();
      if (projection) query = query.select(projection);
      if (populate) {
        if (Array.isArray(populate)) {
          populate.forEach(pop => query = query.populate(pop));
        } else {
          query = query.populate(populate);
        }
      }
      
      query = query.sort(sort).skip(skip).limit(limit);

      // Cache pour les listes fréquemment consultées
      if (cache && cacheKey) {
        return await this.cachedQuery(query, cacheKey, cacheTTL, 'paginated');
      }

      return await this.executeWithMonitoring(query, 'paginated');
      
    } catch (error) {
      logger.error('❌ Paginated query optimization error:', error.message);
      throw error;
    }
  }

  /**
   * Optimisation pour les requêtes d'agrégation
   */
  static async optimizeAggregation(Model, pipeline, options = {}) {
    const {
      cache = false,
      cacheKey = null,
      cacheTTL = 600,
      allowDiskUse = true
    } = options;

    try {
      // Ajouter allowDiskUse pour les grandes agrégations
      const aggregateOptions = {};
      if (allowDiskUse) {
        aggregateOptions.allowDiskUse = true;
      }

      const query = Model.aggregate(pipeline, aggregateOptions);

      if (cache && cacheKey) {
        return await this.cachedQuery(query, cacheKey, cacheTTL, 'aggregation');
      }

      return await this.executeWithMonitoring(query, 'aggregation');
      
    } catch (error) {
      logger.error('❌ Aggregation optimization error:', error.message);
      throw error;
    }
  }

  /**
   * Optimisation pour les requêtes de recherche text
   */
  static optimizeTextSearch(Model, searchTerm, options = {}) {
    const {
      fields = [],
      limit = 20,
      projection = null,
      sort = { score: { $meta: 'textScore' } },
      lean = true
    } = options;

    try {
      let query;
      
      if (fields.length > 0) {
        // Recherche regex sur des champs spécifiques
        const regexPattern = new RegExp(searchTerm, 'i');
        const searchConditions = fields.map(field => ({
          [field]: regexPattern
        }));
        
        query = Model.find({ $or: searchConditions });
      } else {
        // Recherche text index si disponible
        query = Model.find(
          { $text: { $search: searchTerm } },
          { score: { $meta: 'textScore' } }
        );
      }

      return this.optimizeQuery(query, {
        lean,
        projection,
        limit,
        sort
      });
      
    } catch (error) {
      logger.error('❌ Text search optimization error:', error.message);
      throw error;
    }
  }

  /**
   * Création d'index recommandés
   */
  static async createRecommendedIndexes(Model, modelName) {
    try {
      const indexes = [];
      
      // Index standards recommandés
      const standardIndexes = [
        { createdAt: -1 }, // Pour le tri par date
        { updatedAt: -1 }, // Pour les modifications récentes
        { isActive: 1 }, // Pour filtrer les actifs
      ];

      // Index spécifiques par modèle
      const modelSpecificIndexes = {
        User: [
          { email: 1 }, // Unique déjà défini dans le schema
          { username: 1 }, // Unique déjà défini dans le schema
          { role: 1 }, // Pour filtrer par rôle
          { lastLogin: -1 } // Pour les connexions récentes
        ],
        StockEntry: [
          { catalogueItem: 1 }, // Référence produit
          { type: 1 }, // entrée/sortie
          { date: -1 }, // Tri par date
          { 'catalogueItem': 1, 'date': -1 } // Compound index
        ],
        Invoice: [
          { invoiceNumber: 1 }, // Recherche par numéro
          { status: 1 }, // Filtrage par statut
          { dueDate: -1 }, // Tri par échéance
          { 'client': 1, 'status': 1 } // Compound index
        ],
        CatalogueItem: [
          { name: 'text' }, // Recherche text
          { category: 1 }, // Filtrage par catégorie
          { 'category': 1, 'isActive': 1 } // Compound index
        ]
      };

      // Combiner les index
      const allIndexes = [
        ...standardIndexes,
        ...(modelSpecificIndexes[modelName] || [])
      ];

      // Créer les index
      for (const indexSpec of allIndexes) {
        try {
          await Model.createIndex(indexSpec);
          indexes.push(indexSpec);
        } catch (error) {
          // Ignorer si l'index existe déjà
          if (!error.message.includes('already exists')) {
            logger.warn(`⚠️ Index creation warning for ${modelName}:`, error.message);
          }
        }
      }

      if (indexes.length > 0) {
        logger.info(`📊 Created ${indexes.length} indexes for ${modelName}`);
      }
      
      return indexes;
      
    } catch (error) {
      logger.error(`❌ Index creation error for ${modelName}:`, error.message);
      return [];
    }
  }

  /**
   * Analyse des performances de requêtes
   */
  static async analyzeQueryPerformance(query, options = {}) {
    const { explain = false } = options;
    
    try {
      if (explain) {
        const explanation = await query.explain('executionStats');
        
        const stats = {
          totalDocsExamined: explanation.executionStats.totalDocsExamined,
          totalDocsReturned: explanation.executionStats.totalDocsReturned,
          executionTimeMillis: explanation.executionStats.executionTimeMillis,
          indexesUsed: explanation.executionStats.allPlansExecution?.map(p => p.indexName) || []
        };
        
        logger.info('📊 Query performance analysis:', stats);
        return stats;
      }
      
      return null;
      
    } catch (error) {
      logger.error('❌ Query analysis error:', error.message);
      return null;
    }
  }
}

// Instance globale
const queryOptimizer = new QueryOptimizer();

module.exports = {
  QueryOptimizer,
  queryOptimizer
};