/**
 * Script pour mettre à jour manuellement les diamètres des pots
 * basé sur les patterns dans les noms des produits
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const NieuwkoopItem = require('../models/nieuwkoopItemModel');

// Configuration de la connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-pousse';

// Mapping manuel des diamètres basé sur les patterns de noms
const diameterPatterns = [
  // Format: Ø40 ou D40
  { pattern: /[ØD](\d+)/i, extract: (match) => parseInt(match[1]) },
  // Format: 40x50 (diamètre x hauteur)
  { pattern: /(\d+)x\d+/i, extract: (match) => parseInt(match[1]) },
  // Format avec slash: 40/50
  { pattern: /(\d+)\/\d+/i, extract: (match) => parseInt(match[1]) },
  // Format: 40cm
  { pattern: /(\d+)\s*cm/i, extract: (match) => parseInt(match[1]) },
  // Tailles standards dans le nom
  { pattern: /\b(12|14|15|17|19|21|24|27|30|35|38|40|45|50|55|60|65|70|75|80|90|100)\b/, extract: (match) => parseInt(match[1]) }
];

// Mapping spécifique pour certains noms de produits
const specificMappings = {
  'Grigio': { defaultDiameter: 40 },
  'Argento': { defaultDiameter: 35 },
  'Fiberstone': { defaultDiameter: 45 },
  'Cement & Stone': { defaultDiameter: 40 },
  'B-round': { defaultDiameter: 40 },
  'Cylinder': { defaultDiameter: 40 },
  'Bohemian': { defaultDiameter: 36 },
  'Terra Cotta': { defaultDiameter: 35 },
  'Palermo': { defaultDiameter: 17 },
  'Rough': { defaultDiameter: 24 },
  'Raindrop': { defaultDiameter: 30 },
  'Artstone': { defaultDiameter: 30 }
};

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

function extractDiameterFromName(name) {
  // Essayer d'extraire le diamètre avec les patterns
  for (const { pattern, extract } of diameterPatterns) {
    const match = name.match(pattern);
    if (match) {
      const diameter = extract(match);
      if (diameter > 0 && diameter <= 200) { // Vérification de cohérence
        return diameter;
      }
    }
  }

  // Chercher dans les mappings spécifiques
  for (const [key, value] of Object.entries(specificMappings)) {
    if (name.includes(key)) {
      return value.defaultDiameter;
    }
  }

  return null;
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

    console.log(`📦 ${items.length} articles trouvés avec diamètre manquant ou à 0\n`);

    let updated = 0;
    let notFound = 0;

    for (const item of items) {
      const extractedDiameter = extractDiameterFromName(item.name);
      
      if (extractedDiameter) {
        // Mettre à jour l'article
        item.dimensions = {
          ...item.dimensions,
          diameter: extractedDiameter
        };

        await item.save();
        console.log(`✅ ${item.reference} - ${item.name}: diamètre mis à jour → ${extractedDiameter}cm`);
        updated++;
      } else {
        console.log(`⚠️ ${item.reference} - ${item.name}: impossible d'extraire le diamètre`);
        notFound++;
      }
    }

    console.log(`\n📊 Résumé:`);
    console.log(`✅ ${updated} articles mis à jour`);
    console.log(`⚠️ ${notFound} articles sans diamètre détectable`);

    // Afficher les articles qui nécessitent une mise à jour manuelle
    if (notFound > 0) {
      console.log(`\n📝 Articles nécessitant une mise à jour manuelle:`);
      const remainingItems = await NieuwkoopItem.find({
        'dimensions.diameter': { $in: [0, null] }
      }).select('reference name');

      remainingItems.forEach(item => {
        console.log(`   - ${item.reference}: ${item.name}`);
      });
    }

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