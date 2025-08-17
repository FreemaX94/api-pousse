/**
 * Script de vérification des dimensions
 * Compare les dimensions en base de données avec celles de l'API Nieuwkoop
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const axios = require('axios');
const NieuwkoopItem = require('../models/nieuwkoopItemModel');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-pousse';
const CUSTOMER_BASE_URL = process.env.NIEUWKOOP_CUSTOMER_BASE_URL || 'https://customerapi.nieuwkoop-europe.com';
const BASIC_USER = process.env.NIEUWKOOP_BASIC_USER || 'apipousse';
const BASIC_PASS = process.env.NIEUWKOOP_BASIC_PASS || 'Pousse2024!';

// Client API
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
    console.log('✅ Connecté à MongoDB\n');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
}

async function fetchItemFromAPI(productCode) {
  try {
    const response = await customerClient.get('/items', {
      params: {
        itemCode: productCode,
        sysmodified: '2020-01-01T00:00:00Z'
      }
    });
    
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
    
  } catch (error) {
    return null;
  }
}

function extractDiameter(apiData) {
  return apiData.DiameterCulturePot || 
         apiData.Diameter || 
         apiData.Opening || 
         (apiData.PotSize ? parseInt(apiData.PotSize) : 0) || 
         apiData.Width ||
         0;
}

async function verifyAllDimensions() {
  try {
    // Récupérer tous les articles
    const items = await NieuwkoopItem.find({}).sort('reference');
    console.log(`📦 Vérification de ${items.length} articles\n`);
    console.log('='.repeat(100));
    console.log(`${'Référence'.padEnd(15)} | ${'Nom'.padEnd(25)} | ${'DB Ø'.padEnd(8)} | ${'API Ø'.padEnd(8)} | ${'DB H'.padEnd(8)} | ${'API H'.padEnd(8)} | ${'Statut'.padEnd(15)}`);
    console.log('='.repeat(100));

    let correct = 0;
    let incorrect = 0;
    let notFound = 0;
    const discrepancies = [];

    for (const item of items) {
      const apiData = await fetchItemFromAPI(item.reference);
      
      if (apiData) {
        const apiDiameter = extractDiameter(apiData);
        const apiHeight = apiData.Height || 0;
        const dbDiameter = item.dimensions?.diameter || 0;
        const dbHeight = item.dimensions?.height || 0;
        
        const diameterMatch = dbDiameter === apiDiameter;
        const heightMatch = dbHeight === apiHeight;
        const isCorrect = diameterMatch && heightMatch;
        
        let status = '';
        let statusSymbol = '';
        
        if (isCorrect) {
          status = '✅ Correct';
          statusSymbol = '✅';
          correct++;
        } else {
          status = '❌ Différent';
          statusSymbol = '❌';
          incorrect++;
          discrepancies.push({
            reference: item.reference,
            name: item.name,
            dbDiameter,
            apiDiameter,
            dbHeight,
            apiHeight
          });
        }
        
        console.log(
          `${item.reference.padEnd(15)} | ` +
          `${item.name.substring(0, 25).padEnd(25)} | ` +
          `${(dbDiameter + 'cm').padEnd(8)} | ` +
          `${(apiDiameter + 'cm').padEnd(8)} | ` +
          `${(dbHeight + 'cm').padEnd(8)} | ` +
          `${(apiHeight + 'cm').padEnd(8)} | ` +
          `${status.padEnd(15)}`
        );
        
      } else {
        notFound++;
        console.log(
          `${item.reference.padEnd(15)} | ` +
          `${item.name.substring(0, 25).padEnd(25)} | ` +
          `${(item.dimensions?.diameter || 0) + 'cm'.padEnd(8)} | ` +
          `${'N/A'.padEnd(8)} | ` +
          `${(item.dimensions?.height || 0) + 'cm'.padEnd(8)} | ` +
          `${'N/A'.padEnd(8)} | ` +
          `⚠️ Pas dans API`.padEnd(15)
        );
      }
      
      // Pause entre les requêtes
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('='.repeat(100));
    console.log('\n📊 RÉSUMÉ DE LA VÉRIFICATION:');
    console.log('='.repeat(50));
    console.log(`✅ ${correct} articles avec dimensions correctes`);
    console.log(`❌ ${incorrect} articles avec dimensions différentes`);
    console.log(`⚠️ ${notFound} articles non trouvés dans l'API`);
    console.log(`📦 Total: ${items.length} articles`);
    
    if (discrepancies.length > 0) {
      console.log('\n❌ ARTICLES AVEC DIMENSIONS INCORRECTES:');
      console.log('='.repeat(50));
      discrepancies.forEach(item => {
        console.log(`\n${item.reference} - ${item.name}:`);
        if (item.dbDiameter !== item.apiDiameter) {
          console.log(`  ⚠️ Diamètre: ${item.dbDiameter}cm (DB) ≠ ${item.apiDiameter}cm (API)`);
        }
        if (item.dbHeight !== item.apiHeight) {
          console.log(`  ⚠️ Hauteur: ${item.dbHeight}cm (DB) ≠ ${item.apiHeight}cm (API)`);
        }
      });
      
      console.log('\n💡 Pour corriger, exécutez: node updateAllDiametersFromAPI.js');
    } else if (incorrect === 0) {
      console.log('\n🎉 Toutes les dimensions sont correctes !');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

async function main() {
  console.log('🔍 VÉRIFICATION DES DIMENSIONS NIEUWKOOP');
  console.log('=========================================\n');
  
  await connectDB();
  await verifyAllDimensions();
  await mongoose.connection.close();
  console.log('\n✅ Vérification terminée');
}

// Exécuter
main().catch(console.error);