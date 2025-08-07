const SimpleSheetsSync = require('../services/simpleSheetsSync');
const mongoose = require('mongoose');
require('dotenv').config();

async function testSimpleSync() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apiPousse');
    console.log('✅ Connecté à MongoDB');

    // Créer une instance du service
    const syncService = new SimpleSheetsSync();
    
    // Initialiser
    await syncService.initialize();

    // Test de récupération des données CSV
    console.log('\n🔄 Test de récupération des données CSV...');
    const data = await syncService.fetchAllData();
    
    console.log(`📊 Données récupérées:`);
    console.log(`  - Juin: ${data.juin?.length || 0} lignes`);
    console.log(`  - Juillet: ${data.juillet?.length || 0} lignes`);

    // Afficher un échantillon
    if (data.juin?.length > 0) {
      console.log('\n📋 Échantillon Juin (premières colonnes):');
      data.juin.slice(0, 3).forEach((row, i) => {
        console.log(`  ${i + 1}:`, row.slice(0, 6));
      });
    }

    if (data.juillet?.length > 0) {
      console.log('\n📋 Échantillon Juillet (premières colonnes):');
      data.juillet.slice(0, 3).forEach((row, i) => {
        console.log(`  ${i + 1}:`, row.slice(0, 6));
      });
    }

    // Test de traitement
    console.log('\n🔄 Test de traitement des données...');
    const deliveries = syncService.processData(data);
    console.log(`📦 ${deliveries.length} livraisons traitées`);

    // Afficher échantillon des livraisons
    if (deliveries.length > 0) {
      console.log('\n📋 Échantillon livraisons:');
      deliveries.slice(0, 5).forEach((delivery, i) => {
        console.log(`  ${i + 1}. ${delivery.mois} - ${delivery.client || delivery.entreprise || 'Sans nom'} - ${delivery.prix}€ - ${delivery.fait ? 'Fait' : 'En cours'}`);
      });
    }

    // Test sync complète (si demandé)
    if (process.argv.includes('--sync')) {
      console.log('\n🔄 Synchronisation complète...');
      const result = await syncService.performSync();
      
      if (result.success) {
        console.log(`✅ ${result.message}`);
      } else {
        console.log(`❌ Erreur: ${result.error}`);
      }
    } else {
      console.log('\n💡 Ajoutez --sync pour effectuer une synchronisation complète');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
}

console.log('🧪 Test de synchronisation CSV Google Sheets');
testSimpleSync();