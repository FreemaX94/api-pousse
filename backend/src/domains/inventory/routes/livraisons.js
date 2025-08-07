const express = require('express');
const router = express.Router();
const { celebrate, Joi, Segments } = require('celebrate');
const livraisonController = require('../controllers/livraisonController');
const { authMiddleware } = require('../../../shared/middleware/authMiddleware');

// Schémas de validation
const updateStatusSchema = {
  [Segments.BODY]: Joi.object({
    fait: Joi.boolean().required()
  })
};

const createLivraisonSchema = {
  [Segments.BODY]: Joi.object({
    date: Joi.date().required(),
    mois: Joi.string().valid('janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre').required(),
    horaire: Joi.string().allow(''),
    demandeur: Joi.string().allow(''),
    codeActivite: Joi.string().allow(''),
    nbColis: Joi.number().min(0).default(0),
    referenceDevis: Joi.string().allow(''),
    client: Joi.string().allow(''),
    entreprise: Joi.string().allow(''),
    adresse: Joi.string().allow(''),
    accesLivraison: Joi.string().allow(''),
    infos: Joi.string().allow(''),
    telephone: Joi.string().allow(''),
    clientPrevenu: Joi.string().allow(''),
    prix: Joi.number().min(0).default(0),
    fait: Joi.boolean().default(false)
  })
};

// Middleware d'authentification pour toutes les routes
router.use(authMiddleware());

// Routes
router.get('/', livraisonController.getAllLivraisons);
router.get('/stats', livraisonController.getStats);
router.get('/mois/:mois', livraisonController.getLivraisonsByMonth);
router.get('/client/:client', livraisonController.searchByClient);
router.get('/:id', livraisonController.getLivraisonById);

router.post('/', celebrate(createLivraisonSchema), livraisonController.createLivraison);
router.put('/:id/status', celebrate(updateStatusSchema), livraisonController.updateLivraisonStatus);
router.delete('/:id', livraisonController.deleteLivraison);

module.exports = router;
