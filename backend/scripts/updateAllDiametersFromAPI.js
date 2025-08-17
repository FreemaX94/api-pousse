/**
 * Script pour mettre à jour TOUS les diamètres depuis l'API Nieuwkoop
 * Utilise l'API customer avec authentification Basic
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const axios = require('axios');
const NieuwkoopItem = require('../models/nieuwkoopItemModel');

// Configuration de la connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-pousse';

// Configuration de l'API Customer Nieuwkoop
const CUSTOMER_BASE_URL = process.env.NIEUWKOOP_CUSTOMER_BASE_URL || 'https://customerapi.nieuwkoop-europe.com';
const BASIC_USER = process.env.NIEUWKOOP_BASIC_USER || 'apipousse';
const BASIC_PASS = process.env.NIEUWKOOP_BASIC_PASS || 'Pousse2024!';

// Client pour l'API Customer
const customerClient = axios.create({
  baseURL: CUSTOMER_BASE_URL,
  timeout: 10000,
  auth: {
    username: BASIC_USER,
    password: BASIC_PASS,
  },
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

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

async function fetchItemFromAPI(productCode) {
  try {
    console.log(`   🔍 Recherche API pour: ${productCode}`);
    
    const response = await customerClient.get('/items', {
      params: {
        itemCode: productCode,
        sysmodified: '2020-01-01T00:00:00Z'
      }
    });
    
    if (response.data && response.data.length > 0) {
      const itemData = response.data[0];
      console.log(`   ✅ Données trouvées`);
      
      // Debug: afficher les champs de dimensions disponibles
      const dimensionFields = {
        DiameterCulturePot: itemData.DiameterCulturePot,
        Diameter: itemData.Diameter,
        Opening: itemData.Opening,
        PotSize: itemData.PotSize,
        Width: itemData.Width,
        Height: itemData.Height
      };
      console.log(`   📏 Champs dimensions:`, dimensionFields);
      
      return itemData;
    }
    
    console.log(`   ⚠️ Aucune donnée trouvée dans l'API`);
    return null;
    
  } catch (error) {
    if (error.response?.status === 404) {
      console.log(`   ⚠️ Article non trouvé dans l'API (404)`);
    } else if (error.response?.status === 401) {
      console.log(`   ❌ Erreur d'authentification (401)`);
    } else {
      console.log(`   ❌ Erreur API: ${error.message}`);
    }
    return null;
  }
}

async function updateAllDiameters() {
  try {
    // Récupérer TOUS les articles de la base
    const items = await NieuwkoopItem.find({});
    console.log(`\n📦 ${items.length} articles trouvés dans la base de données\n`);

    let updated = 0;
    let notFound = 0;
    let noDiameter = 0;
    let errors = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      console.log(`\n[${i + 1}/${items.length}] ${item.reference} - ${item.name}`);
      
      try {
        // Récupérer les données depuis l'API
        const apiData = await fetchItemFromAPI(item.reference);
        
        if (apiData) {
          // Extraire le diamètre avec tous les champs possibles
          const diameter = 
            apiData.DiameterCulturePot || 
            apiData.Diameter || 
            apiData.Opening || 
            (apiData.PotSize ? parseInt(apiData.PotSize) : 0) || 
            apiData.Width ||
            0;
          
          const height = apiData.Height || item.dimensions?.height || 0;
          
          if (diameter > 0) {
            // Vérifier si c'est différent de l'actuel
            const currentDiameter = item.dimensions?.diameter || 0;
            
            if (currentDiameter !== diameter) {
              // Mettre à jour l'article
              item.dimensions = {
                ...item.dimensions,
                diameter: diameter,
                height: height,
                width: apiData.Width || item.dimensions?.width,
                depth: apiData.Depth || item.dimensions?.depth
              };
              
              await item.save();
              console.log(`   ✅ Mis à jour: ${currentDiameter}cm → ${diameter}cm (hauteur: ${height}cm)`);
              updated++;
            } else {
              console.log(`   ℹ️ Diamètre déjà correct: ${diameter}cm`);
            }
          } else {
            console.log(`   ⚠️ Pas de diamètre dans les données API`);
            noDiameter++;
          }
        } else {
          notFound++;
        }
        
      } catch (error) {
        console.log(`   ❌ Erreur: ${error.message}`);
        errors++;
      }
      
      // Pause entre les requêtes pour éviter de surcharger l'API
      if (i < items.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200)); // 200ms entre chaque requête
      }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`📊 RÉSUMÉ FINAL:`);
    console.log(`${'='.repeat(50)}`);
    console.log(`✅ ${updated} articles mis à jour avec succès`);
    console.log(`ℹ️ ${items.length - updated - notFound - noDiameter - errors} articles déjà à jour`);
    console.log(`⚠️ ${notFound} articles non trouvés dans l'API`);
    console.log(`⚠️ ${noDiameter} articles sans diamètre dans l'API`);
    console.log(`❌ ${errors} erreurs`);
    
    // Afficher les articles qui n'ont toujours pas de diamètre
    const stillNoDiameter = await NieuwkoopItem.find({
      $or: [
        { 'dimensions.diameter': 0 },
        { 'dimensions.diameter': { $exists: false } },
        { 'dimensions.diameter': null }
      ]
    }).select('reference name');
    
    if (stillNoDiameter.length > 0) {
      console.log(`\n📝 Articles sans diamètre après mise à jour:`);
      stillNoDiameter.forEach(item => {
        console.log(`   - ${item.reference}: ${item.name}`);
      });
    } else {
      console.log(`\n🎉 Tous les articles ont maintenant un diamètre !`);
    }

  } catch (error) {
    console.error('❌ Erreur durant la mise à jour:', error);
  }
}

async function main() {
  console.log('🚀 Démarrage du script de mise à jour des diamètres depuis l\'API Nieuwkoop');
  console.log(`📍 API URL: ${CUSTOMER_BASE_URL}`);
  console.log(`🔐 Utilisateur: ${BASIC_USER}`);
  console.log('⏱️ Ce processus peut prendre plusieurs minutes...\n');
  
  await connectDB();
  await updateAllDiameters();
  await mongoose.connection.close();
  console.log('\n✅ Script terminé');
}

// Exécuter le script
main().catch(console.error);