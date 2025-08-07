#!/usr/bin/env node

const ServiceOrchestrator = require('../shared/orchestrator');
const logger = require('../../backend/utils/logger');

/**
 * Script de démarrage de tous les services microservices
 */
async function startAllServices() {
  const orchestrator = new ServiceOrchestrator();

  // Gérer l'arrêt gracieux
  process.on('SIGTERM', async () => {
    logger.info('🛑 Signal SIGTERM reçu, arrêt gracieux...');
    await orchestrator.shutdown();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.info('🛑 Signal SIGINT reçu, arrêt gracieux...');
    await orchestrator.shutdown();
    process.exit(0);
  });

  process.on('uncaughtException', async (error) => {
    logger.error('💥 Exception non capturée:', error);
    await orchestrator.shutdown();
    process.exit(1);
  });

  process.on('unhandledRejection', async (reason, promise) => {
    logger.error('💥 Promesse rejetée non gérée:', reason);
    await orchestrator.shutdown();
    process.exit(1);
  });

  try {
    // Démarrer tous les services
    await orchestrator.initialize();
    
    logger.info('🚀 Tous les services microservices sont opérationnels !');
    logger.info('📊 Services disponibles:');
    logger.info('  - Auth Service: http://localhost:3002');
    logger.info('  - Stock Service: http://localhost:3003');
    logger.info('  - Catalog Service: http://localhost:3004');
    logger.info('  - Invoice Service: http://localhost:3005');
    logger.info('💾 Event Bus Redis: localhost:6379');
    
    // Afficher le statut de démarrage
    const status = orchestrator.getServicesStatus();
    logger.info('📈 Statut système:', JSON.stringify(status, null, 2));

  } catch (error) {
    logger.error('💥 Erreur fatale au démarrage:', error);
    process.exit(1);
  }
}

// Démarrer si appelé directement
if (require.main === module) {
  startAllServices().catch(error => {
    logger.error('💥 Erreur démarrage:', error);
    process.exit(1);
  });
}

module.exports = startAllServices;