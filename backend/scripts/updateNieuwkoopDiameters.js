/**
 * Script pour mettre à jour les diamètres des articles Nieuwkoop existants
 * Récupère les données depuis l'API Nieuwkoop et met à jour les dimensions
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const axios = require('axios');
const NieuwkoopItem = require('../models/nieuwkoopItemModel');

// Configuration de la connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-pousse';

// Configuration de l'API Nieuwkoop
const NIEUWKOOP_API_BASE = 'https://www.nieuwkoop-europe.com/api';
const NIEUWKOOP_API_KEY = process.env.NIEUWKOOP_API_KEY || 'Z_GKBQCOumTjsZlQQQKBQgSO';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
}

async function getItemDetailsFromAPI(reference) {
  try {
    const response = await axios.get(
      `${NIEUWKOOP_API_BASE}/json/getItemDetails.php`,
      {
        params: {
          key: NIEUWKOOP_API_KEY,
          item_code: reference,
          lang: 'EN'
        },
        timeout: 10000
      }
    );

    if (response.data && response.data.item) {
      return response.data.item;
    }
    return null;
  } catch (error) {
    console.error(`❌ Erreur API pour ${reference}:`, error.message);
    return null;
  }
}

async function updateDiameters() {
  try {
    // Récupérer tous les articles avec diamètre = 0 ou sans diamètre
    const items = await NieuwkoopItem.find({
      $or: [
        { 'dimensions.diameter': 0 },
        { 'dimensions.diameter': { $exists: false } },
        { 'dimensions.diameter': null }
      ]
    });

    console.log(`📦 ${items.length} articles trouvés avec diamètre manquant ou à 0`);

    let updated = 0;
    let failed = 0;

    for (const item of items) {
      console.log(`\n🔍 Traitement de ${item.reference} - ${item.name}`);
      
      // Récupérer les détails depuis l'API
      const apiData = await getItemDetailsFromAPI(item.reference);
      
      if (apiData) {
        // Extraire le diamètre selon les différents champs possibles
        const diameter = 
          apiData.DiameterCulturePot || 
          apiData.Diameter || 
          apiData.Opening || 
          (apiData.PotSize ? parseInt(apiData.PotSize) : 0) || 
          0;

        const height = apiData.Height || item.dimensions?.height || 0;

        if (diameter > 0) {
          // Mettre à jour l'article
          item.dimensions = {
            ...item.dimensions,
            diameter: diameter,
            height: height
          };

          await item.save();
          console.log(`✅ Mis à jour: diamètre = ${diameter}cm, hauteur = ${height}cm`);
          updated++;
        } else {
          console.log(`⚠️ Pas de diamètre trouvé dans l'API pour ${item.reference}`);
        }
      } else {
        console.log(`❌ Impossible de récupérer les données API pour ${item.reference}`);
        failed++;
      }

      // Pause entre les requêtes pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\n📊 Résumé:`);
    console.log(`✅ ${updated} articles mis à jour`);
    console.log(`❌ ${failed} articles échoués`);
    console.log(`⏭️ ${items.length - updated - failed} articles sans diamètre dans l'API`);

  } catch (error) {
    console.error('❌ Erreur durant la mise à jour:', error);
  }
}

async function main() {
  await connectDB();
  await updateDiameters();
  await mongoose.connection.close();
  console.log('\n✅ Script terminé');
}

// Exécuter le script
main().catch(console.error);