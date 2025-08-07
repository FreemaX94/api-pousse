// Script pour ajouter les images manquantes aux items Nieuwkoop
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const NieuwkoopItem = require('../src/domains/catalog/models/nieuwkoopItemModel');

async function addMissingImages() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connecté à MongoDB');

    // Trouver tous les items sans images
    const itemsWithoutImages = await NieuwkoopItem.find({
      $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } }
      ]
    });

    console.log(`📦 ${itemsWithoutImages.length} items trouvés sans images`);

    let updatedCount = 0;
    
    // Ajouter une image à chaque item
    for (const item of itemsWithoutImages) {
      const imageUrl = `/api/catalog/nieuwkoop/items/${item.reference}/image`;
      
      // Mettre à jour directement avec findByIdAndUpdate pour éviter les validations
      await NieuwkoopItem.findByIdAndUpdate(
        item._id,
        {
          $set: {
            images: [{
              url: imageUrl,
              isPrimary: true,
              type: 'product'
            }]
          }
        },
        { runValidators: false } // Skip validation
      );
      updatedCount++;
      console.log(`✅ Image ajoutée: ${item.name} (${item.reference}) -> ${imageUrl}`);
    }

    console.log(`\n✅ Terminé! ${updatedCount} items mis à jour avec des images.`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
addMissingImages();