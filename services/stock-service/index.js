const express = require('express');
const eventBus = require('../shared/event-bus');
const stockController = require('../../backend/controllers/stockController');
const movementController = require('../../backend/controllers/movementController');
const authMiddleware = require('../../backend/middlewares/authMiddleware');
const logger = require('../../backend/utils/logger');

class StockService {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupEventHandlers();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    // Routes des stocks
    this.app.get('/entries', authMiddleware(), stockController.getStockEntries);
    this.app.post('/entries', authMiddleware(), this.enhancedCreateEntry.bind(this));
    this.app.put('/entries/:id', authMiddleware(), this.enhancedUpdateEntry.bind(this));
    this.app.delete('/entries/:id', authMiddleware(), this.enhancedDeleteEntry.bind(this));
    
    // Routes des mouvements
    this.app.get('/movements', authMiddleware(), movementController.getMovements);
    this.app.post('/movements', authMiddleware(), this.enhancedCreateMovement.bind(this));
    
    // Routes de reporting
    this.app.get('/report/summary', authMiddleware(), this.getStockSummary.bind(this));
    this.app.get('/report/low-stock', authMiddleware(), this.getLowStockAlert.bind(this));
    this.app.get('/report/movements/:period', authMiddleware(), this.getMovementReport.bind(this));
    
    // Routes d'export
    this.app.get('/export/excel', authMiddleware(), stockController.exportStockToExcel);
    this.app.get('/export/csv', authMiddleware(), this.exportStockToCsv.bind(this));
    
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        service: 'stock-service', 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        stats: eventBus.getStats()
      });
    });
  }

  setupEventHandlers() {
    // Écouter les événements d'autres services
    eventBus.on('user.deleted', this.handleUserDeleted.bind(this));
    eventBus.on('catalog.item.updated', this.handleCatalogItemUpdated.bind(this));
    eventBus.on('invoice.created', this.handleInvoiceCreated.bind(this));
  }

  /**
   * Création d'entrée de stock avec événements
   */
  async enhancedCreateEntry(req, res, next) {
    try {
      const startTime = Date.now();
      
      // Exécuter la création standard
      await stockController.createStockEntry(req, res, next);
      
      // Si succès, émettre événement
      if (res.statusCode === 201) {
        const processingTime = Date.now() - startTime;
        
        await eventBus.emit('stock.entry.created', {
          entryId: res.locals.newEntryId,
          catalogueItemId: req.body.catalogueItemId,
          quantity: req.body.quantity,
          unitPrice: req.body.unitPrice,
          totalValue: req.body.quantity * req.body.unitPrice,
          supplier: req.body.supplier,
          userId: req.user.id,
          username: req.user.username,
          processingTime: processingTime,
          timestamp: new Date().toISOString()
        }, {
          service: 'stock-service',
          userId: req.user.id
        });

        logger.info(`📦 Entrée stock créée: ${req.body.quantity} unités`, {
          entryId: res.locals.newEntryId,
          userId: req.user.id,
          processingTime
        });
      }
    } catch (error) {
      await eventBus.emit('stock.entry.failed', {
        reason: error.message,
        data: req.body,
        userId: req.user.id,
        timestamp: new Date().toISOString()
      }, {
        service: 'stock-service',
        userId: req.user.id
      });
      
      next(error);
    }
  }

  /**
   * Mise à jour d'entrée de stock avec événements
   */
  async enhancedUpdateEntry(req, res, next) {
    try {
      const entryId = req.params.id;
      const oldEntry = await StockEntry.findById(entryId);
      
      if (!oldEntry) {
        return res.status(404).json({ error: 'Entrée non trouvée' });
      }

      // Exécuter la mise à jour standard
      await stockController.updateStockEntry(req, res, next);
      
      // Si succès, émettre événement
      if (res.statusCode === 200) {
        await eventBus.emit('stock.entry.updated', {
          entryId: entryId,
          oldData: {
            quantity: oldEntry.quantity,
            unitPrice: oldEntry.unitPrice,
            totalValue: oldEntry.quantity * oldEntry.unitPrice
          },
          newData: {
            quantity: req.body.quantity,
            unitPrice: req.body.unitPrice,
            totalValue: req.body.quantity * req.body.unitPrice
          },
          userId: req.user.id,
          username: req.user.username,
          timestamp: new Date().toISOString()
        }, {
          service: 'stock-service',
          userId: req.user.id
        });

        logger.info(`📦 Entrée stock mise à jour: ${entryId}`, {
          userId: req.user.id
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Suppression d'entrée de stock avec événements
   */
  async enhancedDeleteEntry(req, res, next) {
    try {
      const entryId = req.params.id;
      const entry = await StockEntry.findById(entryId);
      
      if (!entry) {
        return res.status(404).json({ error: 'Entrée non trouvée' });
      }

      // Émettre événement avant suppression
      await eventBus.emit('stock.entry.delete.initiated', {
        entryId: entryId,
        entryData: {
          catalogueItemId: entry.catalogueItemId,
          quantity: entry.quantity,
          unitPrice: entry.unitPrice,
          totalValue: entry.quantity * entry.unitPrice
        },
        deletedBy: req.user.id,
        timestamp: new Date().toISOString()
      }, {
        service: 'stock-service',
        userId: req.user.id
      });

      // Exécuter la suppression standard
      await stockController.deleteStockEntry(req, res, next);
      
      // Si succès, émettre événement de confirmation
      if (res.statusCode === 200) {
        await eventBus.emit('stock.entry.deleted', {
          entryId: entryId,
          deletedBy: req.user.id,
          deletedAt: new Date().toISOString()
        }, {
          service: 'stock-service',
          userId: req.user.id
        });

        logger.info(`📦 Entrée stock supprimée: ${entryId}`, {
          deletedBy: req.user.username
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Création de mouvement avec événements
   */
  async enhancedCreateMovement(req, res, next) {
    try {
      // Exécuter la création standard
      await movementController.createMovement(req, res, next);
      
      // Si succès, émettre événement
      if (res.statusCode === 201) {
        await eventBus.emit('stock.movement.created', {
          movementId: res.locals.newMovementId,
          type: req.body.type,
          fromLocation: req.body.fromLocation,
          toLocation: req.body.toLocation,
          items: req.body.items,
          userId: req.user.id,
          timestamp: new Date().toISOString()
        }, {
          service: 'stock-service',
          userId: req.user.id
        });

        logger.info(`📦 Mouvement créé: ${req.body.type}`, {
          movementId: res.locals.newMovementId,
          userId: req.user.id
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Rapport de synthèse des stocks
   */
  async getStockSummary(req, res) {
    try {
      // Agrégation des données de stock
      const summary = await StockEntry.aggregate([
        {
          $group: {
            _id: null,
            totalEntries: { $sum: 1 },
            totalQuantity: { $sum: '$quantity' },
            totalValue: { $sum: { $multiply: ['$quantity', '$unitPrice'] } },
            avgUnitPrice: { $avg: '$unitPrice' }
          }
        }
      ]);

      // Émettre événement pour tracking
      await eventBus.emit('stock.report.generated', {
        reportType: 'summary',
        userId: req.user.id,
        timestamp: new Date().toISOString()
      }, {
        service: 'stock-service',
        userId: req.user.id
      });

      res.json({
        success: true,
        summary: summary[0] || {
          totalEntries: 0,
          totalQuantity: 0,
          totalValue: 0,
          avgUnitPrice: 0
        }
      });
    } catch (error) {
      logger.error('❌ Erreur rapport synthèse stock:', error);
      res.status(500).json({ error: 'Erreur génération rapport' });
    }
  }

  /**
   * Alerte stock faible
   */
  async getLowStockAlert(req, res) {
    try {
      const threshold = parseInt(req.query.threshold) || 10;
      
      // Trouver les articles avec stock faible
      const lowStockItems = await StockEntry.aggregate([
        {
          $group: {
            _id: '$catalogueItemId',
            totalQuantity: { $sum: '$quantity' },
            lastEntry: { $max: '$createdAt' }
          }
        },
        {
          $match: {
            totalQuantity: { $lte: threshold }
          }
        },
        {
          $lookup: {
            from: 'catalogueitems',
            localField: '_id',
            foreignField: '_id',
            as: 'item'
          }
        }
      ]);

      // Émettre événement d'alerte si nécessaire
      if (lowStockItems.length > 0) {
        await eventBus.emit('stock.low.alert', {
          itemsCount: lowStockItems.length,
          threshold: threshold,
          items: lowStockItems.map(item => ({
            id: item._id,
            quantity: item.totalQuantity
          })),
          userId: req.user.id,
          timestamp: new Date().toISOString()
        }, {
          service: 'stock-service',
          userId: req.user.id
        });
      }

      res.json({
        success: true,
        threshold,
        lowStockItems
      });
    } catch (error) {
      logger.error('❌ Erreur alerte stock faible:', error);
      res.status(500).json({ error: 'Erreur génération alerte' });
    }
  }

  /**
   * Rapport de mouvements par période
   */
  async getMovementReport(req, res) {
    try {
      const period = req.params.period; // 'day', 'week', 'month'
      let startDate = new Date();
      
      switch (period) {
        case 'day':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }

      const movements = await Movement.find({
        createdAt: { $gte: startDate }
      }).populate('items.catalogueItemId').sort({ createdAt: -1 });

      await eventBus.emit('stock.report.generated', {
        reportType: 'movements',
        period: period,
        movementsCount: movements.length,
        userId: req.user.id,
        timestamp: new Date().toISOString()
      }, {
        service: 'stock-service',
        userId: req.user.id
      });

      res.json({
        success: true,
        period,
        movements
      });
    } catch (error) {
      logger.error('❌ Erreur rapport mouvements:', error);
      res.status(500).json({ error: 'Erreur génération rapport' });
    }
  }

  /**
   * Export CSV
   */
  async exportStockToCsv(req, res) {
    try {
      // Implémenter l'export CSV
      const stocks = await StockEntry.find().populate('catalogueItemId');
      
      // Générer CSV
      const csvData = this.generateCsvData(stocks);
      
      await eventBus.emit('stock.export.generated', {
        format: 'csv',
        recordsCount: stocks.length,
        userId: req.user.id,
        timestamp: new Date().toISOString()
      }, {
        service: 'stock-service',
        userId: req.user.id
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=stock-export.csv');
      res.send(csvData);
    } catch (error) {
      logger.error('❌ Erreur export CSV:', error);
      res.status(500).json({ error: 'Erreur export CSV' });
    }
  }

  /**
   * Générer données CSV
   */
  generateCsvData(stocks) {
    const headers = ['ID', 'Article', 'Quantité', 'Prix Unitaire', 'Valeur Totale', 'Fournisseur', 'Date'];
    const rows = stocks.map(stock => [
      stock._id,
      stock.catalogueItemId?.name || 'N/A',
      stock.quantity,
      stock.unitPrice,
      stock.quantity * stock.unitPrice,
      stock.supplier || 'N/A',
      stock.createdAt.toISOString().split('T')[0]
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Gérer la suppression d'utilisateur
   */
  async handleUserDeleted(eventData) {
    try {
      logger.info('👤 Nettoyage stock pour utilisateur supprimé', eventData);
      
      // Anonymiser les entrées de cet utilisateur
      await StockEntry.updateMany(
        { userId: eventData.userIdDeleted },
        { $set: { userId: null, userNote: `Utilisateur supprimé: ${eventData.usernameDeleted}` } }
      );
      
    } catch (error) {
      logger.error('❌ Erreur nettoyage stock utilisateur:', error);
    }
  }

  /**
   * Gérer la mise à jour d'un article du catalogue
   */
  async handleCatalogItemUpdated(eventData) {
    try {
      logger.info('📋 Synchronisation stock avec catalogue', eventData);
      
      // Mettre à jour les références si nécessaire
      // Implémenter la logique de synchronisation
      
    } catch (error) {
      logger.error('❌ Erreur synchronisation catalogue:', error);
    }
  }

  /**
   * Gérer la création d'une facture
   */
  async handleInvoiceCreated(eventData) {
    try {
      logger.info('💰 Traitement stock pour nouvelle facture', eventData);
      
      // Décrémenter le stock selon la facture
      // Implémenter la logique de décrémentation
      
    } catch (error) {
      logger.error('❌ Erreur traitement stock facture:', error);
    }
  }

  /**
   * Démarrer le service
   */
  async start(port = 3003) {
    try {
      // Initialiser le bus d'événements
      await eventBus.initialize();
      
      // Démarrer le serveur
      this.server = this.app.listen(port, () => {
        logger.info(`📦 Stock Service démarré sur le port ${port}`);
      });

      return this.server;
    } catch (error) {
      logger.error('❌ Erreur démarrage Stock Service:', error);
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
      logger.info('📦 Stock Service arrêté');
    } catch (error) {
      logger.error('❌ Erreur arrêt Stock Service:', error);
    }
  }
}

module.exports = StockService;