// backend/routes/movementRoutes.js

const express = require('express');
const router = express.Router();

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
router.post('/', createMovement);

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
