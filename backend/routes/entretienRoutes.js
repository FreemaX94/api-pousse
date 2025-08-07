// backend/routes/entretienRoutes.js
const express = require('express');
const { body, param } = require('express-validator');
const { authMiddleware } = require('../middlewares/authMiddleware');
const entretienController = require('../controllers/entretienController');

const router = express.Router();

// Middleware d'authentification pour toutes les routes
router.use(authMiddleware());

// Validation pour la création/mise à jour d'un entretien
const entretienValidation = [
  body('client.nom')
    .notEmpty()
    .withMessage('Le nom du client est requis')
    .isLength({ max: 200 })
    .withMessage('Le nom ne peut dépasser 200 caractères'),
  
  body('client.typeClient')
    .isIn(['Professionnel', 'Particulier'])
    .withMessage('Type de client invalide'),
  
  body('typeContrat')
    .isIn(['Entretien', 'Abonnement', 'Ponctuel'])
    .withMessage('Type de contrat invalide'),
  
  body('planification.dateDebut')
    .isISO8601()
    .withMessage('Date de début invalide'),
  
  body('planification.dateFin')
    .isISO8601()
    .withMessage('Date de fin invalide')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.planification.dateDebut)) {
        throw new Error('La date de fin doit être après la date de début');
      }
      return true;
    }),
  
  body('client.email')
    .optional()
    .isEmail()
    .withMessage('Email invalide'),
  
  body('client.telephone')
    .optional()
    .matches(/^(?:\+33|0)[1-9](?:[.-]?\d{2}){4}$/)
    .withMessage('Numéro de téléphone invalide'),
  
  body('tarification.budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le budget doit être positif'),
  
  body('priorite')
    .optional()
    .isIn(['basse', 'normale', 'haute', 'urgente'])
    .withMessage('Priorité invalide')
];

// Validation pour les paramètres ID
const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID invalide')
];

// Routes principales CRUD
router.get('/', entretienController.getAll);
router.get('/statistiques', entretienController.getStatistiques);
router.get('/planifies', entretienController.getPlanifies);
router.get('/en-cours', entretienController.getEnCours);
router.get('/en-retard', entretienController.getEnRetard);
router.get('/client/:clientNom', entretienController.getParClient);
router.get('/:id', idValidation, entretienController.getById);

router.post('/', entretienValidation, entretienController.create);
router.put('/:id', [...idValidation, ...entretienValidation], entretienController.update);
router.delete('/:id', idValidation, entretienController.delete);

// Actions spécifiques sur un entretien
router.patch('/:id/demarrer', idValidation, entretienController.demarrer);
router.patch('/:id/terminer', [
  ...idValidation,
  body('compteRendu')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Le compte-rendu ne peut dépasser 5000 caractères')
], entretienController.terminer);

router.patch('/:id/reporter', [
  ...idValidation,
  body('nouvelleDate')
    .isISO8601()
    .withMessage('Nouvelle date invalide'),
  body('raison')
    .notEmpty()
    .withMessage('La raison du report est requise')
    .isLength({ max: 500 })
    .withMessage('La raison ne peut dépasser 500 caractères')
], entretienController.reporter);

router.patch('/:id/annuler', [
  ...idValidation,
  body('raison')
    .notEmpty()
    .withMessage('La raison d\'annulation est requise')
    .isLength({ max: 500 })
    .withMessage('La raison ne peut dépasser 500 caractères')
], entretienController.annuler);

// Gestion des problèmes
router.post('/:id/problemes', [
  ...idValidation,
  body('description')
    .notEmpty()
    .withMessage('La description du problème est requise')
    .isLength({ max: 1000 })
    .withMessage('La description ne peut dépasser 1000 caractères'),
  body('gravite')
    .optional()
    .isIn(['mineure', 'modere', 'majeure', 'critique'])
    .withMessage('Gravité invalide')
], entretienController.ajouterProbleme);

router.patch('/:id/problemes/:problemeId/resoudre', [
  ...idValidation,
  param('problemeId')
    .isMongoId()
    .withMessage('ID de problème invalide'),
  body('solution')
    .notEmpty()
    .withMessage('La solution est requise')
    .isLength({ max: 1000 })
    .withMessage('La solution ne peut dépasser 1000 caractères')
], entretienController.resoudreProbleme);

// Rapports et documents
router.post('/:id/rapport', idValidation, entretienController.genererRapport);

// Commentaires
router.post('/:id/commentaires', [
  ...idValidation,
  body('message')
    .notEmpty()
    .withMessage('Le message est requis')
    .isLength({ max: 1000 })
    .withMessage('Le message ne peut dépasser 1000 caractères'),
  body('type')
    .optional()
    .isIn(['interne', 'client', 'technique'])
    .withMessage('Type de commentaire invalide')
], entretienController.ajouterCommentaire);

module.exports = router;
