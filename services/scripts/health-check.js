#!/usr/bin/env node

const axios = require('axios');
const logger = require('../../backend/utils/logger');

/**
 * Script de vérification de santé des services
 */
async function healthCheck() {
  const services = [
    { name: 'Auth Service', url: 'http://localhost:3002/health' },
    { name: 'Stock Service', url: 'http://localhost:3003/health' },
    { name: 'Catalog Service', url: 'http://localhost:3004/health' },
    { name: 'Invoice Service', url: 'http://localhost:3005/health' }
  ];

  const results = {
    timestamp: new Date().toISOString(),
    overall: 'healthy',
    services: {},
    summary: {
      total: services.length,
      healthy: 0,
      unhealthy: 0
    }
  };

  console.log('🏥 Vérification de santé des services microservices...\n');

  for (const service of services) {
    try {
      const startTime = Date.now();
      const response = await axios.get(service.url, { 
        timeout: 5000,
        validateStatus: () => true // Accepter tous les status codes
      });
      const responseTime = Date.now() - startTime;

      const isHealthy = response.status === 200 && response.data.status === 'healthy';
      
      results.services[service.name] = {
        status: isHealthy ? 'healthy' : 'unhealthy',
        responseTime: responseTime,
        httpStatus: response.status,
        data: response.data
      };

      if (isHealthy) {
        results.summary.healthy++;
        console.log(`✅ ${service.name}: Healthy (${responseTime}ms)`);
      } else {
        results.summary.unhealthy++;
        results.overall = 'degraded';
        console.log(`❌ ${service.name}: Unhealthy (Status: ${response.status})`);
      }

      // Afficher les statistiques du service si disponibles
      if (response.data.stats) {
        console.log(`   📊 Stats: ${JSON.stringify(response.data.stats)}`);
      }

    } catch (error) {
      results.services[service.name] = {
        status: 'unreachable',
        error: error.message,
        code: error.code
      };
      
      results.summary.unhealthy++;
      results.overall = 'critical';
      
      console.log(`💥 ${service.name}: Unreachable (${error.message})`);
    }
  }

  // Vérifier Redis (Event Bus)
  console.log('\n🔗 Vérification Event Bus (Redis)...');
  try {
    const redis = require('redis');
    const client = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      lazyConnect: true
    });

    await client.connect();
    await client.ping();
    await client.quit();
    
    results.eventBus = { status: 'healthy' };
    console.log('✅ Event Bus (Redis): Healthy');
    
  } catch (error) {
    results.eventBus = { 
      status: 'unhealthy', 
      error: error.message 
    };
    results.overall = 'critical';
    console.log(`❌ Event Bus (Redis): Unhealthy (${error.message})`);
  }

  // Résumé final
  console.log('\n📋 Résumé de santé:');
  console.log(`   🎯 Statut global: ${results.overall.toUpperCase()}`);
  console.log(`   ✅ Services sains: ${results.summary.healthy}/${results.summary.total}`);
  console.log(`   ❌ Services défaillants: ${results.summary.unhealthy}/${results.summary.total}`);

  // Recommandations
  if (results.overall !== 'healthy') {
    console.log('\n🔧 Recommandations:');
    
    for (const [serviceName, serviceData] of Object.entries(results.services)) {
      if (serviceData.status !== 'healthy') {
        if (serviceData.status === 'unreachable') {
          console.log(`   • Redémarrer ${serviceName}`);
        } else {
          console.log(`   • Vérifier les logs de ${serviceName}`);
        }
      }
    }

    if (results.eventBus?.status !== 'healthy') {
      console.log('   • Vérifier la connexion Redis');
      console.log('   • Redémarrer Redis si nécessaire');
    }
  }

  // Format JSON pour scripts
  if (process.argv.includes('--json')) {
    console.log('\n' + JSON.stringify(results, null, 2));
  }

  // Code de sortie
  const exitCode = results.overall === 'healthy' ? 0 : 1;
  process.exit(exitCode);
}

// Options de ligne de commande
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🏥 Health Check - Services Microservices API Pousse

Usage: node health-check.js [options]

Options:
  --json          Afficher le résultat en format JSON
  --help, -h      Afficher cette aide

Codes de sortie:
  0               Tous les services sont sains
  1               Un ou plusieurs services sont défaillants

Services vérifiés:
  • Auth Service (port 3002)
  • Stock Service (port 3003) 
  • Catalog Service (port 3004)
  • Invoice Service (port 3005)
  • Event Bus Redis (port 6379)
  `);
  process.exit(0);
}

// Exécuter si appelé directement
if (require.main === module) {
  healthCheck().catch(error => {
    logger.error('💥 Erreur health check:', error);
    process.exit(1);
  });
}

module.exports = healthCheck;