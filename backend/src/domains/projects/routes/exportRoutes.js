// Routes pour l'export des projets
const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
// const authMiddleware = require('../../../../middlewares/authMiddleware');

// Toutes les routes nécessitent une authentification
// router.use(authMiddleware()); // Désactivé temporairement

// GET /api/projects/exports/pdf/:projectId - Exporter un projet en PDF
router.get('/pdf/:projectId', (req, res) => exportController.exportProjectToPDF(req, res));

// GET /api/projects/exports/excel/:projectId - Exporter un projet en Excel
router.get('/excel/:projectId', (req, res) => exportController.exportProjectToExcel(req, res));

// POST /api/projects/exports/bulk/pdf - Exporter plusieurs projets en PDF (ZIP)
router.post('/bulk/pdf', (req, res) => exportController.exportMultipleProjectsToPDF(req, res));

// POST /api/projects/exports/bulk/excel - Exporter plusieurs projets en Excel
router.post('/bulk/excel', (req, res) => exportController.exportMultipleProjectsToExcel(req, res));

// GET /api/projects/exports/history/:projectId/pdf - Exporter l'historique d'un projet en PDF
router.get('/history/:projectId/pdf', (req, res) => exportController.exportProjectHistoryToPDF(req, res));

// GET /api/projects/exports/template/:templateId/pdf - Exporter un template en PDF
router.get('/template/:templateId/pdf', (req, res) => exportController.exportTemplateToPDF(req, res));

module.exports = router;