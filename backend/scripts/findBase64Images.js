// Script pour fouiller PARTOUT et trouver les images base64
require('dotenv').config();
const mongoose = require('mongoose');

async function findBase64Images() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Lister toutes les collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n🔍 Recherche dans ${collections.length} collections...`);

    let totalFound = 0;
    const results = [];

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`\n📂 Analyse de la collection "${collectionName}"...`);
      
      try {
        const collection = mongoose.connection.db.collection(collectionName);
        const totalDocs = await collection.countDocuments();
        
        if (totalDocs === 0) {
          console.log(`   📦 0 documents - ignoré`);
          continue;
        }

        console.log(`   📦 ${totalDocs} documents`);

        // Recherche 1: Champ 'image' avec base64
        const count1 = await collection.countDocuments({
          image: { $regex: '^data:image', $options: 'i' }
        });

        // Recherche 2: Champ 'images' (array) avec base64
        const count2 = await collection.countDocuments({
          'images': { $elemMatch: { $regex: '^data:image', $options: 'i' } }
        });

        // Recherche 3: Images dans sous-objets
        const count3 = await collection.countDocuments({
          'images.url': { $regex: '^data:image', $options: 'i' }
        });

        // Recherche 4: Recherche dans n'importe quel champ string
        const count4 = await collection.countDocuments({
          $where: function() {
            function searchInObject(obj) {
              if (typeof obj === 'string' && obj.startsWith('data:image')) {
                return true;
              }
              if (typeof obj === 'object' && obj !== null) {
                for (let key in obj) {
                  if (searchInObject(obj[key])) {
                    return true;
                  }
                }
              }
              if (Array.isArray(obj)) {
                for (let item of obj) {
                  if (searchInObject(item)) {
                    return true;
                  }
                }
              }
              return false;
            }
            return searchInObject(this);
          }
        });

        const totalMatches = Math.max(count1, count2, count3, count4);

        if (totalMatches > 0) {
          totalFound += totalMatches;
          console.log(`   🎯 TROUVÉ! ${totalMatches} documents avec base64`);
          console.log(`      - Champ 'image': ${count1}`);
          console.log(`      - Array 'images': ${count2}`);
          console.log(`      - 'images.url': ${count3}`);
          console.log(`      - Recherche exhaustive: ${count4}`);

          // Récupérer des exemples
          let samples = [];
          
          if (count1 > 0) {
            samples = await collection.find({ image: { $regex: '^data:image' } }).limit(3).toArray();
          } else if (count2 > 0) {
            samples = await collection.find({ 'images': { $elemMatch: { $regex: '^data:image' } } }).limit(3).toArray();
          } else if (count3 > 0) {
            samples = await collection.find({ 'images.url': { $regex: '^data:image' } }).limit(3).toArray();
          } else {
            // Recherche manuelle dans les échantillons
            const allSamples = await collection.find({}).limit(50).toArray();
            samples = allSamples.filter(doc => {
              const json = JSON.stringify(doc);
              return json.includes('data:image');
            }).slice(0, 3);
          }

          console.log(`\n   📄 Exemples trouvés:`);
          samples.forEach((doc, i) => {
            console.log(`\n      📦 Document ${i + 1}:`);
            console.log(`         🗝️  ID: ${doc._id}`);
            
            // Analyser la structure du document
            const fields = Object.keys(doc);
            console.log(`         📝 Champs: ${fields.join(', ')}`);
            
            // Informations spécifiques si disponibles
            if (doc.name) console.log(`         📋 Nom: ${doc.name}`);
            if (doc.reference) console.log(`         🏷️  Référence: ${doc.reference}`);
            if (doc.price) console.log(`         💰 Prix: ${doc.price}`);
            if (doc.height) console.log(`         📐 Hauteur: ${doc.height}`);
            if (doc.diameter) console.log(`         📐 Diamètre: ${doc.diameter}`);
            if (doc.quantity) console.log(`         📦 Quantité: ${doc.quantity}`);
            
            // Trouver et afficher l'image base64
            function findBase64InObject(obj, path = '') {
              if (typeof obj === 'string' && obj.startsWith('data:image')) {
                console.log(`         🖼️  Image trouvée à: ${path || 'racine'} (${obj.substring(0, 50)}...)`);
                return true;
              }
              if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
                for (let key in obj) {
                  if (findBase64InObject(obj[key], path ? `${path}.${key}` : key)) {
                    return true;
                  }
                }
              }
              if (Array.isArray(obj)) {
                obj.forEach((item, index) => {
                  findBase64InObject(item, `${path}[${index}]`);
                });
              }
              return false;
            }
            
            findBase64InObject(doc);
          });

          results.push({
            collection: collectionName,
            count: totalMatches,
            samples: samples
          });
        } else {
          console.log(`   ⚪ Aucune image base64 trouvée`);
        }

      } catch (err) {
        console.log(`   ❌ Erreur: ${err.message}`);
      }
    }

    console.log(`\n🎯 RÉSUMÉ FINAL:`);
    console.log(`==================`);
    console.log(`Total d'images base64 trouvées: ${totalFound}`);
    console.log(`Collections contenant des images: ${results.length}`);
    
    if (results.length > 0) {
      console.log(`\n📋 Détail par collection:`);
      results.forEach(result => {
        console.log(`   - ${result.collection}: ${result.count} images`);
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
  findBase64Images();
}

module.exports = findBase64Images;