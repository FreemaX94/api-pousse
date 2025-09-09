// Script pour corriger spécifiquement zika et zaka
require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./config/config');

const NieuwkoopItem = require('./src/domains/catalog/models/nieuwkoopItemModel');

async function fixZikaZakaImages() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(config.mongoURI);
    console.log('✅ Connecté à MongoDB');

    // Trouver spécifiquement zika et zaka
    const items = await NieuwkoopItem.find({
      name: { $in: ['zika', 'zaka'] }
    });

    console.log(`📦 ${items.length} articles trouvés (zika/zaka)`);

    for (const item of items) {
      console.log(`\n📋 Article: ${item.name} (${item.reference})`);
      console.log(`🖼️ Image actuelle: ${item.images?.[0]?.url}`);
      
      let updated = false;
      
      if (item.images && item.images.length > 0) {
        item.images.forEach((image, index) => {
          console.log(`  Image ${index + 1}: ${image.url}`);
          
          if (image.url && image.url.includes('/api/catalog/nieuwkoop/movement-image/')) {
            const filename = image.url.split('/').pop();
            const spacesUrl = `https://api-pousse-uploads.ams3.digitaloceanspaces.com/movements/${filename}`;
            
            console.log(`  📝 Correction: ${image.url} → ${spacesUrl}`);
            
            image.url = spacesUrl;
            updated = true;
          }
        });
      }

      if (updated) {
        await item.save();
        console.log(`✅ Article "${item.name}" mis à jour`);
      } else {
        console.log(`ℹ️ Article "${item.name}" n'a pas besoin de correction`);
      }
    }

    console.log(`\n🎉 Vérification terminée !`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion fermée');
  }
}

// Exécuter le script
fixZikaZakaImages();