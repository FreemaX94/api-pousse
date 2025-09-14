// Routes pour les commentaires des projets
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
// const authMiddleware = require('../../../../middlewares/authMiddleware');

// Toutes les routes nécessitent une authentification
// router.use(authMiddleware()); // Désactivé temporairement

// GET /api/projects/comments/:projectId - Obtenir les commentaires d'un projet
router.get('/:projectId', (req, res) => commentController.getProjectComments(req, res));

// POST /api/projects/comments/:projectId - Ajouter un commentaire à un projet
router.post('/:projectId', (req, res) => commentController.addComment(req, res));

// PUT /api/projects/comments/comment/:commentId - Modifier un commentaire
router.put('/comment/:commentId', (req, res) => commentController.updateComment(req, res));

// DELETE /api/projects/comments/comment/:commentId - Supprimer un commentaire
router.delete('/comment/:commentId', (req, res) => commentController.deleteComment(req, res));

// POST /api/projects/comments/comment/:commentId/reply - Répondre à un commentaire
router.post('/comment/:commentId/reply', (req, res) => commentController.replyToComment(req, res));

// GET /api/projects/comments/recent/:userId - Obtenir les commentaires récents d'un utilisateur
router.get('/recent/:userId', (req, res) => commentController.getRecentComments(req, res));

module.exports = router;