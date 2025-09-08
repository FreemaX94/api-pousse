// Script de migration pour corriger les URLs d'images des articles externes
// Ce script met à jour les URLs d'images pour qu'elles pointent vers les bonnes routes

require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./config/config');

// Import des modèles
const NieuwkoopItem = require('./src/domains/catalog/models/nieuwkoopItemModel');
const Movement = require('./src/domains/inventory/models/movementModel');

async function fixExternalImagesUrls() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(config.mongoURI);
    console.log('✅ Connecté à MongoDB');

    // 1. Corriger les URLs d'images dans les articles externes du catalogue
    console.log('\n🔧 Correction des URLs d\'images dans les articles externes...');
    
    const externalItems = await NieuwkoopItem.find({
      'images.url': { $regex: 'movement_' }
    });

    console.log(`📦 ${externalItems.length} articles externes trouvés avec URLs à corriger`);

    for (const item of externalItems) {
      let updated = false;
      
      if (item.images && item.images.length > 0) {
        item.images.forEach(image => {
          // Corriger toutes les URLs d'images movement_
          if (image.url && image.url.includes('movement_')) {
            const filename = image.url.split('/').pop(); // Extraire juste le nom du fichier
            const oldUrl = image.url;
            image.url = `/api/catalog/nieuwkoop/movement-image/${filename}`;
            console.log(`📝 ${item.reference}: ${oldUrl} → ${image.url}`);
            updated = true;
          }
        });
      }

      if (updated) {
        await item.save();
        console.log(`✅ Article ${item.reference} mis à jour`);
      }
    }

    // 2. Corriger les URLs d'images dans les mouvements
    console.log('\n🔧 Correction des URLs d\'images dans les mouvements...');
    
    const movements = await Movement.find({
      image: { $regex: 'movement_' }
    });

    console.log(`📦 ${movements.length} mouvements trouvés avec URLs à corriger`);

    for (const movement of movements) {
      if (movement.image && movement.image.includes('movement_')) {
        const filename = movement.image.split('/').pop(); // Extraire juste le nom du fichier
        const oldUrl = movement.image;
        movement.image = `/api/uploads/movements/${filename}`;
        console.log(`📝 Mouvement ${movement._id}: ${oldUrl} → ${movement.image}`);
        
        await movement.save();
        console.log(`✅ Mouvement ${movement._id} mis à jour`);
      }
    }

    console.log('\n✅ Migration terminée avec succès !');
    console.log('\n📋 Résumé:');
    console.log(`   - ${externalItems.length} articles externes corrigés`);
    console.log(`   - ${movements.length} mouvements corrigés`);
    console.log('\n🚀 Les nouvelles entrées externes auront automatiquement les bonnes URLs');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    console.log('🔌 Fermeture de la connexion MongoDB...');
    await mongoose.disconnect();
    console.log('✅ Connexion fermée');
    process.exit(0);
  }
}

// Exécuter le script
if (require.main === module) {
  fixExternalImagesUrls().catch(console.error);
}

module.exports = { fixExternalImagesUrls };