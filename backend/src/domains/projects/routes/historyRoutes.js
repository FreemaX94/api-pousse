// Routes pour l'historique des projets
const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
// const authMiddleware = require('../../../../middlewares/authMiddleware');

// Toutes les routes nécessitent une authentification
// router.use(authMiddleware()); // Désactivé temporairement

// GET /api/projects/history/:projectId - Obtenir l'historique d'un projet
router.get('/:projectId', (req, res) => historyController.getProjectHistory(req, res));

// GET /api/projects/history/:projectId/stats - Statistiques d'historique
router.get('/:projectId/stats', (req, res) => historyController.getHistoryStats(req, res));

// GET /api/projects/history/:projectId/search - Rechercher dans l'historique
router.get('/:projectId/search', (req, res) => historyController.searchHistory(req, res));

// GET /api/projects/history/user/:userId/undoable - Actions annulables par un utilisateur
router.get('/user/:userId/undoable', (req, res) => historyController.getUndoableActions(req, res));

// GET /api/projects/history/user/:userId/redoable - Actions refaisables par un utilisateur
router.get('/user/:userId/redoable', (req, res) => historyController.getRedoableActions(req, res));

// POST /api/projects/history/:projectId/record - Enregistrer un changement
router.post('/:projectId/record', (req, res) => historyController.recordChange(req, res));

// POST /api/projects/history/batch/:projectId - Enregistrer des changements en lot
router.post('/batch/:projectId', (req, res) => historyController.recordBatchChanges(req, res));

// PUT /api/projects/history/:historyId/undo - Annuler une action
router.put('/:historyId/undo', (req, res) => historyController.undoAction(req, res));

// PUT /api/projects/history/:historyId/redo - Refaire une action
router.put('/:historyId/redo', (req, res) => historyController.redoAction(req, res));

// DELETE /api/projects/history/cleanup - Nettoyer l'historique expiré
router.delete('/cleanup', (req, res) => historyController.cleanupExpiredHistory(req, res));

module.exports = router;