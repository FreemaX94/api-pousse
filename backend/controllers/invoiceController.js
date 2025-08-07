const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const { celebrate, Joi, Segments } = require('celebrate');
const asyncHandler = require('express-async-handler');
const Invoice = require('../models/Invoice');
const CatalogueItem = require('../models/CatalogueItem');
const User = require('../models/userModel');
const logger = require('../utils/logger');

/**
 * @fileoverview Controller pour la gestion des factures
 * @author Generated with Claude Code
 * @version 1.0.0
 */

// ==================== VALIDATION SCHEMAS ====================

/**
 * Schéma de validation pour les éléments de facture
 */
const invoiceItemSchema = Joi.object({
  catalogueItem: Joi.string().hex().length(24).required()
    .messages({
      'string.hex': 'L\'ID du produit doit être un ObjectId valide',
      'string.length': 'L\'ID du produit doit avoir 24 caractères',
      'any.required': 'L\'ID du produit est obligatoire'
    }),
  description: Joi.string().min(1).max(500).required()
    .messages({
      'string.min': 'La description ne peut pas être vide',
      'string.max': 'La description ne peut pas dépasser 500 caractères',
      'any.required': 'La description est obligatoire'
    }),
  quantity: Joi.number().integer().min(1).required()
    .messages({
      'number.integer': 'La quantité doit être un nombre entier',
      'number.min': 'La quantité doit être supérieure à 0',
      'any.required': 'La quantité est obligatoire'
    }),
  unitPrice: Joi.number().min(0).precision(2).required()
    .messages({
      'number.min': 'Le prix unitaire ne peut pas être négatif',
      'any.required': 'Le prix unitaire est obligatoire'
    }),
  discount: Joi.number().min(0).max(100).default(0)
    .messages({
      'number.min': 'La remise ne peut pas être négative',
      'number.max': 'La remise ne peut pas dépasser 100%'
    }),
  taxRate: Joi.number().min(0).max(100).default(20)
    .messages({
      'number.min': 'Le taux de TVA ne peut pas être négatif',
      'number.max': 'Le taux de TVA ne peut pas dépasser 100%'
    })
});

/**
 * Schéma de validation pour les informations client
 */
const clientSchema = Joi.object({
  type: Joi.string().valid('individual', 'company').default('individual')
    .messages({
      'any.only': 'Le type de client doit être "individual" ou "company"'
    }),
  name: Joi.string().min(2).max(100).required()
    .messages({
      'string.min': 'Le nom du client doit contenir au moins 2 caractères',
      'string.max': 'Le nom du client ne peut pas dépasser 100 caractères',
      'any.required': 'Le nom du client est obligatoire'
    }),
  email: Joi.string().email().optional().allow('')
    .messages({
      'string.email': 'L\'email doit être valide'
    }),
  phone: Joi.string().pattern(/^[+]?[0-9\s\-()]+$/).optional().allow('')
    .messages({
      'string.pattern.base': 'Le numéro de téléphone n\'est pas valide'
    }),
  address: Joi.object({
    street: Joi.string().max(200).optional().allow(''),
    city: Joi.string().max(100).optional().allow(''),
    postalCode: Joi.string().max(20).optional().allow(''),
    country: Joi.string().max(100).default('France')
  }).optional(),
  siret: Joi.string().pattern(/^[0-9]{14}$/).optional().allow('')
    .messages({
      'string.pattern.base': 'Le SIRET doit contenir 14 chiffres'
    }),
  vatNumber: Joi.string().optional().allow('')
});

/**
 * Schéma de validation pour la création d'une facture
 */
const createInvoiceSchema = {
  [Segments.BODY]: Joi.object({
    client: clientSchema.required(),
    employee: Joi.string().hex().length(24).required()
      .messages({
        'string.hex': 'L\'ID de l\'employé doit être un ObjectId valide',
        'string.length': 'L\'ID de l\'employé doit avoir 24 caractères',
        'any.required': 'L\'employé est obligatoire'
      }),
    pole: Joi.string().valid('Création', 'Entretien', 'Événements', 'Vente', 'Conseil').required()
      .messages({
        'any.only': 'Le pôle doit être: Création, Entretien, Événements, Vente ou Conseil',
        'any.required': 'Le pôle est obligatoire'
      }),
    project: Joi.string().hex().length(24).optional().allow('')
      .messages({
        'string.hex': 'L\'ID du projet doit être un ObjectId valide',
        'string.length': 'L\'ID du projet doit avoir 24 caractères'
      }),
    items: Joi.array().items(invoiceItemSchema).min(1).required()
      .messages({
        'array.min': 'Au moins un élément est requis dans la facture',
        'any.required': 'Les éléments de la facture sont obligatoires'
      }),
    paymentTerms: Joi.string().valid('immediate', '15_days', '30_days', '45_days', '60_days').default('30_days')
      .messages({
        'any.only': 'Les conditions de paiement doivent être: immediate, 15_days, 30_days, 45_days ou 60_days'
      }),
    paymentMethod: Joi.string().valid('cash', 'check', 'transfer', 'card', 'paypal').default('transfer')
      .messages({
        'any.only': 'La méthode de paiement doit être: cash, check, transfer, card ou paypal'
      }),
    notes: Joi.object({
      internal: Joi.string().max(1000).optional().allow(''),
      customer: Joi.string().max(1000).optional().allow('')
    }).optional()
  })
};

/**
 * Schéma de validation pour la mise à jour d'une facture
 */
const updateInvoiceSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required()
      .messages({
        'string.hex': 'L\'ID de la facture doit être un ObjectId valide',
        'string.length': 'L\'ID de la facture doit avoir 24 caractères'
      })
  }),
  [Segments.BODY]: Joi.object({
    client: clientSchema.optional(),
    employee: Joi.string().hex().length(24).optional(),
    pole: Joi.string().valid('Création', 'Entretien', 'Événements', 'Vente', 'Conseil').optional(),
    project: Joi.string().hex().length(24).optional().allow(''),
    items: Joi.array().items(invoiceItemSchema).min(1).optional(),
    paymentTerms: Joi.string().valid('immediate', '15_days', '30_days', '45_days', '60_days').optional(),
    paymentMethod: Joi.string().valid('cash', 'check', 'transfer', 'card', 'paypal').optional(),
    notes: Joi.object({
      internal: Joi.string().max(1000).optional().allow(''),
      customer: Joi.string().max(1000).optional().allow('')
    }).optional(),
    status: Joi.string().valid('draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled').optional()
  }).min(1)
};

/**
 * Schéma de validation pour la récupération des factures avec filtres
 */
const getInvoicesSchema = {
  [Segments.QUERY]: Joi.object({
    status: Joi.string().valid('draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled').optional(),
    pole: Joi.string().valid('Création', 'Entretien', 'Événements', 'Vente', 'Conseil').optional(),
    employee: Joi.string().hex().length(24).optional(),
    client: Joi.string().min(2).optional(),
    dateFrom: Joi.date().iso().optional(),
    dateTo: Joi.date().iso().min(Joi.ref('dateFrom')).optional(),
    dueDateFrom: Joi.date().iso().optional(),
    dueDateTo: Joi.date().iso().min(Joi.ref('dueDateFrom')).optional(),
    minAmount: Joi.number().min(0).optional(),
    maxAmount: Joi.number().min(Joi.ref('minAmount')).optional(),
    overdue: Joi.boolean().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sortBy: Joi.string().valid('invoiceNumber', 'client.name', 'amounts.totalTTC', 'dates.issueDate', 'dates.dueDate', 'status').default('dates.issueDate'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    search: Joi.string().min(2).max(100).optional()
  })
};

/**
 * Schéma de validation pour la récupération d'une facture par ID
 */
const getInvoiceByIdSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required()
      .messages({
        'string.hex': 'L\'ID de la facture doit être un ObjectId valide',
        'string.length': 'L\'ID de la facture doit avoir 24 caractères'
      })
  })
};

/**
 * Schéma de validation pour la suppression d'une facture
 */
const deleteInvoiceSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required()
      .messages({
        'string.hex': 'L\'ID de la facture doit être un ObjectId valide',
        'string.length': 'L\'ID de la facture doit avoir 24 caractères'
      })
  })
};

/**
 * Schéma de validation pour l'ajout d'un paiement
 */
const addPaymentSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required()
  }),
  [Segments.BODY]: Joi.object({
    amount: Joi.number().min(0.01).precision(2).required()
      .messages({
        'number.min': 'Le montant du paiement doit être supérieur à 0',
        'any.required': 'Le montant du paiement est obligatoire'
      }),
    method: Joi.string().valid('cash', 'check', 'transfer', 'card', 'paypal').required()
      .messages({
        'any.only': 'La méthode de paiement doit être: cash, check, transfer, card ou paypal',
        'any.required': 'La méthode de paiement est obligatoire'
      }),
    reference: Joi.string().max(100).optional().allow(''),
    note: Joi.string().max(500).optional().allow(''),
    date: Joi.date().iso().default(new Date())
  })
};

/**
 * Schéma de validation pour l'export des factures
 */
const exportInvoicesSchema = {
  [Segments.QUERY]: Joi.object({
    format: Joi.string().valid('csv', 'pdf').default('csv'),
    status: Joi.string().valid('draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled').optional(),
    pole: Joi.string().valid('Création', 'Entretien', 'Événements', 'Vente', 'Conseil').optional(),
    employee: Joi.string().hex().length(24).optional(),
    dateFrom: Joi.date().iso().optional(),
    dateTo: Joi.date().iso().min(Joi.ref('dateFrom')).optional(),
    dueDateFrom: Joi.date().iso().optional(),
    dueDateTo: Joi.date().iso().min(Joi.ref('dueDateFrom')).optional(),
    minAmount: Joi.number().min(0).optional(),
    maxAmount: Joi.number().min(Joi.ref('minAmount')).optional()
  })
};

/**
 * Schéma de validation pour les statistiques des factures
 */
const getInvoiceStatsSchema = {
  [Segments.QUERY]: Joi.object({
    dateFrom: Joi.date().iso().optional(),
    dateTo: Joi.date().iso().min(Joi.ref('dateFrom')).optional(),
    pole: Joi.string().valid('Création', 'Entretien', 'Événements', 'Vente', 'Conseil').optional(),
    employee: Joi.string().hex().length(24).optional(),
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month')
  })
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Construit la requête de filtrage pour les factures
 * @param {Object} filters - Filtres de requête
 * @returns {Object} - Requête MongoDB
 */
const buildInvoiceQuery = (filters) => {
  const query = {};
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.pole) {
    query.pole = filters.pole;
  }
  
  if (filters.employee) {
    query.employee = filters.employee;
  }
  
  if (filters.client) {
    query['client.name'] = { $regex: filters.client, $options: 'i' };
  }
  
  if (filters.dateFrom || filters.dateTo) {
    query['dates.issueDate'] = {};
    if (filters.dateFrom) query['dates.issueDate'].$gte = new Date(filters.dateFrom);
    if (filters.dateTo) query['dates.issueDate'].$lte = new Date(filters.dateTo);
  }
  
  if (filters.dueDateFrom || filters.dueDateTo) {
    query['dates.dueDate'] = {};
    if (filters.dueDateFrom) query['dates.dueDate'].$gte = new Date(filters.dueDateFrom);
    if (filters.dueDateTo) query['dates.dueDate'].$lte = new Date(filters.dueDateTo);
  }
  
  if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
    query['amounts.totalTTC'] = {};
    if (filters.minAmount !== undefined) query['amounts.totalTTC'].$gte = filters.minAmount;
    if (filters.maxAmount !== undefined) query['amounts.totalTTC'].$lte = filters.maxAmount;
  }
  
  if (filters.overdue) {
    query['dates.dueDate'] = { $lt: new Date() };
    query.status = { $in: ['sent', 'partial', 'overdue'] };
  }
  
  if (filters.search) {
    query.$or = [
      { 'client.name': { $regex: filters.search, $options: 'i' } },
      { invoiceNumber: { $regex: filters.search, $options: 'i' } },
      { 'notes.customer': { $regex: filters.search, $options: 'i' } }
    ];
  }
  
  return query;
};

/**
 * Construit l'objet de tri pour les factures
 * @param {string} sortBy - Champ de tri
 * @param {string} sortOrder - Ordre de tri
 * @returns {Object} - Objet de tri MongoDB
 */
const buildInvoiceSort = (sortBy, sortOrder) => {
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  
  // Tri secondaire par date de création
  if (sortBy !== 'dates.issueDate') {
    sort['dates.issueDate'] = -1;
  }
  
  return sort;
};

/**
 * Vérifie les permissions pour l'accès aux factures
 * @param {Object} user - Utilisateur connecté
 * @param {string} employeeId - ID de l'employé de la facture
 * @returns {boolean} - Autorisation accordée
 */
const checkInvoicePermissions = (user, employeeId = null) => {
  // Les administrateurs peuvent accéder à toutes les factures
  if (user.role === 'admin') {
    return true;
  }
  
  // Les utilisateurs normaux ne peuvent accéder qu'à leurs propres factures
  if (employeeId && user.userId !== employeeId.toString()) {
    return false;
  }
  
  return true;
};

/**
 * Valide l'existence des références dans une facture
 * @param {Object} invoiceData - Données de la facture
 * @returns {Promise<void>}
 */
const validateInvoiceReferences = async (invoiceData) => {
  // Vérifier l'existence de l'employé
  const employee = await User.findById(invoiceData.employee);
  if (!employee) {
    throw new Error('Employé non trouvé');
  }
  
  // Vérifier l'existence des produits dans les éléments
  if (invoiceData.items && invoiceData.items.length > 0) {
    const catalogueItemIds = invoiceData.items.map(item => item.catalogueItem);
    const catalogueItems = await CatalogueItem.find({ _id: { $in: catalogueItemIds } });
    
    if (catalogueItems.length !== catalogueItemIds.length) {
      throw new Error('Un ou plusieurs produits du catalogue n\'existent pas');
    }
  }
};

// ==================== CONTROLLER METHODS ====================

/**
 * Crée une nouvelle facture
 * @route POST /api/invoices
 * @access Private
 */
const createInvoice = [
  celebrate(createInvoiceSchema),
  asyncHandler(async (req, res) => {
    try {
      const invoiceData = req.body;
      
      // Vérifier les permissions
      if (!checkInvoicePermissions(req.user, invoiceData.employee)) {
        logger.warn(`Tentative d'accès non autorisé aux factures par l'utilisateur ${req.user.userId}`);
        return res.status(403).json({
          status: 'error',
          message: 'Accès non autorisé'
        });
      }
      
      // Valider les références
      await validateInvoiceReferences(invoiceData);
      
      // Créer la facture
      const invoice = new Invoice(invoiceData);
      await invoice.save();
      
      // Populer les références pour la réponse
      const populatedInvoice = await Invoice.findById(invoice._id)
        .populate('employee', 'username fullname email')
        .populate('project', 'name description')
        .populate('items.catalogueItem', 'nom categorie prix');
      
      logger.log(`Nouvelle facture créée: ${invoice.invoiceNumber} par ${req.user.username}`);
      
      res.status(201).json({
        status: 'success',
        message: 'Facture créée avec succès',
        data: {
          invoice: populatedInvoice
        }
      });
      
    } catch (error) {
      logger.error(`Erreur lors de la création de la facture: ${error.message}`);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          status: 'error',
          message: 'Données de facture invalides',
          errors: Object.values(error.errors).map(err => err.message)
        });
      }
      
      if (error.code === 11000) {
        return res.status(409).json({
          status: 'error',
          message: 'Numéro de facture déjà existant'
        });
      }
      
      res.status(500).json({
        status: 'error',
        message: 'Erreur interne du serveur'
      });
    }
  })
];

/**
 * Récupère toutes les factures avec filtres et pagination
 * @route GET /api/invoices
 * @access Private
 */
const getInvoices = [
  celebrate(getInvoicesSchema),
  asyncHandler(async (req, res) => {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = 'dates.issueDate',
        sortOrder = 'desc',
        ...filters
      } = req.query;
      
      // Construire la requête de filtrage
      const query = buildInvoiceQuery(filters);
      
      // Ajouter la restriction par utilisateur si nécessaire
      if (req.user.role !== 'admin') {
        query.employee = req.user.userId;
      }
      
      // Construire le tri
      const sort = buildInvoiceSort(sortBy, sortOrder);
      
      // Calculer la pagination
      const skip = (page - 1) * limit;
      
      // Exécuter les requêtes en parallèle
      const [invoices, total] = await Promise.all([
        Invoice.find(query)
          .populate('employee', 'username fullname email')
          .populate('project', 'name description')
          .populate('items.catalogueItem', 'nom categorie prix')
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit)),
        Invoice.countDocuments(query)
      ]);
      
      // Calculer les métadonnées de pagination
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      
      logger.log(`Récupération de ${invoices.length} factures (page ${page}/${totalPages})`);
      
      res.status(200).json({
        status: 'success',
        data: {
          invoices,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: total,
            itemsPerPage: parseInt(limit),
            hasNextPage,
            hasPrevPage
          }
        }
      });
      
    } catch (error) {
      logger.error(`Erreur lors de la récupération des factures: ${error.message}`);
      res.status(500).json({
        status: 'error',
        message: 'Erreur interne du serveur'
      });
    }
  })
];

/**
 * Récupère une facture par son ID
 * @route GET /api/invoices/:id
 * @access Private
 */
const getInvoiceById = [
  celebrate(getInvoiceByIdSchema),
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      
      // Récupérer la facture avec les références populées
      const invoice = await Invoice.findById(id)
        .populate('employee', 'username fullname email')
        .populate('project', 'name description status')
        .populate('items.catalogueItem', 'nom categorie prix infos')
        .populate('metadata.sentBy', 'username fullname');
      
      if (!invoice) {
        return res.status(404).json({
          status: 'error',
          message: 'Facture non trouvée'
        });
      }
      
      // Vérifier les permissions
      if (!checkInvoicePermissions(req.user, invoice.employee._id)) {
        logger.warn(`Tentative d'accès non autorisé à la facture ${id} par l'utilisateur ${req.user.userId}`);
        return res.status(403).json({
          status: 'error',
          message: 'Accès non autorisé'
        });
      }
      
      logger.log(`Récupération de la facture ${invoice.invoiceNumber} par ${req.user.username}`);
      
      res.status(200).json({
        status: 'success',
        data: {
          invoice
        }
      });
      
    } catch (error) {
      logger.error(`Erreur lors de la récupération de la facture ${req.params.id}: ${error.message}`);
      res.status(500).json({
        status: 'error',
        message: 'Erreur interne du serveur'
      });
    }
  })
];

/**
 * Met à jour une facture
 * @route PUT /api/invoices/:id
 * @access Private
 */
const updateInvoice = [
  celebrate(updateInvoiceSchema),
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Récupérer la facture existante
      const existingInvoice = await Invoice.findById(id);
      if (!existingInvoice) {
        return res.status(404).json({
          status: 'error',
          message: 'Facture non trouvée'
        });
      }
      
      // Vérifier les permissions
      if (!checkInvoicePermissions(req.user, existingInvoice.employee)) {
        logger.warn(`Tentative de modification non autorisée de la facture ${id} par l'utilisateur ${req.user.userId}`);
        return res.status(403).json({
          status: 'error',
          message: 'Accès non autorisé'
        });
      }
      
      // Vérifier si la facture peut être modifiée
      if (existingInvoice.status === 'paid') {
        return res.status(400).json({
          status: 'error',
          message: 'Impossible de modifier une facture payée'
        });
      }
      
      // Valider les nouvelles références si elles sont fournies
      if (updateData.employee || updateData.items) {
        await validateInvoiceReferences({ 
          employee: updateData.employee || existingInvoice.employee,
          items: updateData.items || existingInvoice.items 
        });
      }
      
      // Mettre à jour la facture
      const updatedInvoice = await Invoice.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )
        .populate('employee', 'username fullname email')
        .populate('project', 'name description')
        .populate('items.catalogueItem', 'nom categorie prix');
      
      logger.log(`Facture ${updatedInvoice.invoiceNumber} mise à jour par ${req.user.username}`);
      
      res.status(200).json({
        status: 'success',
        message: 'Facture mise à jour avec succès',
        data: {
          invoice: updatedInvoice
        }
      });
      
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour de la facture ${req.params.id}: ${error.message}`);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          status: 'error',
          message: 'Données de facture invalides',
          errors: Object.values(error.errors).map(err => err.message)
        });
      }
      
      res.status(500).json({
        status: 'error',
        message: 'Erreur interne du serveur'
      });
    }
  })
];

/**
 * Supprime une facture
 * @route DELETE /api/invoices/:id
 * @access Private/Admin
 */
const deleteInvoice = [
  celebrate(deleteInvoiceSchema),
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      
      // Récupérer la facture existante
      const invoice = await Invoice.findById(id);
      if (!invoice) {
        return res.status(404).json({
          status: 'error',
          message: 'Facture non trouvée'
        });
      }
      
      // Vérifier les permissions (seuls les admins peuvent supprimer)
      if (req.user.role !== 'admin') {
        logger.warn(`Tentative de suppression non autorisée de la facture ${id} par l'utilisateur ${req.user.userId}`);
        return res.status(403).json({
          status: 'error',
          message: 'Seuls les administrateurs peuvent supprimer des factures'
        });
      }
      
      // Vérifier si la facture peut être supprimée
      if (invoice.status === 'paid') {
        return res.status(400).json({
          status: 'error',
          message: 'Impossible de supprimer une facture payée'
        });
      }
      
      // Supprimer la facture
      await Invoice.findByIdAndDelete(id);
      
      logger.log(`Facture ${invoice.invoiceNumber} supprimée par ${req.user.username}`);
      
      res.status(200).json({
        status: 'success',
        message: 'Facture supprimée avec succès'
      });
      
    } catch (error) {
      logger.error(`Erreur lors de la suppression de la facture ${req.params.id}: ${error.message}`);
      res.status(500).json({
        status: 'error',
        message: 'Erreur interne du serveur'
      });
    }
  })
];

/**
 * Ajoute un paiement à une facture
 * @route POST /api/invoices/:id/payments
 * @access Private
 */
const addPayment = [
  celebrate(addPaymentSchema),
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, method, reference, note, date } = req.body;
      
      // Récupérer la facture
      const invoice = await Invoice.findById(id);
      if (!invoice) {
        return res.status(404).json({
          status: 'error',
          message: 'Facture non trouvée'
        });
      }
      
      // Vérifier les permissions
      if (!checkInvoicePermissions(req.user, invoice.employee)) {
        logger.warn(`Tentative d'ajout de paiement non autorisé sur la facture ${id} par l'utilisateur ${req.user.userId}`);
        return res.status(403).json({
          status: 'error',
          message: 'Accès non autorisé'
        });
      }
      
      // Vérifier si la facture peut recevoir des paiements
      if (invoice.status === 'cancelled') {
        return res.status(400).json({
          status: 'error',
          message: 'Impossible d\'ajouter un paiement à une facture annulée'
        });
      }
      
      // Vérifier que le montant n'excède pas le montant restant
      const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
      const remaining = invoice.amounts.totalTTC - totalPaid;
      
      if (amount > remaining) {
        return res.status(400).json({
          status: 'error',
          message: `Le montant du paiement (${amount}€) excède le montant restant (${remaining}€)`
        });
      }
      
      // Ajouter le paiement
      await invoice.addPayment(amount, method, reference, note);
      
      // Récupérer la facture mise à jour
      const updatedInvoice = await Invoice.findById(id)
        .populate('employee', 'username fullname email')
        .populate('project', 'name description');
      
      logger.log(`Paiement de ${amount}€ ajouté à la facture ${invoice.invoiceNumber} par ${req.user.username}`);
      
      res.status(200).json({
        status: 'success',
        message: 'Paiement ajouté avec succès',
        data: {
          invoice: updatedInvoice
        }
      });
      
    } catch (error) {
      logger.error(`Erreur lors de l'ajout du paiement à la facture ${req.params.id}: ${error.message}`);
      res.status(500).json({
        status: 'error',
        message: 'Erreur interne du serveur'
      });
    }
  })
];

/**
 * Exporte les factures en CSV ou PDF
 * @route GET /api/invoices/export
 * @access Private
 */
const exportInvoices = [
  celebrate(exportInvoicesSchema),
  asyncHandler(async (req, res) => {
    try {
      const { format = 'csv', ...filters } = req.query;
      
      // Construire la requête de filtrage
      const query = buildInvoiceQuery(filters);
      
      // Ajouter la restriction par utilisateur si nécessaire
      if (req.user.role !== 'admin') {
        query.employee = req.user.userId;
      }
      
      // Récupérer les factures
      const invoices = await Invoice.find(query)
        .populate('employee', 'username fullname email')
        .populate('project', 'name description')
        .populate('items.catalogueItem', 'nom categorie prix')
        .sort({ 'dates.issueDate': -1 });
      
      if (invoices.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Aucune facture trouvée pour les critères spécifiés'
        });
      }
      
      logger.log(`Export de ${invoices.length} factures en format ${format} par ${req.user.username}`);
      
      if (format === 'csv') {
        const fields = [
          { label: 'Numéro', value: 'invoiceNumber' },
          { label: 'Client', value: 'client.name' },
          { label: 'Type Client', value: 'client.type' },
          { label: 'Email Client', value: 'client.email' },
          { label: 'Employé', value: 'employee.fullname' },
          { label: 'Pôle', value: 'pole' },
          { label: 'Statut', value: 'status' },
          { label: 'Montant HT', value: 'amounts.subtotalHT' },
          { label: 'Montant TTC', value: 'amounts.totalTTC' },
          { label: 'Date Émission', value: 'dates.issueDate' },
          { label: 'Date Échéance', value: 'dates.dueDate' },
          { label: 'Date Paiement', value: 'dates.paidDate' },
          { label: 'Conditions Paiement', value: 'paymentTerms' },
          { label: 'Méthode Paiement', value: 'paymentMethod' },
          { label: 'Notes Client', value: 'notes.customer' }
        ];
        
        const parser = new Parser({ fields });
        const csv = parser.parse(invoices);
        
        res.header('Content-Type', 'text/csv; charset=utf-8');
        res.attachment(`factures_${new Date().toISOString().split('T')[0]}.csv`);
        return res.send('\uFEFF' + csv);
      }
      
      if (format === 'pdf') {
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=factures_${new Date().toISOString().split('T')[0]}.pdf`);
        doc.pipe(res);
        
        // En-tête
        doc.fontSize(20).text('Liste des Factures', { align: 'center' });
        doc.fontSize(12).text(`Export généré le: ${new Date().toLocaleString('fr-FR')}`, { align: 'center' });
        doc.text(`Nombre de factures: ${invoices.length}`, { align: 'center' });
        doc.moveDown(2);
        
        invoices.forEach((invoice, index) => {
          if (index > 0 && index % 8 === 0) {
            doc.addPage();
          }
          
          doc.fontSize(14).text(`Facture ${invoice.invoiceNumber}`, { underline: true });
          doc.fontSize(10)
            .text(`Client: ${invoice.client.name}`, { indent: 20 })
            .text(`Email: ${invoice.client.email || 'N/A'}`, { indent: 20 })
            .text(`Employé: ${invoice.employee.fullname}`, { indent: 20 })
            .text(`Pôle: ${invoice.pole}`, { indent: 20 })
            .text(`Statut: ${invoice.status}`, { indent: 20 })
            .text(`Montant TTC: ${invoice.amounts.totalTTC}€`, { indent: 20 })
            .text(`Date émission: ${new Date(invoice.dates.issueDate).toLocaleDateString('fr-FR')}`, { indent: 20 })
            .text(`Date échéance: ${new Date(invoice.dates.dueDate).toLocaleDateString('fr-FR')}`, { indent: 20 });
          
          if (invoice.notes.customer) {
            doc.text(`Notes: ${invoice.notes.customer}`, { indent: 20 });
          }
          
          doc.moveDown();
        });
        
        doc.end();
      }
      
    } catch (error) {
      logger.error(`Erreur lors de l'export des factures: ${error.message}`);
      res.status(500).json({
        status: 'error',
        message: 'Erreur interne du serveur'
      });
    }
  })
];

/**
 * Récupère les statistiques des factures
 * @route GET /api/invoices/stats
 * @access Private
 */
const getInvoiceStats = [
  celebrate(getInvoiceStatsSchema),
  asyncHandler(async (req, res) => {
    try {
      const { dateFrom, dateTo, pole, employee, period } = req.query;
      
      // Construire la requête de base
      const baseQuery = {};
      
      if (dateFrom || dateTo) {
        baseQuery['dates.issueDate'] = {};
        if (dateFrom) baseQuery['dates.issueDate'].$gte = new Date(dateFrom);
        if (dateTo) baseQuery['dates.issueDate'].$lte = new Date(dateTo);
      }
      
      if (pole) baseQuery.pole = pole;
      if (employee) baseQuery.employee = employee;
      
      // Ajouter la restriction par utilisateur si nécessaire
      if (req.user.role !== 'admin') {
        baseQuery.employee = req.user.userId;
      }
      
      // Statistiques par statut
      const statusStats = await Invoice.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amounts.totalTTC' },
            avgAmount: { $avg: '$amounts.totalTTC' }
          }
        }
      ]);
      
      // Statistiques par pôle
      const poleStats = await Invoice.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: '$pole',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amounts.totalTTC' },
            avgAmount: { $avg: '$amounts.totalTTC' }
          }
        },
        { $sort: { totalAmount: -1 } }
      ]);
      
      // Statistiques par période
      const periodGrouping = {
        day: { $dateToString: { format: '%Y-%m-%d', date: '$dates.issueDate' } },
        week: { $dateToString: { format: '%Y-W%U', date: '$dates.issueDate' } },
        month: { $dateToString: { format: '%Y-%m', date: '$dates.issueDate' } },
        quarter: { $dateToString: { format: '%Y-Q%q', date: '$dates.issueDate' } },
        year: { $dateToString: { format: '%Y', date: '$dates.issueDate' } }
      };
      
      const periodStats = await Invoice.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: periodGrouping[period],
            count: { $sum: 1 },
            totalAmount: { $sum: '$amounts.totalTTC' },
            avgAmount: { $avg: '$amounts.totalTTC' }
          }
        },
        { $sort: { _id: 1 } }
      ]);
      
      // Statistiques globales
      const globalStats = await Invoice.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: null,
            totalInvoices: { $sum: 1 },
            totalAmount: { $sum: '$amounts.totalTTC' },
            avgAmount: { $avg: '$amounts.totalTTC' },
            paidInvoices: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] } },
            paidAmount: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$amounts.totalTTC', 0] } },
            overdueInvoices: { $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] } },
            overdueAmount: { $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, '$amounts.totalTTC', 0] } }
          }
        }
      ]);
      
      // Top clients
      const topClients = await Invoice.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: '$client.name',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amounts.totalTTC' },
            avgAmount: { $avg: '$amounts.totalTTC' }
          }
        },
        { $sort: { totalAmount: -1 } },
        { $limit: 10 }
      ]);
      
      logger.log(`Statistiques des factures récupérées par ${req.user.username}`);
      
      res.status(200).json({
        status: 'success',
        data: {
          period: period,
          global: globalStats[0] || {
            totalInvoices: 0,
            totalAmount: 0,
            avgAmount: 0,
            paidInvoices: 0,
            paidAmount: 0,
            overdueInvoices: 0,
            overdueAmount: 0
          },
          byStatus: statusStats,
          byPole: poleStats,
          byPeriod: periodStats,
          topClients: topClients
        }
      });
      
    } catch (error) {
      logger.error(`Erreur lors du calcul des statistiques des factures: ${error.message}`);
      res.status(500).json({
        status: 'error',
        message: 'Erreur interne du serveur'
      });
    }
  })
];

/**
 * Marque une facture comme envoyée
 * @route POST /api/invoices/:id/send
 * @access Private
 */
const markAsSent = [
  celebrate(getInvoiceByIdSchema),
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      
      // Récupérer la facture
      const invoice = await Invoice.findById(id);
      if (!invoice) {
        return res.status(404).json({
          status: 'error',
          message: 'Facture non trouvée'
        });
      }
      
      // Vérifier les permissions
      if (!checkInvoicePermissions(req.user, invoice.employee)) {
        logger.warn(`Tentative de marquage d'envoi non autorisé sur la facture ${id} par l'utilisateur ${req.user.userId}`);
        return res.status(403).json({
          status: 'error',
          message: 'Accès non autorisé'
        });
      }
      
      // Vérifier si la facture peut être envoyée
      if (invoice.status !== 'draft') {
        return res.status(400).json({
          status: 'error',
          message: 'Seules les factures en brouillon peuvent être envoyées'
        });
      }
      
      // Marquer comme envoyée
      await invoice.markAsSent(req.user.userId);
      
      // Récupérer la facture mise à jour
      const updatedInvoice = await Invoice.findById(id)
        .populate('employee', 'username fullname email')
        .populate('metadata.sentBy', 'username fullname');
      
      logger.log(`Facture ${invoice.invoiceNumber} marquée comme envoyée par ${req.user.username}`);
      
      res.status(200).json({
        status: 'success',
        message: 'Facture marquée comme envoyée',
        data: {
          invoice: updatedInvoice
        }
      });
      
    } catch (error) {
      logger.error(`Erreur lors du marquage d'envoi de la facture ${req.params.id}: ${error.message}`);
      res.status(500).json({
        status: 'error',
        message: 'Erreur interne du serveur'
      });
    }
  })
];

/**
 * Envoie un rappel pour une facture
 * @route POST /api/invoices/:id/reminder
 * @access Private
 */
const sendReminder = [
  celebrate(getInvoiceByIdSchema),
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      
      // Récupérer la facture
      const invoice = await Invoice.findById(id);
      if (!invoice) {
        return res.status(404).json({
          status: 'error',
          message: 'Facture non trouvée'
        });
      }
      
      // Vérifier les permissions
      if (!checkInvoicePermissions(req.user, invoice.employee)) {
        logger.warn(`Tentative d'envoi de rappel non autorisé sur la facture ${id} par l'utilisateur ${req.user.userId}`);
        return res.status(403).json({
          status: 'error',
          message: 'Accès non autorisé'
        });
      }
      
      // Vérifier si un rappel peut être envoyé
      if (invoice.status === 'paid' || invoice.status === 'cancelled') {
        return res.status(400).json({
          status: 'error',
          message: 'Impossible d\'envoyer un rappel pour une facture payée ou annulée'
        });
      }
      
      // Envoyer le rappel
      await invoice.sendReminder();
      
      logger.log(`Rappel envoyé pour la facture ${invoice.invoiceNumber} par ${req.user.username}`);
      
      res.status(200).json({
        status: 'success',
        message: 'Rappel envoyé avec succès',
        data: {
          reminderCount: invoice.metadata.reminderCount
        }
      });
      
    } catch (error) {
      logger.error(`Erreur lors de l'envoi de rappel pour la facture ${req.params.id}: ${error.message}`);
      res.status(500).json({
        status: 'error',
        message: 'Erreur interne du serveur'
      });
    }
  })
];

// ==================== EXPORTS ====================

module.exports = {
  // Validations pour les routes
  validateCreateInvoice: celebrate(createInvoiceSchema),
  validateUpdateInvoice: celebrate(updateInvoiceSchema),
  validateGetInvoices: celebrate(getInvoicesSchema),
  validateGetInvoiceById: celebrate(getInvoiceByIdSchema),
  validateDeleteInvoice: celebrate(deleteInvoiceSchema),
  validateAddPayment: celebrate(addPaymentSchema),
  validateExportInvoices: celebrate(exportInvoicesSchema),
  validateGetInvoiceStats: celebrate(getInvoiceStatsSchema),
  
  // Méthodes du controller
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  addPayment,
  exportInvoices,
  getInvoiceStats,
  markAsSent,
  sendReminder
};