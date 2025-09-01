// Script pour télécharger les images depuis le serveur de production
require('dotenv').config();
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const fs = require('fs').promises;
const path = require('path');

async function downloadProductionImages() {
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
    
    // URL de base de votre serveur de production
    const PRODUCTION_URL = 'https://api-pousse-app-5y2wo.ondigitalocean.app';
    
    // Dossier local des images
    const localMovementsDir = path.join(__dirname, '../src/public/movements');
    
    // Analyser les images nécessaires
    const imageUrls = [];
    
    extArticles.forEach(article => {
      if (article.images && Array.isArray(article.images)) {
        article.images.forEach(img => {
          if (img.url && img.url.startsWith('/movements/')) {
            const filename = path.basename(img.url);
            imageUrls.push({
              url: img.url,
              filename: filename,
              fullUrl: PRODUCTION_URL + img.url,
              article: article.reference,
              name: article.name
            });
          }
        });
      }
    });
    
    console.log(`\n📋 ${imageUrls.length} images à télécharger depuis la production`);
    
    // Fonction pour télécharger une image
    async function downloadImage(imgInfo) {
      return new Promise((resolve, reject) => {
        const localPath = path.join(localMovementsDir, imgInfo.filename);
        const file = require('fs').createWriteStream(localPath);
        
        const client = imgInfo.fullUrl.startsWith('https:') ? https : http;
        
        const request = client.get(imgInfo.fullUrl, (response) => {
          if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
              file.close();
              resolve({ success: true, filename: imgInfo.filename });
            });
          } else {
            reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          }
        });
        
        request.on('error', reject);
        request.setTimeout(30000, () => {
          request.destroy();
          reject(new Error('Timeout'));
        });
      });
    }
    
    // Télécharger les images une par une
    let successCount = 0;
    let errorCount = 0;
    
    console.log('🌐 Téléchargement depuis la production...');
    
    for (let i = 0; i < imageUrls.length; i++) {
      const imgInfo = imageUrls[i];
      console.log(`\n📥 ${i + 1}/${imageUrls.length}: ${imgInfo.filename}`);
      console.log(`   🔗 ${imgInfo.fullUrl}`);
      
      try {
        await downloadImage(imgInfo);
        console.log(`   ✅ Téléchargé avec succès`);
        successCount++;
      } catch (error) {
        console.log(`   ❌ Erreur: ${error.message}`);
        errorCount++;
        
        // Créer une image de fallback en cas d'échec
        try {
          const fallbackContent = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="200" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2"/>
  <text x="150" y="90" text-anchor="middle" font-family="Arial" font-size="14" fill="#6c757d">
    Image non disponible
  </text>
  <text x="150" y="110" text-anchor="middle" font-family="Arial" font-size="12" fill="#adb5bd">
    ${imgInfo.article}
  </text>
  <text x="150" y="130" text-anchor="middle" font-family="Arial" font-size="10" fill="#adb5bd">
    ${imgInfo.name.substring(0, 40)}${imgInfo.name.length > 40 ? '...' : ''}
  </text>
</svg>`;
          
          const fallbackPath = path.join(localMovementsDir, imgInfo.filename.replace(/\.(jpg|jpeg|png)$/i, '.svg'));
          await fs.writeFile(fallbackPath, fallbackContent);
          console.log(`   📝 Fallback SVG créé: ${path.basename(fallbackPath)}`);
          
        } catch (fallbackError) {
          console.log(`   ❌ Erreur création fallback: ${fallbackError.message}`);
        }
      }
      
      // Petite pause entre les téléchargements
      if (i < imageUrls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`\n📊 RÉSULTATS DU TÉLÉCHARGEMENT:`);
    console.log(`✅ Succès: ${successCount}/${imageUrls.length}`);
    console.log(`❌ Échecs: ${errorCount}/${imageUrls.length}`);
    console.log(`📈 Taux de succès: ${Math.round(successCount / imageUrls.length * 100)}%`);
    
    // Vérifier les fichiers finaux
    const finalFiles = await fs.readdir(localMovementsDir);
    const realImages = finalFiles.filter(f => f.match(/\.(jpg|jpeg|png)$/i));
    const fallbackImages = finalFiles.filter(f => f.endsWith('.svg'));
    
    console.log(`\n📁 FICHIERS LOCAUX FINAUX:`);
    console.log(`🖼️  Images réelles: ${realImages.length}`);
    console.log(`📝 Images SVG: ${fallbackImages.length}`);
    console.log(`📦 Total: ${finalFiles.length}`);
    
    if (successCount > 0) {
      console.log(`\n🎉 SUCCÈS! ${successCount} images ont été téléchargées depuis la production.`);
    }
    
    console.log(`\n🚀 Les articles externes devraient maintenant afficher leurs images !`);
    console.log(`🔗 Testez: http://localhost:3001/movements/`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Déconnecté de MongoDB');
  }
}

if (require.main === module) {
  downloadProductionImages();
}

module.exports = downloadProductionImages;