const GoogleSheetsSync = require('../services/googleDriveSync');
const mongoose = require('mongoose');
const logger = require('../utils/logger');
require('dotenv').config();

async function testSync() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apiPousse');
    console.log('✅ Connecté à MongoDB');

    // Créer une instance du service de sync
    const syncService = new GoogleSheetsSync();
    
    // Initialiser le service
    const initialized = await syncService.initialize();
    if (!initialized) {
      console.log('❌ Impossible d\'initialiser le service de synchronisation');
      return;
    }

    // Test de récupération des données depuis Google Sheets
    console.log('\n🔄 Test de récupération des données...');
    const sheetsData = await syncService.fetchSheetsData();
    
    console.log(`📊 Données récupérées:`);
    console.log(`  - Juin: ${sheetsData.juin?.length || 0} lignes`);
    console.log(`  - Juillet: ${sheetsData.juillet?.length || 0} lignes`);

    // Afficher un échantillon des données
    if (sheetsData.juin?.length > 0) {
      console.log('\n📋 Échantillon données Juin:');
      sheetsData.juin.slice(0, 3).forEach((row, i) => {
        console.log(`Ligne ${i + 1}:`, row.slice(0, 6));
      });
    }

    if (sheetsData.juillet?.length > 0) {
      console.log('\n📋 Échantillon données Juillet:');
      sheetsData.juillet.slice(0, 3).forEach((row, i) => {
        console.log(`Ligne ${i + 1}:`, row.slice(0, 6));
      });
    }

    // Test de traitement des données
    console.log('\n🔄 Test de traitement des données...');
    const deliveries = await syncService.processGoogleSheetsData(sheetsData);
    console.log(`📦 ${deliveries.length} livraisons traitées`);

    // Afficher un échantillon des livraisons traitées
    if (deliveries.length > 0) {
      console.log('\n📋 Échantillon livraisons traitées:');
      deliveries.slice(0, 5).forEach((delivery, i) => {
        console.log(`${i + 1}. ${delivery.date?.toLocaleDateString()} - ${delivery.client || delivery.entreprise || 'Sans nom'} - ${delivery.prix}€ - ${delivery.mois}`);
      });
    }

    // Test de synchronisation complète (optionnel)
    const doFullSync = process.argv.includes('--full-sync');
    if (doFullSync) {
      console.log('\n🔄 Test de synchronisation complète...');
      const result = await syncService.performSync();
      
      if (result.success) {
        console.log(`✅ Synchronisation réussie: ${result.message}`);
      } else {
        console.log(`❌ Erreur de synchronisation: ${result.error}`);
      }
    } else {
      console.log('\n💡 Pour tester la synchronisation complète, ajoutez --full-sync');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
}

// Exécuter le test
console.log('🧪 Test de synchronisation Google Sheets');
console.log('📄 Fichier ID:', process.env.GOOGLE_SHEETS_FILE_ID || '1qVl2__hq4Fs4KIfQQbccvK7mWizFL0hPvJUHa7UW8zQ');
console.log('🔑 API Key:', process.env.GOOGLE_SHEETS_API_KEY ? 'Configurée' : 'Non configurée (mode public)');

testSync();