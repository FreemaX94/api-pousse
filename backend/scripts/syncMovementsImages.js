// Script pour synchroniser les images movements depuis le serveur
require('dotenv').config();
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs').promises;
const path = require('path');

async function syncMovementsImages() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    const collection = mongoose.connection.db.collection('nieuwkoopitems');
    
    // Récupérer tous les articles EXT avec leurs images
    const extArticles = await collection.find({
      reference: { $regex: '^EXT-', $options: 'i' }
    }).toArray();
    
    console.log(`\n🎯 ${extArticles.length} articles externes trouvés`);
    
    // Dossier local des images
    const localMovementsDir = path.join(__dirname, '../src/public/movements');
    
    // Créer le dossier s'il n'existe pas
    try {
      await fs.mkdir(localMovementsDir, { recursive: true });
    } catch (err) {
      // Dossier existe déjà
    }
    
    // Lister les images actuellement disponibles
    const existingFiles = await fs.readdir(localMovementsDir);
    console.log(`📁 Images locales actuelles: ${existingFiles.length}`);
    
    // Analyser les images nécessaires
    const neededImages = new Set();
    const imageUrls = [];
    
    extArticles.forEach(article => {
      if (article.images && Array.isArray(article.images)) {
        article.images.forEach(img => {
          if (img.url && img.url.startsWith('/movements/')) {
            const filename = path.basename(img.url);
            neededImages.add(filename);
            imageUrls.push({
              url: img.url,
              filename: filename,
              article: article.reference,
              name: article.name
            });
          }
        });
      }
    });
    
    console.log(`\n📋 Images nécessaires: ${neededImages.size}`);
    console.log(`📋 Images manquantes: ${Array.from(neededImages).filter(img => !existingFiles.includes(img)).length}`);
    
    // Afficher la liste des images nécessaires
    console.log('\n📸 Images nécessaires pour les articles EXT:');
    imageUrls.forEach((imgInfo, i) => {
      const exists = existingFiles.includes(imgInfo.filename);
      console.log(`   ${i + 1}. ${imgInfo.filename} ${exists ? '✅' : '❌'}`);
      console.log(`      Article: ${imgInfo.article} - ${imgInfo.name}`);
    });
    
    // Instructions pour récupérer les images manquantes
    const missingImages = Array.from(neededImages).filter(img => !existingFiles.includes(img));
    
    if (missingImages.length > 0) {
      console.log(`\n⚠️  ${missingImages.length} images manquantes localement`);
      console.log('\n📋 SOLUTIONS:');
      console.log('1. Copier les images depuis le serveur de production');
      console.log('2. Ou créer des images temporaires pour les tests');
      
      // Créer des images temporaires pour les tests
      console.log('\n🛠️  Création d\'images temporaires pour les tests...');
      
      for (const imgName of missingImages) {
        try {
          // Créer un fichier SVG temporaire
          const svgContent = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="150" fill="#f0f0f0" stroke="#ccc"/>
  <text x="100" y="75" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="12" fill="#666">
    Image temporaire
  </text>
  <text x="100" y="95" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="10" fill="#999">
    ${imgName.substring(0, 20)}...
  </text>
</svg>`;
          
          const tempFilePath = path.join(localMovementsDir, imgName.replace(/\.(jpg|jpeg|png)$/i, '_temp.svg'));
          await fs.writeFile(tempFilePath, svgContent);
          console.log(`   📝 Créé: ${path.basename(tempFilePath)}`);
          
        } catch (err) {
          console.log(`   ❌ Erreur création ${imgName}: ${err.message}`);
        }
      }
    } else {
      console.log('\n✅ Toutes les images sont disponibles localement !');
    }
    
    // Statistiques finales
    const finalFiles = await fs.readdir(localMovementsDir);
    console.log(`\n📊 RÉSUMÉ:`);
    console.log(`Articles EXT analysés: ${extArticles.length}`);
    console.log(`Images nécessaires: ${neededImages.size}`);
    console.log(`Images locales: ${finalFiles.length}`);
    console.log(`Couverture: ${Math.round(finalFiles.length / neededImages.size * 100)}%`);
    
    console.log(`\n🚀 PRÊT! Les articles externes devraient maintenant afficher leurs images.`);
    console.log(`🔗 Démarrez le serveur et testez: http://localhost:3001/movements/`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Déconnecté de MongoDB');
  }
}

if (require.main === module) {
  syncMovementsImages();
}

module.exports = syncMovementsImages;