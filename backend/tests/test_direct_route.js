/**
 * Test de la route directe sans Multer
 */

const axios = require('axios');

async function testDirectRoute() {
  try {
    const api = axios.create({
      baseURL: 'http://localhost:3001/api',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Se connecter
    console.log('🔐 Connexion...');
    await api.post('/auth/login', {
      username: 'Freex94',
      password: 'Lolmdr94148!'
    });
    console.log('✅ Connecté');
    
    // Tester la route directe
    console.log('\n🧪 Test route directe /projects/test/test-create');
    
    const response = await api.post('/projects/test/test-create', {
      client: "Client Test Direct",
      description: "Test route sans Multer",
      dateDebut: "2025-08-08",
      dateFin: "2025-08-12",
      statut: "En cours"
    });
    
    console.log('✅ Succès !');
    console.log('Réponse:', response.data);
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testDirectRoute();