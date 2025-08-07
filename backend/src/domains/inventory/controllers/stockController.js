const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const StockEntry = require('../models/StockEntry');
const CatalogueItem = require('../../catalog/models/CatalogueItem');
const { celebrate, Joi, Segments } = require('celebrate');
const logger = require('../../../shared/utils/logger');

// Schémas de validation
const getCategorySchema = {
  [Segments.QUERY]: Joi.object({
    categorie: Joi.string().required(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
};

const getStockByIdSchema = {
  [Segments.PARAMS]: Joi.object({
    stockId: Joi.string().required()
  })
};

const createStockSchema = {
  [Segments.BODY]: Joi.object({
    product: Joi.string().hex().length(24).required(),
    categorie: Joi.string().required(),
    quantity: Joi.number().integer().min(0).required(),
    type: Joi.string().valid('entree', 'sortie').required(),
    notes: Joi.string().max(500).allow(''),
    location: Joi.string().max(100).allow('')
  })
};

const updateStockSchema = {
  [Segments.PARAMS]: Joi.object({
    stockId: Joi.string().required()
  }),
  [Segments.BODY]: Joi.object({
    product: Joi.string().hex().length(24),
    categorie: Joi.string(),
    quantity: Joi.number().integer().min(0),
    type: Joi.string().valid('entree', 'sortie'),
    notes: Joi.string().max(500).allow(''),
    location: Joi.string().max(100).allow('')
  }).min(1)
};

const deleteStockSchema = {
  [Segments.PARAMS]: Joi.object({
    stockId: Joi.string().required()
  })
};

const exportSchema = {
  [Segments.QUERY]: Joi.object({
    format: Joi.string().valid('csv', 'pdf').default('csv'),
    categorie: Joi.string(),
    dateFrom: Joi.date().iso(),
    dateTo: Joi.date().iso().min(Joi.ref('dateFrom'))
  })
};

/**
 * Récupération des stocks par catégorie avec pagination
 * GET /api/stocks/category?categorie=nom&page=1&limit=20
 */
const getStockByCategory = [celebrate(getCategorySchema), async (req, res, next) => {
  try {
    const { categorie, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const query = { categorie };
    
    const [entries, total] = await Promise.all([
      StockEntry.find(query)
        .populate('product', 'nom categorie infos')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      StockEntry.countDocuments(query)
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    logger.info(`Récupération des stocks pour la catégorie: ${categorie} (page ${page})`);
    
    res.status(200).json({
      entries,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    logger.error(`Erreur lors de la récupération des stocks par catégorie: ${err.message}`);
    next(err);
  }
}];

/**
 * Récupération d'un stock par son ID unique
 * GET /api/stocks/:stockId
 */
const getStockById = [celebrate(getStockByIdSchema), async (req, res, next) => {
  try {
    const { stockId } = req.params;
    const entry = await StockEntry.findOne({ stockId })
      .populate('product', 'nom categorie infos prix')
      .populate('createdBy', 'username fullname');
    
    if (!entry) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }
    
    logger.info(`Récupération du stock ID: ${stockId}`);
    
    res.status(200).json({
      entry,
      message: 'Stock récupéré avec succès'
    });
  } catch (err) {
    logger.error(`Erreur lors de la récupération du stock ${req.params.stockId}: ${err.message}`);
    next(err);
  }
}];

/**
 * Création d'une nouvelle entrée de stock
 * POST /api/stocks
 */
const createStockEntry = [celebrate(createStockSchema), async (req, res, next) => {
  try {
    const { product, categorie, quantity, type, notes, location } = req.body;
    
    // Vérifier que le produit existe
    const productExists = await CatalogueItem.findById(product);
    if (!productExists) {
      return res.status(400).json({ error: 'Produit non trouvé' });
    }
    
    const newEntry = new StockEntry({
      product,
      categorie,
      quantity,
      type,
      notes,
      location,
      createdBy: req.user?.userId
    });
    
    const savedEntry = await newEntry.save();
    const populatedEntry = await StockEntry.findById(savedEntry._id)
      .populate('product', 'nom categorie infos')
      .populate('createdBy', 'username fullname');
    
    logger.info(`Nouvelle entrée de stock créée: ${populatedEntry.stockId} par ${req.user?.username}`);
    
    res.status(201).json({
      message: 'Entrée de stock créée avec succès',
      stockId: populatedEntry.stockId,
      entry: populatedEntry
    });
  } catch (err) {
    logger.error(`Erreur lors de la création de l'entrée de stock: ${err.message}`);
    next(err);
  }
}];

/**
 * Mise à jour d'une entrée de stock
 * PUT /api/stocks/:stockId
 */
const updateStockEntry = [celebrate(updateStockSchema), async (req, res, next) => {
  try {
    const { stockId } = req.params;
    const updates = req.body;
    
    // Vérifier que le produit existe si il est dans les mises à jour
    if (updates.product) {
      const productExists = await CatalogueItem.findById(updates.product);
      if (!productExists) {
        return res.status(400).json({ error: 'Produit non trouvé' });
      }
    }
    
    // Ajouter les informations de modification
    updates.updatedBy = req.user?.userId;
    updates.updatedAt = new Date();
    
    const updatedEntry = await StockEntry.findOneAndUpdate(
      { stockId },
      updates,
      { new: true, runValidators: true }
    )
      .populate('product', 'nom categorie infos')
      .populate('createdBy', 'username fullname')
      .populate('updatedBy', 'username fullname');
    
    if (!updatedEntry) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }
    
    logger.info(`Entrée de stock mise à jour: ${stockId} par ${req.user?.username}`);
    
    res.status(200).json({
      message: 'Entrée de stock mise à jour avec succès',
      entry: updatedEntry
    });
  } catch (err) {
    logger.error(`Erreur lors de la mise à jour du stock ${req.params.stockId}: ${err.message}`);
    next(err);
  }
}];

/**
 * Suppression d'une entrée de stock
 * DELETE /api/stocks/:stockId
 */
const deleteStockEntry = [celebrate(deleteStockSchema), async (req, res, next) => {
  try {
    const { stockId } = req.params;
    
    // Vérifier que l'entrée existe avant suppression
    const entry = await StockEntry.findOne({ stockId });
    if (!entry) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }
    
    // Soft delete : marquer comme supprimé plutot que supprimer réellement
    const deletedEntry = await StockEntry.findOneAndUpdate(
      { stockId },
      { 
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: req.user?.userId
      },
      { new: true }
    );
    
    logger.info(`Entrée de stock supprimée: ${stockId} par ${req.user?.username}`);
    
    res.status(200).json({
      message: 'Entrée de stock supprimée avec succès',
      stockId: deletedEntry.stockId
    });
  } catch (err) {
    logger.error(`Erreur lors de la suppression du stock ${req.params.stockId}: ${err.message}`);
    next(err);
  }
}];

/**
 * Export des stocks en CSV ou PDF
 * GET /api/stocks/export?format=csv&categorie=nom&dateFrom=2023-01-01&dateTo=2023-12-31
 */
const exportStocks = [celebrate(exportSchema), async (req, res, next) => {
  try {
    const { format = 'csv', categorie, dateFrom, dateTo } = req.query;
    
    // Construire la requête de filtrage
    const query = { isDeleted: { $ne: true } };
    
    if (categorie) {
      query.categorie = categorie;
    }
    
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }
    
    const entries = await StockEntry.find(query)
      .populate('product', 'nom categorie infos prix')
      .populate('createdBy', 'username fullname')
      .sort({ createdAt: -1 });
    
    if (entries.length === 0) {
      return res.status(404).json({ error: 'Aucun stock trouvé pour les critères spécifiés' });
    }
    
    logger.info(`Export de ${entries.length} stocks en format ${format}`);

    if (format === 'csv') {
      const fields = [
        { label: 'ID Stock', value: 'stockId' },
        { label: 'Catégorie', value: 'categorie' },
        { label: 'Nom Produit', value: 'product.nom' },
        { label: 'Catégorie Produit', value: 'product.categorie' },
        { label: 'Quantité', value: 'quantity' },
        { label: 'Type', value: 'type' },
        { label: 'Localisation', value: 'location' },
        { label: 'Notes', value: 'notes' },
        { label: 'Créé par', value: 'createdBy.fullname' },
        { label: 'Date création', value: 'createdAt' },
        { label: 'Dimensions', value: 'product.infos.DIMENSIONS' },
        { label: 'Quantité totale', value: 'product.infos.Quantité totale' }
      ];
      
      const parser = new Parser({ fields });
      const csv = parser.parse(entries);
      
      res.header('Content-Type', 'text/csv; charset=utf-8');
      res.attachment(`stocks_${new Date().toISOString().split('T')[0]}.csv`);
      return res.send('\uFEFF' + csv); // BOM pour l'UTF-8
    }

    if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 50 });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=stocks_${new Date().toISOString().split('T')[0]}.pdf`);
      doc.pipe(res);

      // En-tête
      doc.fontSize(20).text('Liste des Stocks', { align: 'center' });
      doc.fontSize(12).text(`Export généré le: ${new Date().toLocaleString('fr-FR')}`, { align: 'center' });
      doc.text(`Nombre d'entrées: ${entries.length}`, { align: 'center' });
      doc.moveDown(2);

      entries.forEach((entry, index) => {
        if (index > 0 && index % 10 === 0) {
          doc.addPage();
        }
        
        doc.fontSize(14).text(`Stock #${entry.stockId || '-'}`, { underline: true });
        doc.fontSize(10)
          .text(`Nom: ${entry.product?.nom || 'N/A'}`, { indent: 20 })
          .text(`Catégorie: ${entry.categorie || 'N/A'}`, { indent: 20 })
          .text(`Quantité: ${entry.quantity || 'N/A'}`, { indent: 20 })
          .text(`Type: ${entry.type || 'N/A'}`, { indent: 20 })
          .text(`Localisation: ${entry.location || 'N/A'}`, { indent: 20 })
          .text(`Créé par: ${entry.createdBy?.fullname || 'N/A'}`, { indent: 20 })
          .text(`Date: ${entry.createdAt ? new Date(entry.createdAt).toLocaleDateString('fr-FR') : 'N/A'}`, { indent: 20 });
        
        if (entry.notes) {
          doc.text(`Notes: ${entry.notes}`, { indent: 20 });
        }
        
        doc.moveDown();
      });

      doc.end();
    }
  } catch (err) {
    logger.error(`Erreur lors de l'export des stocks: ${err.message}`);
    next(err);
  }
}];

/**
 * Obtenir les statistiques des stocks
 * GET /api/stocks/stats
 */
const getStockStats = async (req, res, next) => {
  try {
    const stats = await StockEntry.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: '$categorie',
          totalQuantity: { $sum: '$quantity' },
          totalEntries: { $sum: 1 },
          entreeCount: {
            $sum: {
              $cond: [{ $eq: ['$type', 'entree'] }, 1, 0]
            }
          },
          sortieCount: {
            $sum: {
              $cond: [{ $eq: ['$type', 'sortie'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { totalQuantity: -1 } }
    ]);
    
    const totalStats = await StockEntry.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$quantity' },
          totalEntries: { $sum: 1 },
          totalEntrees: {
            $sum: {
              $cond: [{ $eq: ['$type', 'entree'] }, 1, 0]
            }
          },
          totalSorties: {
            $sum: {
              $cond: [{ $eq: ['$type', 'sortie'] }, 1, 0]
            }
          }
        }
      }
    ]);
    
    res.status(200).json({
      categorieStats: stats,
      globalStats: totalStats[0] || {
        totalQuantity: 0,
        totalEntries: 0,
        totalEntrees: 0,
        totalSorties: 0
      }
    });
  } catch (err) {
    logger.error(`Erreur lors du calcul des statistiques: ${err.message}`);
    next(err);
  }
};

module.exports = { 
  getStockByCategory, 
  getStockById,
  createStockEntry,
  updateStockEntry,
  deleteStockEntry,
  exportStocks,
  getStockStats
};
