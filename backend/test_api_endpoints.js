#!/usr/bin/env node
// backend/test_api_endpoints.js
// Script de test pour vérifier les endpoints API de la page Nieuwkoop

const axios = require('axios');
const colors = require('colors');

// Configuration
const BASE_URL = 'http://localhost:3001';
const TEST_USER = {
  email: 'admin@test.com',
  password: 'password123'
};

let authToken = null;

// Utilitaires
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  switch(type) {
    case 'success':
      console.log(`[${timestamp}] ✅ ${message}`.green);
      break;
    case 'error':
      console.log(`[${timestamp}] ❌ ${message}`.red);
      break;
    case 'warning':
      console.log(`[${timestamp}] ⚠️  ${message}`.yellow);
      break;
    case 'info':
    default:
      console.log(`[${timestamp}] ℹ️  ${message}`.blue);
      break;
  }
}

function logSeparator() {
  console.log('═'.repeat(80).cyan);
}

// Test d'authentification
async function authenticate() {
  try {
    log('Tentative d\'authentification...', 'info');
    
    const response = await axios.post(`${BASE_URL}/api/auth/login`, TEST_USER, {
      timeout: 5000
    });
    
    if (response.data && response.data.token) {
      authToken = response.data.token;
      log('Authentification réussie', 'success');
      return true;
    } else {
      log('Aucun token reçu dans la réponse d\'authentification', 'error');
      return false;
    }
  } catch (error) {
    log(`Erreur d'authentification: ${error.message}`, 'error');
    if (error.response) {
      log(`Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`, 'error');
    }
    return false;
  }
}

// Créer les headers avec authentification
function getAuthHeaders() {
  return {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };
}

// Tests des endpoints
async function testEndpoint(method, endpoint, data = null, requiresAuth = true) {
  try {
    const config = {
      method: method.toLowerCase(),
      url: `${BASE_URL}${endpoint}`,
      timeout: 10000
    };
    
    if (requiresAuth && authToken) {
      config.headers = getAuthHeaders();
    }
    
    if (data && (method === 'POST' || method === 'PUT')) {
      config.data = data;
    }
    
    log(`Test ${method} ${endpoint}...`, 'info');
    
    const response = await axios(config);
    
    log(`✅ ${method} ${endpoint} - Status: ${response.status}`, 'success');
    
    // Afficher un aperçu des données
    if (response.data) {
      if (Array.isArray(response.data)) {
        log(`   Données: Array de ${response.data.length} éléments`, 'info');
        if (response.data.length > 0) {
          log(`   Premier élément: ${JSON.stringify(response.data[0]).substring(0, 100)}...`, 'info');
        }
      } else if (typeof response.data === 'object') {
        const keys = Object.keys(response.data);
        log(`   Données: Object avec ${keys.length} propriétés [${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}]`, 'info');
      } else {
        log(`   Données: ${JSON.stringify(response.data).substring(0, 100)}`, 'info');
      }
    }
    
    return { success: true, status: response.status, data: response.data };
    
  } catch (error) {
    log(`❌ ${method} ${endpoint} - Erreur: ${error.message}`, 'error');
    
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'error');
      log(`   Data: ${JSON.stringify(error.response.data)}`, 'error');
    } else if (error.code === 'ECONNREFUSED') {
      log('   Le serveur backend n\'est pas accessible. Vérifiez qu\'il fonctionne sur le port 3001.', 'error');
    }
    
    return { success: false, error: error.message, status: error.response?.status };
  }
}

// Test de création d'un mouvement
async function testCreateMovement() {
  const movementData = {
    type: 'entry',
    projectId: '507f1f77bcf86cd799439011', // ID de test
    items: [
      {
        productId: 'TEST001',
        name: 'Produit Test',
        quantity: 10,
        unit: 'pieces'
      }
    ],
    description: 'Test de création de mouvement',
    date: new Date().toISOString()
  };
  
  return await testEndpoint('POST', '/api/movements', movementData);
}

// Test de suppression d'un mouvement
async function testDeleteMovement(movementId) {
  if (!movementId) {
    log('Aucun ID de mouvement fourni pour le test de suppression', 'warning');
    return { success: false, error: 'No movement ID' };
  }
  
  return await testEndpoint('DELETE', `/api/movements/${movementId}`);
}

// Fonction principale
async function runTests() {
  console.clear();
  logSeparator();
  log('🚀 DÉBUT DES TESTS API - PAGE NIEUWKOOP', 'info');
  logSeparator();
  
  // Vérifier si le serveur est accessible
  try {
    await axios.get(`${BASE_URL}/test-route`, { timeout: 5000 });
    log('Serveur backend accessible', 'success');
  } catch (error) {
    log('Serveur backend non accessible. Démarrez le serveur avec "npm run dev"', 'error');
    process.exit(1);
  }
  
  // Tentative d'authentification
  const authSuccess = await authenticate();
  if (!authSuccess) {
    log('Impossible de s\'authentifier. Les tests protégés seront ignorés.', 'warning');
  }
  
  logSeparator();
  log('📋 TESTS DES ENDPOINTS', 'info');
  logSeparator();
  
  const testResults = [];
  
  // 1. GET /api/movements - Récupérer tous les mouvements
  const movementsTest = await testEndpoint('GET', '/api/movements');
  testResults.push({ name: 'GET /api/movements', ...movementsTest });
  
  // 2. GET /api/concepteurs - Récupérer les concepteurs
  const concepteursTest = await testEndpoint('GET', '/api/concepteurs');
  testResults.push({ name: 'GET /api/concepteurs', ...concepteursTest });
  
  // 3. GET /api/projets - Récupérer les projets
  const projetsTest = await testEndpoint('GET', '/api/projets');
  testResults.push({ name: 'GET /api/projets', ...projetsTest });
  
  // 4. GET /api/nieuwkoop/stock - Récupérer le stock Nieuwkoop
  const nieuwkoopStockTest = await testEndpoint('GET', '/api/nieuwkoop/stock');
  testResults.push({ name: 'GET /api/nieuwkoop/stock', ...nieuwkoopStockTest });
  
  // 5. POST /api/movements - Créer un mouvement (test de structure)
  const createMovementTest = await testCreateMovement();
  testResults.push({ name: 'POST /api/movements', ...createMovementTest });
  
  // 6. DELETE /api/movements/:id - Supprimer un mouvement
  // On utilise l'ID du mouvement créé si possible
  let movementId = null;
  if (createMovementTest.success && createMovementTest.data && createMovementTest.data.id) {
    movementId = createMovementTest.data.id;
  } else if (createMovementTest.success && createMovementTest.data && createMovementTest.data._id) {
    movementId = createMovementTest.data._id;
  }
  
  const deleteMovementTest = await testDeleteMovement(movementId);
  testResults.push({ name: 'DELETE /api/movements/:id', ...deleteMovementTest });
  
  // Tests supplémentaires pour debug
  logSeparator();
  log('🔍 TESTS SUPPLÉMENTAIRES', 'info');
  logSeparator();
  
  // Test de santé de l'application
  const healthTest = await testEndpoint('GET', '/api/health', null, false);
  testResults.push({ name: 'GET /api/health', ...healthTest });
  
  // Test de l'architecture
  const archTest = await testEndpoint('GET', '/debug/architecture', null, false);
  testResults.push({ name: 'GET /debug/architecture', ...archTest });
  
  // Résumé des résultats
  logSeparator();
  log('📊 RÉSUMÉ DES TESTS', 'info');
  logSeparator();
  
  const successCount = testResults.filter(t => t.success).length;
  const totalCount = testResults.length;
  
  testResults.forEach(result => {
    const status = result.success ? '✅ SUCCÈS' : '❌ ÉCHEC';
    const statusCode = result.status ? ` (${result.status})` : '';
    log(`${status}${statusCode} - ${result.name}`, result.success ? 'success' : 'error');
  });
  
  logSeparator();
  log(`RÉSULTAT FINAL: ${successCount}/${totalCount} tests réussis`, 
      successCount === totalCount ? 'success' : 'warning');
  
  if (successCount < totalCount) {
    log('Certains tests ont échoué. Vérifiez les logs ci-dessus pour plus de détails.', 'warning');
  }
  
  logSeparator();
  log('🏁 FIN DES TESTS', 'info');
  logSeparator();
}

// Gestion des erreurs non catchées
process.on('uncaughtException', (error) => {
  log(`Erreur non catchée: ${error.message}`, 'error');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Promesse rejetée: ${reason}`, 'error');
  process.exit(1);
});

// Exécuter les tests
if (require.main === module) {
  runTests().catch(error => {
    log(`Erreur lors de l'exécution des tests: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = { runTests, testEndpoint, authenticate };