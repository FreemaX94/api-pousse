// Script pour analyser les articles nieuwkoop et identifier les externes
require('dotenv').config();
const mongoose = require('mongoose');

async function checkNieuwkoopItems() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    const collection = mongoose.connection.db.collection('nieuwkoopitems');
    const total = await collection.countDocuments();
    console.log(`\n📦 Total articles nieuwkoop: ${total}`);

    // Échantillon d'articles
    console.log('\n🔍 Analyse des articles:');
    const samples = await collection.find({}).limit(10).toArray();
    
    let articlesWithImages = 0;
    let articlesWithBase64 = 0;
    
    samples.forEach((item, i) => {
      console.log(`\n📦 Article ${i + 1}:`);
      console.log(`   📋 Nom: ${item.name || 'N/A'}`);
      console.log(`   🏷️  Référence: ${item.reference || 'N/A'}`);
      console.log(`   💰 Prix: ${item.pricing?.price || 'N/A'}`);
      console.log(`   📦 Stock: ${item.stock?.quantity || 0}`);
      console.log(`   🏷️  Type stock: ${item.stock?.stockType || 'N/A'}`);
      console.log(`   📐 Hauteur: ${item.dimensions?.height || 'N/A'}`);
      console.log(`   📐 Diamètre: ${item.dimensions?.diameter || 'N/A'}`);
      
      if (item.images && item.images.length > 0) {
        articlesWithImages++;
        console.log(`   🖼️  Images: ${item.images.length}`);
        item.images.forEach((img, imgI) => {
          if (img.url && img.url.startsWith('data:image')) {
            articlesWithBase64++;
            console.log(`     📸 Image ${imgI + 1}: BASE64 (${img.url.substring(0, 50)}...)`);
          } else {
            console.log(`     📸 Image ${imgI + 1}: ${img.url || 'URL manquante'}`);
          }
        });
      } else {
        console.log(`   🖼️  Images: Aucune`);
      }
      
      // Vérifier si c'est potentiellement un article externe
      const isExternal = !item.reference || 
                        (item.images && item.images.some(img => img.url && img.url.startsWith('data:image'))) ||
                        item.supplier?.name !== 'Nieuwkoop';
      
      if (isExternal) {
        console.log(`   🔍 POTENTIELLEMENT EXTERNE`);
      }
    });

    // Statistiques globales
    console.log('\n📊 STATISTIQUES GLOBALES:');
    
    // Compter les articles avec images base64
    const totalWithBase64 = await collection.countDocuments({
      'images.url': { $regex: '^data:image' }
    });
    
    // Compter les articles sans référence Nieuwkoop standard
    const withoutReference = await collection.countDocuments({
      $or: [
        { reference: { $exists: false } },
        { reference: null },
        { reference: '' }
      ]
    });
    
    // Compter les articles avec stockType permanent/limité
    const withStockType = await collection.countDocuments({
      'stock.stockType': { $exists: true }
    });
    
    console.log(`📸 Articles avec images base64: ${totalWithBase64}`);
    console.log(`🏷️  Articles sans référence: ${withoutReference}`);
    console.log(`📦 Articles avec stockType: ${withStockType}`);
    
    if (totalWithBase64 > 0) {
      console.log('\n🎯 ARTICLES EXTERNES POTENTIELS TROUVÉS!');
      console.log('Les articles avec images base64 sont probablement vos articles externes.');
      
      // Récupérer tous les articles avec base64
      const externalItems = await collection.find({
        'images.url': { $regex: '^data:image' }
      }).toArray();
      
      console.log(`\n📋 Liste des ${externalItems.length} articles externes:`);
      externalItems.forEach((item, i) => {
        console.log(`${i + 1}. ${item.name} (Réf: ${item.reference || 'N/A'}) - €${item.pricing?.price || 'N/A'}`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Déconnecté de MongoDB');
  }
}

if (require.main === module) {
  checkNieuwkoopItems();
}

module.exports = checkNieuwkoopItems;