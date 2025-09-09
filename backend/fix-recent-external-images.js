// Script pour corriger uniquement les articles externes récents avec URLs locales
require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./config/config');

const NieuwkoopItem = require('./src/domains/catalog/models/nieuwkoopItemModel');

async function fixRecentExternalImages() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(config.mongoURI);
    console.log('✅ Connecté à MongoDB');

    // Trouver les articles récents (aujourd'hui) avec URLs locales movement-image
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const recentItems = await NieuwkoopItem.find({
      createdAt: { $gte: today },
      'images.url': { $regex: '/api/catalog/nieuwkoop/movement-image/' }
    });

    console.log(`📦 ${recentItems.length} articles externes récents trouvés avec URLs à corriger`);

    for (const item of recentItems) {
      let updated = false;
      
      if (item.images && item.images.length > 0) {
        item.images.forEach(image => {
          if (image.url && image.url.includes('/api/catalog/nieuwkoop/movement-image/')) {
            const filename = image.url.split('/').pop();
            const spacesUrl = `https://api-pousse-uploads.ams3.digitaloceanspaces.com/movements/${filename}`;
            
            console.log(`📝 ${item.name} (${item.reference}): ${image.url} → ${spacesUrl}`);
            
            image.url = spacesUrl;
            updated = true;
          }
        });
      }

      if (updated) {
        await item.save();
        console.log(`✅ Article "${item.name}" mis à jour`);
      }
    }

    console.log(`\n🎉 Correction terminée pour les articles récents !`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion fermée');
  }
}

// Exécuter le script
fixRecentExternalImages();