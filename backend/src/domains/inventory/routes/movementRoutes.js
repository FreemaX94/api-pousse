// backend/routes/movementRoutes.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { celebrate, Segments, Joi } = require('celebrate');
const router = express.Router();

// Configuration multer pour les images de mouvements
// Utiliser un dossier persistant en dehors de public/ pour éviter la suppression lors des builds
const uploadDir = path.join(__dirname, '../../../../uploads/movements');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Nettoyer complètement le nom : garder seulement lettres, chiffres, tirets et underscores
    const name = path.basename(file.originalname, ext)
      .normalize('NFD') // Décomposer les caractères accentués
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-zA-Z0-9\-_]/g, '_') // Remplacer tout caractère spécial par _
      .replace(/_+/g, '_') // Remplacer les _ multiples par un seul
      .replace(/^_|_$/g, ''); // Supprimer les _ en début/fin
    const timestamp = Date.now();
    cb(null, `movement_${name}_${timestamp}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté. Seules les images JPEG et PNG sont autorisées.'));
  }
};

const upload = multer({ 
  storage, 
  fileFilter, 
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Validation schema pour la création de mouvements
const createMovementSchema = celebrate({
  [Segments.BODY]: Joi.object({
    type: Joi.string().valid('entrée', 'sortie').required(),
    subType: Joi.string().valid('definitive', 'locative').optional(),
    reference: Joi.string().max(100).optional(), // Optionnel pour les entrées externes
    name: Joi.string().max(255).required(),
    quantity: Joi.alternatives().try(
      Joi.number().integer().min(1),
      Joi.string().pattern(/^\d+$/).custom((value) => parseInt(value, 10))
    ).required(),
    price: Joi.alternatives().try(
      Joi.number().min(0),
      Joi.string().pattern(/^\d+\.?\d*$/).custom((value) => parseFloat(value))
    ).optional(),
    project: Joi.string().max(255).allow('').optional(), // Permettre chaîne vide
    note: Joi.string().max(1000).allow('').optional(), // Permettre chaîne vide
    createdBy: Joi.string().max(255).required(),
    concepteur: Joi.string().max(255).allow('').optional(), // Permettre chaîne vide
    coef: Joi.alternatives().try(
      Joi.number().min(1),
      Joi.string().pattern(/^\d+$/).custom((value) => parseInt(value, 10))
    ).optional(),
    isNewPlant: Joi.alternatives().try(
      Joi.boolean(),
      Joi.string().valid('true', 'false').custom((value) => value === 'true')
    ).optional(),
    height: Joi.alternatives().try(
      Joi.number().min(0),
      Joi.string().pattern(/^\d+\.?\d*$/).custom((value) => parseFloat(value))
    ).optional(),
    diameter: Joi.alternatives().try(
      Joi.number().min(0),
      Joi.string().pattern(/^\d+\.?\d*$/).custom((value) => parseFloat(value))
    ).optional(),
    category: Joi.string().max(100).allow('').optional(), // Permettre chaîne vide
    eventDate: Joi.string().isoDate().optional(),
    returnPlannedAt: Joi.string().isoDate().optional()
  }).unknown(true) // Permettre les champs inconnus temporairement pour debug
}, {
  abortEarly: false,
  stripUnknown: false, // Ne pas supprimer pour debug
  allowUnknown: true // Permettre pour debug
});

const {
  createMovement,
  getAllMovements,
  getMovementsByProject,
  validateMovement,
  markAsReturned,
  deleteMovement
} = require('../controllers/movementController');

// GET /api/movements
// Récupère tous les mouvements
router.get('/', getAllMovements);

// GET /api/movements/project/:projectId
// Récupère tous les mouvements liés à un projet spécifique
router.get('/project/:projectId', getMovementsByProject);

// POST /api/movements
// Crée un nouveau mouvement (entrée ou sortie) lié à un projet
router.post('/', upload.single('image'), createMovementSchema, createMovement);

// PUT /api/movements/:id/validate
// Valide un mouvement existant
router.put('/:id/validate', validateMovement);

// PUT /api/movements/:id/return
// Marque une sortie comme retournée
router.put('/:id/return', markAsReturned);

// DELETE /api/movements/:id
// Supprime un mouvement
router.delete('/:id', deleteMovement);

module.exports = router;
