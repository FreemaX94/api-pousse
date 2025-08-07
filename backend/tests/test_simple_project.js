/**
 * Test simplifié pour créer un projet via l'API
 */

const axios = require('axios');

async function testSimpleProject() {
  try {
    console.log('🔐 Connexion...');
    
    // Créer une instance avec cookies
    const api = axios.create({
      baseURL: 'http://localhost:3001/api',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Se connecter
    const loginResponse = await api.post('/auth/login', {
      username: 'Freex94',
      password: 'Lolmdr94148!'
    });
    
    console.log('✅ Connecté:', loginResponse.data.user.fullname);
    
    // Créer un projet simple SANS FormData, juste du JSON
    console.log('\n📝 Création d\'un projet simple...');
    
    const projectData = {
      client: "Test Client Simple",
      description: "Test sans fichiers ni articles",
      dateDebut: "2025-08-08",
      dateFin: "2025-08-12",
      statut: "En cours"
    };
    
    console.log('📤 Envoi des données:', projectData);
    
    try {
      const projectResponse = await api.post('/projets', projectData);
      console.log('✅ Projet créé !');
      console.log('ID:', projectResponse.data._id);
      console.log('Détails:', projectResponse.data);
    } catch (error) {
      console.error('❌ Erreur création projet:');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        console.error('Headers:', error.response.headers);
      } else {
        console.error(error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testSimpleProject();