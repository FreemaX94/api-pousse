const Livraison = require('../models/livraisonModel');
const logger = require('../../../shared/utils/logger');

// Récupérer toutes les livraisons avec pagination et filtres
exports.getAllLivraisons = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { mois, client, entreprise, fait } = req.query;
    
    // Construire les filtres
    const filters = {};
    if (mois) filters.mois = mois;
    if (client) filters.client = new RegExp(client, 'i');
    if (entreprise) filters.entreprise = new RegExp(entreprise, 'i');
    if (fait !== undefined) filters.fait = fait === 'true';
    
    // Exécuter la requête avec filtres et pagination
    const livraisons = await Livraison.find(filters)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Livraison.countDocuments(filters);
    
    res.json({
      livraisons,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    logger.error('❌ Erreur getAllLivraisons:', error.message);
    next(error);
  }
};

// Récupérer une livraison par ID
exports.getLivraisonById = async (req, res, next) => {
  try {
    const livraison = await Livraison.findById(req.params.id);
    
    if (!livraison) {
      return res.status(404).json({ error: 'Livraison non trouvée' });
    }
    
    res.json(livraison);
  } catch (error) {
    logger.error('❌ Erreur getLivraisonById:', error.message);
    next(error);
  }
};

// Mettre à jour le statut d'une livraison
exports.updateLivraisonStatus = async (req, res, next) => {
  try {
    const { fait } = req.body;
    
    const livraison = await Livraison.findByIdAndUpdate(
      req.params.id,
      { fait },
      { new: true }
    );
    
    if (!livraison) {
      return res.status(404).json({ error: 'Livraison non trouvée' });
    }
    
    logger.info(`Statut livraison mis à jour: ${livraison._id} - ${fait ? 'Terminé' : 'En cours'}`);
    res.json(livraison);
  } catch (error) {
    logger.error('❌ Erreur updateLivraisonStatus:', error.message);
    next(error);
  }
};

// Récupérer les statistiques des livraisons
exports.getStats = async (req, res, next) => {
  try {
    const stats = await Livraison.getStats();
    
    // Statistiques globales
    const globalStats = await Livraison.aggregate([
      {
        $group: {
          _id: null,
          totalLivraisons: { $sum: 1 },
          totalTerminées: { $sum: { $cond: ['$fait', 1, 0] } },
          chiffreAffairesTotal: { $sum: '$prix' },
          moyennePrix: { $avg: '$prix' }
        }
      }
    ]);
    
    res.json({
      parMois: stats,
      global: globalStats[0] || {
        totalLivraisons: 0,
        totalTerminées: 0,
        chiffreAffairesTotal: 0,
        moyennePrix: 0
      }
    });
  } catch (error) {
    logger.error('❌ Erreur getStats:', error.message);
    next(error);
  }
};

// Récupérer les livraisons par mois
exports.getLivraisonsByMonth = async (req, res, next) => {
  try {
    const { mois } = req.params;
    
    const livraisons = await Livraison.findByMonth(mois);
    
    res.json(livraisons);
  } catch (error) {
    logger.error('❌ Erreur getLivraisonsByMonth:', error.message);
    next(error);
  }
};

// Rechercher des livraisons par client
exports.searchByClient = async (req, res, next) => {
  try {
    const { client } = req.params;
    
    const livraisons = await Livraison.findByClient(client);
    
    res.json(livraisons);
  } catch (error) {
    logger.error('❌ Erreur searchByClient:', error.message);
    next(error);
  }
};

// Créer une nouvelle livraison
exports.createLivraison = async (req, res, next) => {
  try {
    const livraison = new Livraison(req.body);
    await livraison.save();
    
    logger.info(`Nouvelle livraison créée: ${livraison._id}`);
    res.status(201).json(livraison);
  } catch (error) {
    logger.error('❌ Erreur createLivraison:', error.message);
    next(error);
  }
};

// Supprimer une livraison
exports.deleteLivraison = async (req, res, next) => {
  try {
    const livraison = await Livraison.findByIdAndDelete(req.params.id);
    
    if (!livraison) {
      return res.status(404).json({ error: 'Livraison non trouvée' });
    }
    
    logger.info(`Livraison supprimée: ${livraison._id}`);
    res.json({ message: 'Livraison supprimée avec succès' });
  } catch (error) {
    logger.error('❌ Erreur deleteLivraison:', error.message);
    next(error);
  }
};