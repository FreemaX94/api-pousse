// Script pour mettre à jour les URLs des images Nieuwkoop
// pour utiliser le nouveau chemin DDD

require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const NieuwkoopItem = require('../src/domains/catalog/models/nieuwkoopItemModel');

async function updateImageUrls() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connecté à MongoDB');

    // Analyser TOUS les items pour comprendre leurs structures d'images
    const allItems = await NieuwkoopItem.find({});
    console.log(`📦 ${allItems.length} items trouvés au total`);

    let itemsWithImages = 0;
    let itemsWithoutImages = 0;
    let itemsWithOldFormat = 0;
    let itemsWithNewFormat = 0;
    let itemsWithEmptyImages = 0;

    console.log('\n🔍 Analyse des structures d\'images:');
    
    for (const item of allItems) {
      console.log(`\n📄 ${item.name} (${item.reference}):`);
      
      if (!item.images || item.images.length === 0) {
        console.log('  ❌ Pas d\'images du tout');
        itemsWithoutImages++;
      } else {
        itemsWithImages++;
        console.log(`  📸 ${item.images.length} image(s):`);
        
        item.images.forEach((img, index) => {
          console.log(`    [${index}] URL: ${img.url}`);
          console.log(`    [${index}] isPrimary: ${img.isPrimary}`);
          
          if (!img.url || img.url === '') {
            itemsWithEmptyImages++;
          } else if (img.url.startsWith('/api/nieuwkoop/items/')) {
            itemsWithOldFormat++;
          } else if (img.url.startsWith('/api/catalog/nieuwkoop/items/')) {
            itemsWithNewFormat++;
          } else {
            console.log(`    [${index}] Format inconnu: ${img.url}`);
          }
        });
      }
    }

    console.log('\n📊 Résumé:');
    console.log(`  Items avec images: ${itemsWithImages}`);
    console.log(`  Items sans images: ${itemsWithoutImages}`);
    console.log(`  Items avec URLs vides: ${itemsWithEmptyImages}`);
    console.log(`  Items avec ancien format: ${itemsWithOldFormat}`);
    console.log(`  Items avec nouveau format: ${itemsWithNewFormat}`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
updateImageUrls();