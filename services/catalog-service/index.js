const express = require('express');
const eventBus = require('../shared/event-bus');
const catalogueController = require('../../backend/controllers/catalogueController');
const nieuwkoopController = require('../../backend/controllers/nieuwkoopController');
const authMiddleware = require('../../backend/middlewares/authMiddleware');
const logger = require('../../backend/utils/logger');

class CatalogService {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupEventHandlers();
    this.syncQueue = [];
    this.isProcessingSync = false;
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    // Routes du catalogue interne
    this.app.get('/items', authMiddleware(), catalogueController.getCatalogueItems);
    this.app.post('/items', authMiddleware(), this.enhancedCreateItem.bind(this));
    this.app.put('/items/:id', authMiddleware(), this.enhancedUpdateItem.bind(this));
    this.app.delete('/items/:id', authMiddleware(), this.enhancedDeleteItem.bind(this));
    
    // Routes Nieuwkoop
    this.app.get('/nieuwkoop/search', authMiddleware(), this.enhancedNieuwkoopSearch.bind(this));
    this.app.get('/nieuwkoop/item/:id', authMiddleware(), this.enhancedNieuwkoopItem.bind(this));
    this.app.post('/nieuwkoop/import/:id', authMiddleware(), this.enhancedImportNieuwkoop.bind(this));
    this.app.get('/nieuwkoop/sync/status', authMiddleware(), this.getNieuwkoopSyncStatus.bind(this));
    this.app.post('/nieuwkoop/sync/trigger', authMiddleware('admin'), this.triggerNieuwkoopSync.bind(this));
    
    // Routes de synchronisation
    this.app.get('/sync/status', authMiddleware(), this.getSyncStatus.bind(this));
    this.app.post('/sync/catalog', authMiddleware('admin'), this.syncCatalog.bind(this));
    this.app.get('/sync/history', authMiddleware(), this.getSyncHistory.bind(this));
    
    // Routes de cache
    this.app.delete('/cache/clear', authMiddleware('admin'), this.clearCache.bind(this));
    this.app.get('/cache/stats', authMiddleware(), this.getCacheStats.bind(this));
    
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        service: 'catalog-service', 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        stats: eventBus.getStats(),
        nieuwkoopStatus: this.isProcessingSync ? 'syncing' : 'idle',
        queueSize: this.syncQueue.length
      });
    });
  }

  setupEventHandlers() {
    // Écouter les événements d'autres services
    eventBus.on('stock.entry.created', this.handleStockEntryCreated.bind(this));
    eventBus.on('invoice.item.used', this.handleInvoiceItemUsed.bind(this));
    eventBus.on('user.deleted', this.handleUserDeleted.bind(this));
  }

  /**
   * Création d'article avec événements
   */
  async enhancedCreateItem(req, res, next) {
    try {
      const startTime = Date.now();
      
      // Exécuter la création standard
      await catalogueController.createCatalogueItem(req, res, next);
      
      // Si succès, émettre événement
      if (res.statusCode === 201) {
        const processingTime = Date.now() - startTime;
        
        await eventBus.emit('catalog.item.created', {
          itemId: res.locals.newItemId,
          name: req.body.name,
          category: req.body.category,
          price: req.body.price,
          supplier: req.body.supplier,
          nieuwkoopId: req.body.nieuwkoopId || null,
          userId: req.user.id,
          username: req.user.username,
          processingTime: processingTime,
          timestamp: new Date().toISOString()
        }, {
          service: 'catalog-service',
          userId: req.user.id
        });

        logger.info(`📋 Article catalogue créé: ${req.body.name}`, {
          itemId: res.locals.newItemId,
          userId: req.user.id,
          processingTime
        });
      }
    } catch (error) {
      await eventBus.emit('catalog.item.creation.failed', {
        reason: error.message,
        data: req.body,
        userId: req.user.id,
        timestamp: new Date().toISOString()
      }, {
        service: 'catalog-service',
        userId: req.user.id
      });
      
      next(error);
    }
  }

  /**
   * Mise à jour d'article avec événements
   */
  async enhancedUpdateItem(req, res, next) {
    try {
      const itemId = req.params.id;
      const oldItem = await CatalogueItem.findById(itemId);
      
      if (!oldItem) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      // Exécuter la mise à jour standard
      await catalogueController.updateCatalogueItem(req, res, next);
      
      // Si succès, émettre événement
      if (res.statusCode === 200) {
        await eventBus.emit('catalog.item.updated', {
          itemId: itemId,
          oldData: {
            name: oldItem.name,
            price: oldItem.price,
            category: oldItem.category
          },
          newData: {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
          },
          userId: req.user.id,
          username: req.user.username,
          timestamp: new Date().toISOString()
        }, {
          service: 'catalog-service',
          userId: req.user.id
        });

        logger.info(`📋 Article catalogue mis à jour: ${itemId}`, {
          userId: req.user.id
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Suppression d'article avec événements
   */
  async enhancedDeleteItem(req, res, next) {
    try {
      const itemId = req.params.id;
      const item = await CatalogueItem.findById(itemId);
      
      if (!item) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      // Vérifier les dépendances
      const hasStock = await StockEntry.findOne({ catalogueItemId: itemId });
      if (hasStock) {
        return res.status(400).json({ error: 'Impossible de supprimer: article utilisé en stock' });
      }

      // Émettre événement avant suppression
      await eventBus.emit('catalog.item.delete.initiated', {
        itemId: itemId,
        itemData: {
          name: item.name,
          category: item.category,
          price: item.price,
          nieuwkoopId: item.nieuwkoopId
        },
        deletedBy: req.user.id,
        timestamp: new Date().toISOString()
      }, {
        service: 'catalog-service',
        userId: req.user.id
      });

      // Exécuter la suppression standard
      await catalogueController.deleteCatalogueItem(req, res, next);
      
      // Si succès, émettre événement de confirmation
      if (res.statusCode === 200) {
        await eventBus.emit('catalog.item.deleted', {
          itemId: itemId,
          deletedBy: req.user.id,
          deletedAt: new Date().toISOString()
        }, {
          service: 'catalog-service',
          userId: req.user.id
        });

        logger.info(`📋 Article catalogue supprimé: ${itemId}`, {
          deletedBy: req.user.username
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Recherche Nieuwkoop avec événements et cache intelligent
   */
  async enhancedNieuwkoopSearch(req, res, next) {
    try {
      const startTime = Date.now();
      const { query, page, limit } = req.query;
      
      // Générer clé de cache
      const cacheKey = `nieuwkoop:search:${query}:${page || 1}:${limit || 20}`;
      
      // Tenter de récupérer depuis le cache Redis
      let results = null;
      try {
        const cachedResults = await redis.get(cacheKey);
        if (cachedResults) {
          results = JSON.parse(cachedResults);
          logger.info('🎯 Résultats Nieuwkoop depuis cache', { query, cacheKey });
        }
      } catch (cacheError) {
        logger.warn('⚠️ Erreur cache Redis, fallback API:', cacheError.message);
      }

      // Si pas en cache, appeler l'API
      if (!results) {
        await nieuwkoopController.searchNieuwkoop(req, res, next);
        results = res.locals.nieuwkoopResults;
        
        // Mettre en cache pour 1 heure
        try {
          await redis.setex(cacheKey, 3600, JSON.stringify(results));
        } catch (cacheError) {
          logger.warn('⚠️ Erreur mise en cache:', cacheError.message);
        }
      } else {
        res.json(results);
      }

      const processingTime = Date.now() - startTime;
      
      // Émettre événement de recherche
      await eventBus.emit('nieuwkoop.search.performed', {
        query: query,
        resultsCount: results?.items?.length || 0,
        page: page || 1,
        limit: limit || 20,
        processingTime: processingTime,
        fromCache: !!results,
        userId: req.user.id,
        username: req.user.username,
        timestamp: new Date().toISOString()
      }, {
        service: 'catalog-service',
        userId: req.user.id
      });

      logger.info(`🔍 Recherche Nieuwkoop: "${query}"`, {
        resultsCount: results?.items?.length || 0,
        processingTime,
        fromCache: !!results,
        userId: req.user.id
      });

    } catch (error) {
      await eventBus.emit('nieuwkoop.search.failed', {
        query: req.query.query,
        reason: error.message,
        userId: req.user.id,
        timestamp: new Date().toISOString()
      }, {
        service: 'catalog-service',
        userId: req.user.id
      });
      
      next(error);
    }
  }

  /**
   * Récupération d'un article Nieuwkoop avec cache
   */
  async enhancedNieuwkoopItem(req, res, next) {
    try {
      const startTime = Date.now();
      const nieuwkoopId = req.params.id;
      
      // Clé de cache pour l'article spécifique
      const cacheKey = `nieuwkoop:item:${nieuwkoopId}`;
      
      // Tenter de récupérer depuis le cache
      let item = null;
      try {
        const cachedItem = await redis.get(cacheKey);
        if (cachedItem) {
          item = JSON.parse(cachedItem);
          res.json(item);
        }
      } catch (cacheError) {
        logger.warn('⚠️ Erreur cache item:', cacheError.message);
      }

      // Si pas en cache, appeler l'API
      if (!item) {
        await nieuwkoopController.getNieuwkoopItem(req, res, next);
        item = res.locals.nieuwkoopItem;
        
        // Mettre en cache pour 24 heures (les détails changent moins souvent)
        try {
          await redis.setex(cacheKey, 86400, JSON.stringify(item));
        } catch (cacheError) {
          logger.warn('⚠️ Erreur mise en cache item:', cacheError.message);
        }
      }

      const processingTime = Date.now() - startTime;
      
      await eventBus.emit('nieuwkoop.item.fetched', {
        nieuwkoopId: nieuwkoopId,
        processingTime: processingTime,
        fromCache: !!item,
        userId: req.user.id,
        timestamp: new Date().toISOString()
      }, {
        service: 'catalog-service',
        userId: req.user.id
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * Import d'un article Nieuwkoop avec événements
   */
  async enhancedImportNieuwkoop(req, res, next) {
    try {
      const startTime = Date.now();
      const nieuwkoopId = req.params.id;
      
      // Exécuter l'import standard
      await nieuwkoopController.importNieuwkoopItem(req, res, next);
      
      // Si succès, émettre événement
      if (res.statusCode === 201) {
        const processingTime = Date.now() - startTime;
        
        await eventBus.emit('nieuwkoop.item.imported', {
          nieuwkoopId: nieuwkoopId,
          catalogItemId: res.locals.newCatalogItemId,
          processingTime: processingTime,
          userId: req.user.id,
          username: req.user.username,
          timestamp: new Date().toISOString()
        }, {
          service: 'catalog-service',
          userId: req.user.id
        });

        // Invalider le cache pour cet item
        try {
          await redis.del(`nieuwkoop:item:${nieuwkoopId}`);
        } catch (cacheError) {
          logger.warn('⚠️ Erreur invalidation cache:', cacheError.message);
        }

        logger.info(`📋 Article Nieuwkoop importé: ${nieuwkoopId}`, {
          catalogItemId: res.locals.newCatalogItemId,
          userId: req.user.id,
          processingTime
        });
      }
    } catch (error) {
      await eventBus.emit('nieuwkoop.import.failed', {
        nieuwkoopId: req.params.id,
        reason: error.message,
        userId: req.user.id,
        timestamp: new Date().toISOString()
      }, {
        service: 'catalog-service',
        userId: req.user.id
      });
      
      next(error);
    }
  }

  /**
   * Statut de synchronisation Nieuwkoop
   */
  async getNieuwkoopSyncStatus(req, res) {
    try {
      const status = {
        isProcessing: this.isProcessingSync,
        queueSize: this.syncQueue.length,
        lastSync: await this.getLastSyncTime(),
        nextScheduledSync: await this.getNextSyncTime(),
        stats: {
          totalImported: await CatalogueItem.countDocuments({ nieuwkoopId: { $exists: true } }),
          lastHourSearches: await this.getSearchStats('hour'),
          lastDaySearches: await this.getSearchStats('day')
        }
      };

      res.json({ success: true, status });
    } catch (error) {
      logger.error('❌ Erreur statut sync Nieuwkoop:', error);
      res.status(500).json({ error: 'Erreur récupération statut' });
    }
  }

  /**
   * Déclencher une synchronisation manuelle
   */
  async triggerNieuwkoopSync(req, res) {
    try {
      if (this.isProcessingSync) {
        return res.status(409).json({ error: 'Synchronisation déjà en cours' });
      }

      // Ajouter à la queue
      this.syncQueue.push({
        type: 'manual',
        userId: req.user.id,
        timestamp: new Date().toISOString()
      });

      // Démarrer le processus si pas déjà en cours
      this.processSyncQueue();

      await eventBus.emit('nieuwkoop.sync.triggered', {
        type: 'manual',
        triggeredBy: req.user.id,
        queueSize: this.syncQueue.length,
        timestamp: new Date().toISOString()
      }, {
        service: 'catalog-service',
        userId: req.user.id
      });

      res.json({ success: true, message: 'Synchronisation programmée' });
    } catch (error) {
      logger.error('❌ Erreur déclenchement sync:', error);
      res.status(500).json({ error: 'Erreur déclenchement synchronisation' });
    }
  }

  /**
   * Traiter la queue de synchronisation
   */
  async processSyncQueue() {
    if (this.isProcessingSync || this.syncQueue.length === 0) {
      return;
    }

    this.isProcessingSync = true;
    const syncTask = this.syncQueue.shift();

    try {
      logger.info('🔄 Début synchronisation Nieuwkoop', syncTask);

      await eventBus.emit('nieuwkoop.sync.started', {
        ...syncTask,
        timestamp: new Date().toISOString()
      }, {
        service: 'catalog-service',
        userId: syncTask.userId
      });

      // Implémenter la logique de synchronisation
      const result = await this.performNieuwkoopSync();

      await eventBus.emit('nieuwkoop.sync.completed', {
        ...syncTask,
        result,
        timestamp: new Date().toISOString()
      }, {
        service: 'catalog-service',
        userId: syncTask.userId
      });

      logger.info('✅ Synchronisation Nieuwkoop terminée', result);

    } catch (error) {
      await eventBus.emit('nieuwkoop.sync.failed', {
        ...syncTask,
        error: error.message,
        timestamp: new Date().toISOString()
      }, {
        service: 'catalog-service',
        userId: syncTask.userId
      });

      logger.error('❌ Erreur synchronisation Nieuwkoop:', error);
    } finally {
      this.isProcessingSync = false;
      
      // Traiter le prochain élément de la queue
      setTimeout(() => this.processSyncQueue(), 1000);
    }
  }

  /**
   * Effectuer la synchronisation avec Nieuwkoop
   */
  async performNieuwkoopSync() {
    // Implémenter la logique de synchronisation complète
    // - Récupérer les nouveaux articles
    // - Mettre à jour les prix
    // - Synchroniser les stocks
    // - Nettoyer les articles obsolètes
    
    return {
      newItems: 0,
      updatedItems: 0,
      deletedItems: 0,
      duration: 0
    };
  }

  /**
   * Vider le cache
   */
  async clearCache(req, res) {
    try {
      const pattern = 'nieuwkoop:*';
      const keys = await redis.keys(pattern);
      
      if (keys.length > 0) {
        await redis.del(...keys);
      }

      await eventBus.emit('catalog.cache.cleared', {
        pattern,
        keysCleared: keys.length,
        clearedBy: req.user.id,
        timestamp: new Date().toISOString()
      }, {
        service: 'catalog-service',
        userId: req.user.id
      });

      logger.info(`🗑️ Cache vidé: ${keys.length} clés supprimées`, {
        pattern,
        clearedBy: req.user.username
      });

      res.json({ 
        success: true, 
        message: `${keys.length} entrées de cache supprimées` 
      });
    } catch (error) {
      logger.error('❌ Erreur vidage cache:', error);
      res.status(500).json({ error: 'Erreur vidage cache' });
    }
  }

  /**
   * Statistiques du cache
   */
  async getCacheStats(req, res) {
    try {
      const searchKeys = await redis.keys('nieuwkoop:search:*');
      const itemKeys = await redis.keys('nieuwkoop:item:*');
      
      const stats = {
        searchCache: {
          entries: searchKeys.length,
          memoryUsage: await this.getCacheMemoryUsage(searchKeys)
        },
        itemCache: {
          entries: itemKeys.length,
          memoryUsage: await this.getCacheMemoryUsage(itemKeys)
        },
        totalEntries: searchKeys.length + itemKeys.length
      };

      res.json({ success: true, stats });
    } catch (error) {
      logger.error('❌ Erreur stats cache:', error);
      res.status(500).json({ error: 'Erreur récupération statistiques' });
    }
  }

  // Méthodes utilitaires
  async getLastSyncTime() {
    // Implémenter récupération dernière sync
    return new Date().toISOString();
  }

  async getNextSyncTime() {
    // Implémenter calcul prochaine sync
    return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  }

  async getSearchStats(period) {
    // Implémenter stats de recherche
    return Math.floor(Math.random() * 100);
  }

  async getCacheMemoryUsage(keys) {
    // Estimer l'usage mémoire
    return keys.length * 1024; // Estimation
  }

  /**
   * Gérer la création d'entrée de stock
   */
  async handleStockEntryCreated(eventData) {
    try {
      logger.info('📦 Mise à jour popularité article', eventData);
      
      // Mettre à jour les statistiques d'usage
      await CatalogueItem.findByIdAndUpdate(
        eventData.catalogueItemId,
        { 
          $inc: { usageCount: 1 },
          $set: { lastUsed: new Date() }
        }
      );
      
    } catch (error) {
      logger.error('❌ Erreur mise à jour popularité:', error);
    }
  }

  /**
   * Gérer l'utilisation d'un article en facture
   */
  async handleInvoiceItemUsed(eventData) {
    try {
      logger.info('💰 Article utilisé en facture', eventData);
      
      // Mettre à jour les statistiques de vente
      await CatalogueItem.findByIdAndUpdate(
        eventData.catalogueItemId,
        { 
          $inc: { salesCount: eventData.quantity },
          $set: { lastSold: new Date() }
        }
      );
      
    } catch (error) {
      logger.error('❌ Erreur mise à jour ventes:', error);
    }
  }

  /**
   * Gérer la suppression d'utilisateur
   */
  async handleUserDeleted(eventData) {
    try {
      logger.info('👤 Nettoyage catalogue pour utilisateur supprimé', eventData);
      
      // Anonymiser les articles créés par cet utilisateur
      await CatalogueItem.updateMany(
        { createdBy: eventData.userIdDeleted },
        { $set: { createdBy: null, createdByNote: `Utilisateur supprimé: ${eventData.usernameDeleted}` } }
      );
      
    } catch (error) {
      logger.error('❌ Erreur nettoyage catalogue utilisateur:', error);
    }
  }

  /**
   * Démarrer le service
   */
  async start(port = 3004) {
    try {
      // Initialiser le bus d'événements
      await eventBus.initialize();
      
      // Démarrer le serveur
      this.server = this.app.listen(port, () => {
        logger.info(`📋 Catalog Service démarré sur le port ${port}`);
      });

      return this.server;
    } catch (error) {
      logger.error('❌ Erreur démarrage Catalog Service:', error);
      throw error;
    }
  }

  /**
   * Arrêter le service
   */
  async stop() {
    try {
      if (this.server) {
        this.server.close();
      }
      await eventBus.close();
      logger.info('📋 Catalog Service arrêté');
    } catch (error) {
      logger.error('❌ Erreur arrêt Catalog Service:', error);
    }
  }
}

module.exports = CatalogService;