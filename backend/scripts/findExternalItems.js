// Script de diagnostic pour trouver les articles externes
require('dotenv').config();
const mongoose = require('mongoose');

async function findExternalItems() {
  try {
    // Connexion à MongoDB
    console.log('🔄 Connexion à MongoDB...');
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB');

    // Lister toutes les collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📋 Collections disponibles:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });

    // Chercher dans différentes collections possibles
    const possibleCollections = [
      'partneritems',
      'partner_items', 
      'external_items',
      'externalitems',
      'articles',
      'items',
      'catalogueitems',
      'nieuwkoopitems'
    ];

    console.log('\n🔍 Recherche d\'articles dans les collections...');
    
    for (const collectionName of possibleCollections) {
      try {
        if (collections.find(col => col.name === collectionName)) {
          const collection = mongoose.connection.db.collection(collectionName);
          const count = await collection.countDocuments();
          const sample = await collection.findOne();
          
          console.log(`\n📦 Collection "${collectionName}": ${count} documents`);
          
          if (count > 0 && sample) {
            console.log('   📄 Exemple de document:');
            console.log('   🗝️  ID:', sample._id);
            console.log('   📝 Champs:', Object.keys(sample).join(', '));
            
            // Vérifier si c'est un article externe (avec image base64)
            if (sample.image && typeof sample.image === 'string' && sample.image.includes('data:image')) {
              console.log('   🖼️  ✅ ARTICLE EXTERNE TROUVÉ! (contient image base64)');
              console.log('   📋 Nom:', sample.name || 'N/A');
              console.log('   💰 Prix:', sample.price || 'N/A');
              console.log('   🏷️  Référence:', sample.reference || 'N/A');
            } else if (sample.image) {
              console.log('   🖼️  Image présente mais pas en base64');
            }
          }
        }
      } catch (err) {
        console.log(`   ❌ Erreur avec ${collectionName}:`, err.message);
      }
    }

    // Essayer de chercher spécifiquement des documents avec image base64
    console.log('\n🔍 Recherche spécifique d\'images base64...');
    
    for (const collectionName of collections.map(c => c.name)) {
      try {
        const collection = mongoose.connection.db.collection(collectionName);
        const countWithBase64 = await collection.countDocuments({
          image: { $regex: '^data:image' }
        });
        
        if (countWithBase64 > 0) {
          console.log(`\n🎯 TROUVÉ! Collection "${collectionName}": ${countWithBase64} articles avec image base64`);
          
          const samples = await collection.find({ image: { $regex: '^data:image' } }).limit(3).toArray();
          samples.forEach((item, i) => {
            console.log(`\n   📦 Article ${i + 1}:`);
            console.log(`      📋 Nom: ${item.name || 'N/A'}`);
            console.log(`      🏷️  Référence: ${item.reference || 'N/A'}`);
            console.log(`      💰 Prix: ${item.price || 'N/A'}`);
            console.log(`      📐 Hauteur: ${item.height || 'N/A'}`);
            console.log(`      📐 Diamètre: ${item.diameter || 'N/A'}`);
            console.log(`      🖼️  Image: ${item.image.substring(0, 50)}...`);
          });
        }
      } catch (err) {
        // Ignorer les erreurs de collection
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Déconnecté de MongoDB');
  }
}

// Exécuter le script
if (require.main === module) {
  findExternalItems();
}

module.exports = findExternalItems;