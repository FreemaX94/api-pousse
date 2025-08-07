const GoogleDriveSync = require('./googleDriveSync');
const SimpleSheetsSync = require('./simpleSheetsSync');
const uploadController = require('./uploadController');
const logger = require('./utils/logger');

// Instance globale du service de synchronisation
let syncService = null;

// Initialiser le service de synchronisation
const initializeSyncService = async () => {
  if (!syncService) {
    syncService = new GoogleDriveSync();
    const initialized = await syncService.initialize();
    
    if (initialized) {
      // Démarrer la synchronisation périodique (toutes les 15 minutes)
      syncService.startPeriodicSync(15);
      logger.info('🔄 Service de synchronisation Google Drive initialisé');
    } else {
      logger.error('❌ Impossible d\'initialiser le service de synchronisation');
    }
  }
  return syncService;
};

// Endpoint pour déclencher une synchronisation manually
exports.triggerSync = async (req, res, next) => {
  try {
    // Essayer d'abord la synchronisation CSV (plus fiable)
    const csvService = new SimpleSheetsSync();
    await csvService.initialize();
    
    logger.info('🔄 Tentative de synchronisation CSV Google Sheets...');
    const csvResult = await csvService.performSync();
    
    if (csvResult.success) {
      logger.info('✅ Synchronisation CSV réussie');
      return res.json({
        success: true,
        message: csvResult.message,
        count: csvResult.count || 0,
        method: 'csv',
        timestamp: new Date().toISOString()
      });
    }
    
    // Si la synchronisation CSV échoue, essayer les données Excel uploadées
    logger.info('⚠️ Synchronisation CSV échouée, tentative avec données Excel...');
    
    if (req.app.locals.excelData) {
      const excelResult = await uploadController.syncExcelData(req, res);
      return; // La réponse est déjà envoyée par syncExcelData
    }
    
    // En dernier recours, essayer l'API Google Sheets
    logger.info('⚠️ Aucune donnée Excel, tentative API Google Sheets...');
    const service = await initializeSyncService();
    
    if (!service) {
      return res.status(500).json({ 
        success: false,
        error: 'Aucune méthode de synchronisation disponible. Uploadez un fichier Excel ou rendez le Google Drive public.',
        timestamp: new Date().toISOString()
      });
    }

    const result = await service.performSync();
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        count: result.count || 0,
        method: 'api',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        method: 'api',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    logger.error('❌ Erreur triggerSync:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Endpoint pour vérifier le statut de la synchronisation
exports.getSyncStatus = async (req, res, next) => {
  try {
    const service = await initializeSyncService();
    
    if (!service) {
      return res.status(500).json({ 
        error: 'Service de synchronisation non disponible' 
      });
    }

    // Vérifier si le fichier a été modifié
    const isModified = await service.checkFileModification();
    
    res.json({
      success: true,
      status: 'active',
      lastSyncTime: service.lastSyncTime,
      fileModified: isModified,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('❌ Erreur getSyncStatus:', error.message);
    next(error);
  }
};

// Endpoint webhook pour Google Drive (si configuré)
exports.handleGoogleDriveWebhook = async (req, res, next) => {
  try {
    logger.info('🔔 Webhook Google Drive reçu:', req.headers);
    
    // Vérifier les headers de sécurité Google
    const channelId = req.headers['x-goog-channel-id'];
    const channelToken = req.headers['x-goog-channel-token'];
    const resourceState = req.headers['x-goog-resource-state'];
    
    if (resourceState === 'update' || resourceState === 'sync') {
      logger.info('📄 Fichier modifié détecté via webhook');
      
      const service = await initializeSyncService();
      if (service) {
        // Déclencher la synchronisation en arrière-plan
        setTimeout(async () => {
          await service.performSync();
        }, 5000); // Attendre 5 secondes pour laisser le temps à Google de finaliser
      }
    }
    
    // Répondre rapidement à Google
    res.status(200).json({ received: true });
  } catch (error) {
    logger.error('❌ Erreur webhook Google Drive:', error.message);
    res.status(500).json({ error: 'Erreur interne' });
  }
};

// Configurer les paramètres de synchronisation
exports.configureSyncSettings = async (req, res, next) => {
  try {
    const { intervalMinutes, enabled } = req.body;
    
    if (enabled && intervalMinutes) {
      const service = await initializeSyncService();
      if (service) {
        service.startPeriodicSync(intervalMinutes);
        logger.info(`⏰ Synchronisation reconfigurée: ${intervalMinutes} minutes`);
      }
    }
    
    res.json({
      success: true,
      message: 'Configuration mise à jour',
      intervalMinutes,
      enabled
    });
  } catch (error) {
    logger.error('❌ Erreur configureSyncSettings:', error.message);
    next(error);
  }
};

// Initialiser le service au démarrage
initializeSyncService().catch(error => {
  logger.error('❌ Erreur initialisation service sync:', error.message);
});

module.exports = {
  triggerSync: exports.triggerSync,
  getSyncStatus: exports.getSyncStatus,
  handleGoogleDriveWebhook: exports.handleGoogleDriveWebhook,
  configureSyncSettings: exports.configureSyncSettings
};