/**
 * Routes pour les opérations diverses inter-pôles
 * Gestion des ventes internes entre départements
 */

const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const InternalOperation = require('../models/InternalOperationModel');
const StockEntry = require('../models/StockEntry');
const { Joi, celebrate, Segments } = require('../middlewares/validation');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * POST /api/internal-operations
 * Créer une nouvelle opération interne
 */
router.post('/',
  authMiddleware(),
  celebrate({
    [Segments.BODY]: Joi.object({
      buyingDepartment: Joi.string().valid('creation', 'entretien', 'upsell').required(),
      sellingDepartment: Joi.string().valid('evenementiel', 'creation', 'entretien', 'upsell').optional(),
      article: Joi.object({
        reference: Joi.string().required(),
        name: Joi.string().required(),
        originalPrice: Joi.number().min(0).required(),
        image: Joi.string().optional(),
        category: Joi.string().optional()
      }).required(),
      quantity: Joi.number().integer().min(1).required(),
      coefficient: Joi.number().min(0.1).required(),
      notes: Joi.string().max(500).optional(),
      stockReference: Joi.string().optional() // ObjectId du stock si applicable
    })
  }),
  async (req, res, next) => {
    try {
      const {
        buyingDepartment,
        article,
        quantity,
        coefficient,
        notes,
        stockReference
      } = req.body;

      // Vérifier si l'article est en stock suffisant
      if (stockReference) {
        const stockItem = await StockEntry.findById(stockReference);
        if (!stockItem) {
          return res.status(404).json({
            success: false,
            message: 'Article non trouvé en stock'
          });
        }

        const availableQuantity = (stockItem.quantity || 0) - (stockItem.reservedQuantity || 0);
        if (availableQuantity < quantity) {
          return res.status(400).json({
            success: false,
            message: `Stock insuffisant. Disponible: ${availableQuantity}, Demandé: ${quantity}`
          });
        }
      }

      // Créer l'opération
      const operation = new InternalOperation({
        sellingDepartment: 'evenementiel', // Toujours événementiel
        buyingDepartment,
        article,
        quantity,
        coefficient,
        notes,
        createdBy: req.user.id,
        stockReference,
        status: 'completed' // Automatiquement finalisée pour les ventes inter-pôles
      });

      await operation.save();

      // Décrémenter directement le stock (pas de validation nécessaire pour les ventes internes)
      if (stockReference) {
        const stockResult = await StockEntry.findByIdAndUpdate(stockReference, {
          $inc: { quantity: -quantity }
        }, { new: true });

        if (!stockResult) {
          throw new Error('Article de stock non trouvé');
        }

        // Vérifier que le stock ne devient pas négatif
        if (stockResult.quantity < 0) {
          // Annuler la décrémention
          await StockEntry.findByIdAndUpdate(stockReference, {
            $inc: { quantity: quantity }
          });
          
          return res.status(400).json({
            success: false,
            message: `Stock insuffisant. Stock disponible: ${stockResult.quantity + quantity}, Demandé: ${quantity}`
          });
        }
      }

      logger.info('Opération interne créée', {
        operationId: operation.operationId,
        userId: req.user.id,
        sellingDepartment: operation.sellingDepartment,
        buyingDepartment: operation.buyingDepartment,
        totalAmount: operation.totalAmount
      });

      await operation.populate('createdBy', 'fullname email');

      res.status(201).json({
        success: true,
        message: 'Opération créée avec succès',
        operation
      });
    } catch (error) {
      logger.error('Erreur création opération interne:', error);
      next(error);
    }
  }
);

/**
 * GET /api/internal-operations
 * Récupérer toutes les opérations avec filtres
 */
router.get('/',
  authMiddleware(),
  celebrate({
    [Segments.QUERY]: Joi.object({
      department: Joi.string().valid('evenementiel', 'creation', 'entretien', 'upsell').optional(),
      status: Joi.string().valid('pending', 'validated', 'cancelled', 'completed').optional(),
      role: Joi.string().valid('seller', 'buyer', 'both').default('both'),
      limit: Joi.number().integer().min(1).max(100).default(50),
      offset: Joi.number().integer().min(0).default(0),
      sortBy: Joi.string().valid('createdAt', 'totalAmount', 'status').default('createdAt'),
      sortOrder: Joi.string().valid('asc', 'desc').default('desc')
    })
  }),
  async (req, res, next) => {
    try {
      const {
        department,
        status,
        role,
        limit,
        offset,
        sortBy,
        sortOrder
      } = req.query;

      // Construire la requête
      let query = {};
      
      if (status) {
        query.status = status;
      }

      if (department) {
        if (role === 'seller') {
          query.sellingDepartment = department;
        } else if (role === 'buyer') {
          query.buyingDepartment = department;
        } else {
          query.$or = [
            { sellingDepartment: department },
            { buyingDepartment: department }
          ];
        }
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const operations = await InternalOperation.find(query)
        .populate('createdBy', 'fullname email')
        .populate('validatedBy', 'fullname email')
        .sort(sortOptions)
        .limit(limit)
        .skip(offset);

      const total = await InternalOperation.countDocuments(query);

      res.json({
        success: true,
        operations,
        pagination: {
          total,
          limit,
          offset,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Erreur récupération opérations:', error);
      next(error);
    }
  }
);

/**
 * GET /api/internal-operations/:id
 * Récupérer une opération spécifique
 */
router.get('/:id',
  authMiddleware(),
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().required()
    })
  }),
  async (req, res, next) => {
    try {
      const operation = await InternalOperation.findById(req.params.id)
        .populate('createdBy', 'fullname email')
        .populate('validatedBy', 'fullname email')
        .populate('stockReference');

      if (!operation) {
        return res.status(404).json({
          success: false,
          message: 'Opération non trouvée'
        });
      }

      res.json({
        success: true,
        operation
      });
    } catch (error) {
      logger.error('Erreur récupération opération:', error);
      next(error);
    }
  }
);

/**
 * PUT /api/internal-operations/:id/validate
 * Valider une opération (admin/manager uniquement)
 */
router.put('/:id/validate',
  authMiddleware(['admin', 'manager']),
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().required()
    })
  }),
  async (req, res, next) => {
    try {
      const operation = await InternalOperation.findById(req.params.id);

      if (!operation) {
        return res.status(404).json({
          success: false,
          message: 'Opération non trouvée'
        });
      }

      if (operation.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: `Impossible de valider une opération ${operation.status}`
        });
      }

      operation.validate(req.user.id);
      await operation.save();

      logger.info('Opération validée', {
        operationId: operation.operationId,
        validatedBy: req.user.id
      });

      await operation.populate('createdBy', 'fullname email');
      await operation.populate('validatedBy', 'fullname email');

      res.json({
        success: true,
        message: 'Opération validée avec succès',
        operation
      });
    } catch (error) {
      logger.error('Erreur validation opération:', error);
      next(error);
    }
  }
);

/**
 * PUT /api/internal-operations/:id/complete
 * Finaliser une opération (admin/manager uniquement)
 */
router.put('/:id/complete',
  authMiddleware(['admin', 'manager']),
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().required()
    })
  }),
  async (req, res, next) => {
    try {
      const operation = await InternalOperation.findById(req.params.id);

      if (!operation) {
        return res.status(404).json({
          success: false,
          message: 'Opération non trouvée'
        });
      }

      const previousStatus = operation.status;
      operation.complete();
      await operation.save();

      // Si stock lié et pas déjà décrémenté, ajuster les quantités
      if (operation.stockReference && previousStatus !== 'completed') {
        if (previousStatus === 'validated') {
          // Si validated -> completed: décrémenter stock et libérer réservation
          await StockEntry.findByIdAndUpdate(operation.stockReference, {
            $inc: { 
              quantity: -operation.quantity,
              reservedQuantity: -operation.quantity
            }
          });
        } else if (previousStatus === 'pending') {
          // Si pending -> completed: décrémenter directement (pas de réservation)
          await StockEntry.findByIdAndUpdate(operation.stockReference, {
            $inc: { quantity: -operation.quantity }
          });
        }
      }

      logger.info('Opération complétée', {
        operationId: operation.operationId,
        completedBy: req.user.id
      });

      res.json({
        success: true,
        message: 'Opération complétée avec succès',
        operation
      });
    } catch (error) {
      logger.error('Erreur finalisation opération:', error);
      next(error);
    }
  }
);

/**
 * DELETE /api/internal-operations/:id
 * Annuler une opération
 */
router.delete('/:id',
  authMiddleware(),
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().required()
    })
  }),
  async (req, res, next) => {
    try {
      const operation = await InternalOperation.findById(req.params.id);

      if (!operation) {
        return res.status(404).json({
          success: false,
          message: 'Opération non trouvée'
        });
      }

      // Seul le créateur ou un admin/manager peut annuler
      if (operation.createdBy.toString() !== req.user.id && !['admin', 'manager'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Vous n\'êtes pas autorisé à annuler cette opération'
        });
      }

      if (operation.status === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Impossible d\'annuler une opération terminée'
        });
      }

      operation.status = 'cancelled';
      await operation.save();

      // Libérer le stock réservé si applicable
      if (operation.stockReference) {
        await StockEntry.findByIdAndUpdate(operation.stockReference, {
          $inc: { reservedQuantity: -operation.quantity }
        });
      }

      logger.info('Opération annulée', {
        operationId: operation.operationId,
        cancelledBy: req.user.id
      });

      res.json({
        success: true,
        message: 'Opération annulée avec succès'
      });
    } catch (error) {
      logger.error('Erreur annulation opération:', error);
      next(error);
    }
  }
);

/**
 * GET /api/internal-operations/stats
 * Statistiques des opérations
 */
router.get('/stats',
  authMiddleware(['admin', 'manager']),
  celebrate({
    [Segments.QUERY]: Joi.object({
      timeRange: Joi.string().valid('7d', '30d', '90d').default('30d')
    })
  }),
  async (req, res, next) => {
    try {
      const { timeRange } = req.query;
      
      const stats = await InternalOperation.getOperationStats(timeRange);
      
      res.json({
        success: true,
        stats,
        timeRange
      });
    } catch (error) {
      logger.error('Erreur récupération stats:', error);
      next(error);
    }
  }
);

module.exports = router;