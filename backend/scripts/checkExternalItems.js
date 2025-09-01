// Script pour vérifier les articles externes et leurs images
const mongoose = require('mongoose');
const PartnerItem = require('../models/partnerItemModel');

async function checkExternalItems() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/votre-db');
    console.log('✅ Connecté à MongoDB');

    // Récupérer tous les articles externes
    const items = await PartnerItem.find({});
    console.log(`\n📦 Nombre total d'articles externes: ${items.length}`);

    if (items.length === 0) {
      console.log('ℹ️  Aucun article externe trouvé');
      return;
    }

    // Analyser chaque article
    console.log('\n📋 Détails des articles externes:');
    console.log('='.repeat(80));
    
    items.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.name}`);
      console.log(`   📋 Référence: ${item.reference}`);
      console.log(`   📦 Quantité: ${item.quantity}`);
      console.log(`   💰 Prix: €${item.price}`);
      console.log(`   🏷️  Type de stock: ${item.stockType || 'non défini'}`);
      console.log(`   📝 Note: ${item.note || 'aucune'}`);
      
      // Analyser l'image
      if (item.image) {
        const imageSize = item.image.length;
        const isBase64 = item.image.startsWith('data:');
        console.log(`   🖼️  Image: ✅ Présente (${Math.round(imageSize / 1024)} KB) - ${isBase64 ? 'Base64' : 'Format inconnu'}`);
      } else {
        console.log(`   🖼️  Image: ❌ Manquante`);
      }
      
      console.log(`   📅 Créé: ${item.createdAt ? item.createdAt.toLocaleString('fr-FR') : 'Date inconnue'}`);
      console.log(`   📅 Modifié: ${item.updatedAt ? item.updatedAt.toLocaleString('fr-FR') : 'Date inconnue'}`);
    });

    // Statistiques
    const itemsWithImages = items.filter(item => item.image);
    const itemsWithoutImages = items.filter(item => !item.image);
    const totalImageSize = items.reduce((sum, item) => sum + (item.image ? item.image.length : 0), 0);

    console.log('\n📊 Statistiques:');
    console.log('='.repeat(50));
    console.log(`📦 Articles avec image: ${itemsWithImages.length}/${items.length}`);
    console.log(`❌ Articles sans image: ${itemsWithoutImages.length}/${items.length}`);
    console.log(`💾 Taille totale des images: ${Math.round(totalImageSize / 1024)} KB`);
    console.log(`📏 Taille moyenne par image: ${itemsWithImages.length > 0 ? Math.round(totalImageSize / itemsWithImages.length / 1024) : 0} KB`);

    if (itemsWithoutImages.length > 0) {
      console.log('\n⚠️  Articles sans image:');
      itemsWithoutImages.forEach(item => {
        console.log(`   - ${item.name} (${item.reference})`);
      });
    }

    console.log('\n✅ Analyse terminée. Les images sont stockées en base64 dans MongoDB et survivront aux déploiements.');

  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Déconnecté de MongoDB');
  }
}

// Exécuter le script
if (require.main === module) {
  checkExternalItems();
}

module.exports = checkExternalItems;