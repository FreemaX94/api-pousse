// Script pour analyser les collections contenant des images et identifier les articles externes
require('dotenv').config();
const mongoose = require('mongoose');

async function analyzeExternalImages() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    const collectionsToAnalyze = [
      { name: 'nieuwkoopitems', count: 140 },
      { name: 'movements', count: 281 },
      { name: 'livraisons', count: 317 }
    ];

    for (const collectionInfo of collectionsToAnalyze) {
      console.log(`\n🔍 ANALYSE DÉTAILLÉE: ${collectionInfo.name}`);
      console.log('='.repeat(60));
      
      const collection = mongoose.connection.db.collection(collectionInfo.name);
      
      // Prendre quelques échantillons pour comprendre la structure
      const samples = await collection.find({}).limit(5).toArray();
      
      console.log(`📦 Échantillons de documents:`);
      
      samples.forEach((doc, i) => {
        console.log(`\n📄 Document ${i + 1}:`);
        console.log(`   🗝️  ID: ${doc._id}`);
        
        // Afficher les champs principaux
        const mainFields = ['name', 'reference', 'price', 'height', 'diameter', 'quantity', 'image'];
        mainFields.forEach(field => {
          if (doc[field] !== undefined) {
            if (field === 'image' && typeof doc[field] === 'string' && doc[field].startsWith('data:image')) {
              console.log(`   🖼️  ${field}: IMAGE BASE64 (${doc[field].substring(0, 50)}...)`);
            } else {
              console.log(`   📋 ${field}: ${doc[field]}`);
            }
          }
        });
        
        // Chercher récursivement les images base64
        function findBase64Recursive(obj, path = '', depth = 0) {
          if (depth > 3) return; // Limiter la profondeur
          
          if (typeof obj === 'string' && obj.startsWith('data:image')) {
            console.log(`   🖼️  Image base64 trouvée à: ${path} (${obj.substring(0, 50)}...)`);
            return;
          }
          
          if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
            for (let key in obj) {
              if (obj.hasOwnProperty(key)) {
                findBase64Recursive(obj[key], path ? `${path}.${key}` : key, depth + 1);
              }
            }
          }
          
          if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
              findBase64Recursive(item, `${path}[${index}]`, depth + 1);
            });
          }
        }
        
        findBase64Recursive(doc);
        
        // Afficher tous les champs disponibles
        console.log(`   📝 Tous les champs: ${Object.keys(doc).join(', ')}`);
      });
    }

    // Focus spécial sur nieuwkoopitems pour trouver les articles externes
    console.log(`\n🎯 RECHERCHE SPÉCIALE: Articles externes dans nieuwkoopitems`);
    console.log('='.repeat(60));
    
    const nieuwkoopCollection = mongoose.connection.db.collection('nieuwkoopitems');
    
    // Recherche manuelle d'articles avec des caractéristiques d'articles externes
    const cursor = nieuwkoopCollection.find({});
    let externalCount = 0;
    let externalExamples = [];
    
    await cursor.forEach(doc => {
      // Convertir en JSON pour chercher les images base64
      const docStr = JSON.stringify(doc);
      if (docStr.includes('data:image')) {
        externalCount++;
        if (externalExamples.length < 5) {
          // Extraire l'image base64
          const base64Match = docStr.match(/"(data:image[^"]+)"/);
          externalExamples.push({
            id: doc._id,
            name: doc.name,
            reference: doc.reference,
            price: doc.pricing?.price,
            height: doc.dimensions?.height,
            diameter: doc.dimensions?.diameter,
            stockQuantity: doc.stock?.quantity,
            stockType: doc.stock?.stockType,
            imageFound: !!base64Match,
            imagePreview: base64Match ? base64Match[1].substring(0, 80) : null
          });
        }
      }
    });
    
    console.log(`\n📊 RÉSULTATS:`);
    console.log(`🎯 Articles externes trouvés: ${externalCount}`);
    
    if (externalExamples.length > 0) {
      console.log(`\n📋 Exemples d'articles externes:`);
      externalExamples.forEach((item, i) => {
        console.log(`\n   ${i + 1}. ${item.name || 'Nom manquant'}`);
        console.log(`      🏷️  Référence: ${item.reference || 'N/A'}`);
        console.log(`      💰 Prix: €${item.price || 'N/A'}`);
        console.log(`      📐 Hauteur: ${item.height || 'N/A'}`);
        console.log(`      📐 Diamètre: ${item.diameter || 'N/A'}`);
        console.log(`      📦 Stock: ${item.stockQuantity || 'N/A'}`);
        console.log(`      🏷️  Type: ${item.stockType || 'N/A'}`);
        console.log(`      🖼️  Image: ${item.imageFound ? 'OUI' : 'NON'}`);
        if (item.imagePreview) {
          console.log(`      📸 Aperçu: ${item.imagePreview}...`);
        }
      });
    }

    console.log(`\n✅ BINGO! Vos articles externes sont dans la collection 'nieuwkoopitems'`);
    console.log(`📦 ${externalCount} articles contiennent des images base64`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Déconnecté de MongoDB');
  }
}

if (require.main === module) {
  analyzeExternalImages();
}

module.exports = analyzeExternalImages;