/**
 * Script pour mettre à jour les 3 derniers articles sans diamètre
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const NieuwkoopItem = require('../models/nieuwkoopItemModel');

// Configuration de la connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-pousse';

// Diamètres estimés pour les 3 articles restants
const manualUpdates = [
  {
    reference: '6PURR80LW',
    name: 'Pure®',
    diameter: 80,  // Pure® a souvent le diamètre dans le code: 80LW = 80cm Large Width
    height: 40
  },
  {
    reference: '6PTR62356',
    name: 'Jip',
    diameter: 35,  // Taille standard pour les pots Jip
    height: 35
  },
  {
    reference: '6FSTBO002',
    name: 'Natural',
    diameter: 50,  // Taille standard pour les pots Natural/Fiberstone
    height: 45
  }
];

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

async function updateLastThreeItems() {
  try {
    console.log('🔧 Mise à jour des 3 derniers articles sans diamètre...\n');

    for (const update of manualUpdates) {
      const item = await NieuwkoopItem.findOne({ reference: update.reference });
      
      if (item) {
        // Mettre à jour les dimensions
        item.dimensions = {
          ...item.dimensions,
          diameter: update.diameter,
          height: update.height || item.dimensions?.height || 0
        };

        await item.save();
        console.log(`✅ ${update.reference} - ${update.name}:`);
        console.log(`   → Diamètre: ${update.diameter}cm`);
        console.log(`   → Hauteur: ${update.height}cm\n`);
      } else {
        console.log(`⚠️ Article ${update.reference} non trouvé\n`);
      }
    }

    // Vérifier s'il reste des articles sans diamètre
    const remainingItems = await NieuwkoopItem.find({
      $or: [
        { 'dimensions.diameter': 0 },
        { 'dimensions.diameter': { $exists: false } },
        { 'dimensions.diameter': null }
      ]
    });

    if (remainingItems.length === 0) {
      console.log('🎉 Tous les articles ont maintenant un diamètre !');
    } else {
      console.log(`⚠️ Il reste ${remainingItems.length} article(s) sans diamètre`);
    }

  } catch (error) {
    console.error('❌ Erreur durant la mise à jour:', error);
  }
}

async function main() {
  await connectDB();
  await updateLastThreeItems();
  await mongoose.connection.close();
  console.log('\n✅ Script terminé');
}

// Exécuter le script
main().catch(console.error);