// Script pour corriger les URLs d'images des articles externes vers les URLs Spaces
require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./config/config');

// Import des modèles
const NieuwkoopItem = require('./src/domains/catalog/models/nieuwkoopItemModel');

async function fixExternalImageUrls() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(config.mongoURI);
    console.log('✅ Connecté à MongoDB');

    // Trouver tous les articles externes avec URLs locales
    const externalItems = await NieuwkoopItem.find({
      'images.url': { $regex: '/api/catalog/nieuwkoop/movement-image/' }
    });

    console.log(`📦 ${externalItems.length} articles externes trouvés avec URLs locales à corriger`);

    let updatedCount = 0;

    for (const item of externalItems) {
      let updated = false;
      
      if (item.images && item.images.length > 0) {
        item.images.forEach(image => {
          if (image.url && image.url.includes('/api/catalog/nieuwkoop/movement-image/')) {
            // Extraire le nom du fichier
            const filename = image.url.split('/').pop();
            
            // Construire l'URL Spaces
            const spacesUrl = `https://api-pousse-uploads.ams3.digitaloceanspaces.com/movements/${filename}`;
            
            console.log(`📝 ${item.reference}: ${image.url} → ${spacesUrl}`);
            
            image.url = spacesUrl;
            updated = true;
          }
        });
      }

      if (updated) {
        await item.save();
        updatedCount++;
        console.log(`✅ Article ${item.reference} mis à jour`);
      }
    }

    console.log(`\n✅ Migration terminée !`);
    console.log(`📊 ${updatedCount} articles mis à jour avec URLs Spaces`);

  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion fermée');
  }
}

// Exécuter le script
if (require.main === module) {
  fixExternalImageUrls();
}

module.exports = { fixExternalImageUrls };