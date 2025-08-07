const service = require('../services/vehicleService.js');
const { celebrate, Joi, Segments } = require('celebrate');
const logger = require('../utils/logger');

// Schémas de validation améliorés
const createVehicleSchema = {
  [Segments.BODY]: Joi.object({
    licensePlate: Joi.string().trim().uppercase().required()
      .pattern(/^[A-Z0-9-]+$/)
      .messages({
        'string.pattern.base': 'La plaque d\'immatriculation ne peut contenir que des lettres, chiffres et tirets'
      }),
    brand: Joi.string().trim().min(2).max(50).required(),
    model: Joi.string().trim().min(2).max(50).required(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
    capacity: Joi.number().positive().max(50).required(),
    fuelType: Joi.string().valid('essence', 'diesel', 'electrique', 'hybride').required(),
    mileage: Joi.number().min(0).default(0),
    status: Joi.string().valid('disponible', 'en_service', 'maintenance', 'hors_service').default('disponible'),
    notes: Joi.string().max(500).allow(''),
    insuranceExpiry: Joi.date().greater('now').required(),
    technicalInspectionExpiry: Joi.date().greater('now').required()
  })
};

const updateVehicleSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required()
  }),
  [Segments.BODY]: Joi.object({
    licensePlate: Joi.string().trim().uppercase()
      .pattern(/^[A-Z0-9-]+$/)
      .messages({
        'string.pattern.base': 'La plaque d\'immatriculation ne peut contenir que des lettres, chiffres et tirets'
      }),
    brand: Joi.string().trim().min(2).max(50),
    model: Joi.string().trim().min(2).max(50),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()),
    capacity: Joi.number().positive().max(50),
    fuelType: Joi.string().valid('essence', 'diesel', 'electrique', 'hybride'),
    mileage: Joi.number().min(0),
    status: Joi.string().valid('disponible', 'en_service', 'maintenance', 'hors_service'),
    notes: Joi.string().max(500).allow(''),
    insuranceExpiry: Joi.date().greater('now'),
    technicalInspectionExpiry: Joi.date().greater('now')
  }).min(1)
};

const getVehiclesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    capacityMin: Joi.number().positive(),
    capacityMax: Joi.number().positive(),
    status: Joi.string().valid('available', 'in_use', 'maintenance', 'out_of_service', 'retired'),
    type: Joi.string().valid('truck', 'van', 'car', 'trailer', 'motorcycle', 'equipment'),
    fuelType: Joi.string().valid('gasoline', 'diesel', 'electric', 'hybrid', 'lpg'),
    brand: Joi.string().trim(),
    search: Joi.string().trim().max(100),
    sortBy: Joi.string().valid('licensePlate', 'brand', 'model', 'year', 'capacity', 'mileage', 'createdAt').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  })
};

const getVehicleByIdSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required()
  })
};

const deleteVehicleSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required()
  })
};

const uploadDocumentSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required()
  }),
  [Segments.BODY]: Joi.object({
    documentType: Joi.string().valid('insurance', 'technical_inspection', 'registration', 'other').required(),
    description: Joi.string().max(200).allow('')
  })
};

/**
 * Créer un nouveau véhicule
 * POST /api/vehicles
 */
exports.createVehicle = [celebrate(createVehicleSchema), async (req, res, next) => {
  try {
    const vehicleData = {
      ...req.body,
      createdBy: req.user?.userId
    };
    
    const vehicle = await service.createVehicle(vehicleData);
    
    logger.info(`Nouveau véhicule créé: ${vehicle.licensePlate} par ${req.user?.username}`);
    
    res.status(201).json({ 
      status: 'success', 
      message: 'Véhicule créé avec succès',
      data: vehicle 
    });
  } catch (err) {
    if (err.code === 11000) {
      logger.warn(`Tentative de création d'un véhicule avec plaque existante: ${req.body.licensePlate}`);
      return res.status(409).json({ 
        status: 'error', 
        message: 'Un véhicule avec cette plaque d\'immatriculation existe déjà' 
      });
    }
    logger.error(`Erreur lors de la création du véhicule: ${err.message}`);
    next(err);
  }
}];

// Maintien de la compatibilité avec l'ancienne validation
exports.validateCreateVehicle = celebrate(createVehicleSchema);

/**
 * Récupérer la liste des véhicules avec pagination et filtres
 * GET /api/vehicles
 */
exports.getVehicles = [celebrate(getVehiclesSchema), async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      ...req.query
    };
    
    const result = await service.listVehicles(options);
    
    logger.info(`Récupération de ${result.data.length} véhicules (page ${options.page})`);
    
    res.json({ 
      status: 'success', 
      data: result.data, 
      pagination: {
        currentPage: result.meta.currentPage,
        totalPages: result.meta.totalPages,
        totalItems: result.meta.totalItems,
        hasNextPage: result.meta.hasNextPage,
        hasPrevPage: result.meta.hasPrevPage,
        limit: result.meta.limit
      }
    });
  } catch (err) {
    logger.error(`Erreur lors de la récupération des véhicules: ${err.message}`);
    next(err);
  }
}];

// Maintien de la compatibilité avec l'ancienne validation
exports.validateGetVehicles = celebrate(getVehiclesSchema);

/**
 * Récupérer un véhicule par son ID
 * GET /api/vehicles/:id
 */
exports.getVehicleById = [celebrate(getVehicleByIdSchema), async (req, res, next) => {
  try {
    const vehicle = await service.getVehicleById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Véhicule non trouvé' 
      });
    }
    
    logger.info(`Récupération du véhicule: ${vehicle.licensePlate}`);
    
    res.json({ 
      status: 'success', 
      data: vehicle 
    });
  } catch (err) {
    logger.error(`Erreur lors de la récupération du véhicule ${req.params.id}: ${err.message}`);
    next(err);
  }
}];

/**
 * Mettre à jour un véhicule
 * PUT /api/vehicles/:id
 */
exports.updateVehicle = [celebrate(updateVehicleSchema), async (req, res, next) => {
  try {
    const updateData = {
      ...req.body,
      updatedBy: req.user?.userId,
      updatedAt: new Date()
    };
    
    const vehicle = await service.updateVehicle(req.params.id, updateData);
    
    if (!vehicle) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Véhicule non trouvé' 
      });
    }
    
    logger.info(`Véhicule mis à jour: ${vehicle.licensePlate} par ${req.user?.username}`);
    
    res.json({ 
      status: 'success', 
      message: 'Véhicule mis à jour avec succès',
      data: vehicle 
    });
  } catch (err) {
    if (err.code === 11000) {
      logger.warn(`Tentative de mise à jour avec plaque existante: ${req.body.licensePlate}`);
      return res.status(409).json({ 
        status: 'error', 
        message: 'Un véhicule avec cette plaque d\'immatriculation existe déjà' 
      });
    }
    logger.error(`Erreur lors de la mise à jour du véhicule ${req.params.id}: ${err.message}`);
    next(err);
  }
}];

/**
 * Supprimer un véhicule
 * DELETE /api/vehicles/:id
 */
exports.deleteVehicle = [celebrate(deleteVehicleSchema), async (req, res, next) => {
  try {
    const vehicle = await service.deleteVehicle(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Véhicule non trouvé' 
      });
    }
    
    logger.info(`Véhicule supprimé: ${vehicle.licensePlate} par ${req.user?.username}`);
    
    res.json({ 
      status: 'success', 
      message: 'Véhicule supprimé avec succès'
    });
  } catch (err) {
    logger.error(`Erreur lors de la suppression du véhicule ${req.params.id}: ${err.message}`);
    next(err);
  }
}];

/**
 * Télécharger un document pour un véhicule
 * POST /api/vehicles/:id/documents
 */
exports.uploadDocument = [celebrate(uploadDocumentSchema), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Aucun fichier fourni' 
      });
    }
    
    const documentData = {
      ...req.body,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user?.userId
    };
    
    const result = await service.uploadDocument(req.params.id, documentData);
    
    if (!result) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Véhicule non trouvé' 
      });
    }
    
    logger.info(`Document téléchargé pour véhicule ${req.params.id}: ${req.file.originalname}`);
    
    res.status(201).json({ 
      status: 'success', 
      message: 'Document téléchargé avec succès',
      data: result 
    });
  } catch (err) {
    logger.error(`Erreur lors du téléchargement du document: ${err.message}`);
    next(err);
  }
}];

/**
 * Obtenir les statistiques des véhicules
 * GET /api/vehicles/stats
 */
exports.getVehicleStats = async (req, res, next) => {
  try {
    const stats = await service.getVehicleStats();
    
    res.json({ 
      status: 'success', 
      data: stats 
    });
  } catch (err) {
    logger.error(`Erreur lors du calcul des statistiques: ${err.message}`);
    next(err);
  }
};

/**
 * Obtenir les véhicules avec des documents expirés ou bientôt expirés
 * GET /api/vehicles/expiring-documents
 */
exports.getExpiringDocuments = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const vehicles = await service.getExpiringDocuments(parseInt(days));
    
    res.json({ 
      status: 'success', 
      data: vehicles,
      message: `Véhicules avec des documents expirant dans les ${days} prochains jours`
    });
  } catch (err) {
    logger.error(`Erreur lors de la récupération des documents expirants: ${err.message}`);
    next(err);
  }
};
