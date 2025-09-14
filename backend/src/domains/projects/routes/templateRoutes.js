// Routes pour les templates de projets
const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
// const authMiddleware = require('../../../../middlewares/authMiddleware');

// Toutes les routes nécessitent une authentification
// router.use(authMiddleware()); // Désactivé temporairement

// GET /api/projects/templates - Lister tous les templates
router.get('/', (req, res) => templateController.getAllTemplates(req, res));

// GET /api/projects/templates/popular - Obtenir les templates populaires
router.get('/popular', (req, res) => templateController.getPopularTemplates(req, res));

// GET /api/projects/templates/stats - Obtenir les statistiques
router.get('/stats', (req, res) => templateController.getTemplateStats(req, res));

// GET /api/projects/templates/category/:category - Obtenir les templates par catégorie
router.get('/category/:category', (req, res) => templateController.getTemplatesByCategory(req, res));

// GET /api/projects/templates/:templateId - Obtenir un template spécifique
router.get('/:templateId', (req, res) => templateController.getTemplateById(req, res));

// POST /api/projects/templates - Créer un nouveau template
router.post('/', (req, res) => templateController.createTemplate(req, res));

// POST /api/projects/templates/:templateId/use - Utiliser un template pour créer un projet
router.post('/:templateId/use', (req, res) => templateController.createProjectFromTemplate(req, res));

// POST /api/projects/templates/:templateId/duplicate - Dupliquer un template
router.post('/:templateId/duplicate', (req, res) => templateController.duplicateTemplate(req, res));

// PUT /api/projects/templates/:templateId - Modifier un template
router.put('/:templateId', (req, res) => templateController.updateTemplate(req, res));

// DELETE /api/projects/templates/:templateId - Supprimer un template
router.delete('/:templateId', (req, res) => templateController.deleteTemplate(req, res));

module.exports = router;