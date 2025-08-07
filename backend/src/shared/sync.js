const express = require('express');
const router = express.Router();
const { celebrate, Joi, Segments } = require('celebrate');
const syncController = require('./syncController');
const uploadController = require('./uploadController');
const { authMiddleware } = require('./middleware/authMiddleware');

// Schéma de validation pour la configuration
const configSchema = {
  [Segments.BODY]: Joi.object({
    intervalMinutes: Joi.number().min(5).max(1440).required(),
    enabled: Joi.boolean().required()
  })
};

// Routes protégées par authentification
router.use(authMiddleware());

// GET /api/sync/status - Obtenir le statut de la synchronisation
router.get('/status', syncController.getSyncStatus);

// POST /api/sync/trigger - Déclencher une synchronisation manuelle
router.post('/trigger', syncController.triggerSync);

// POST /api/sync/configure - Configurer les paramètres de synchronisation
router.post('/configure', celebrate(configSchema), syncController.configureSyncSettings);

// POST /api/sync/upload - Upload d'un fichier Excel
router.post('/upload', uploadController.uploadMiddleware, uploadController.uploadExcelFile);

// POST /api/sync/sync-excel - Synchroniser les données Excel uploadées
router.post('/sync-excel', uploadController.syncExcelData);

// POST /api/sync/webhook - Webhook pour Google Drive (pas d'auth pour les webhooks)
router.post('/webhook', (req, res, next) => {
  // Bypass auth pour les webhooks Google
  syncController.handleGoogleDriveWebhook(req, res, next);
});

module.exports = router;