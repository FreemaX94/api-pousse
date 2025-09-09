#!/usr/bin/env node

/**
 * Script SÉPARÉ pour synchroniser les images Spaces
 * Non-bloquant, robuste, ne fait jamais planter le serveur principal
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

console.log('🌐 [SPACES SYNC] Début synchronisation images Spaces...');

// Fonction helper pour vérifier la taille d'un fichier sur Spaces
function checkFileSize(url) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(0), 5000); // Timeout 5s
    
    https.get(url, { method: 'HEAD' }, (response) => {
      clearTimeout(timeout);
      if (response.statusCode === 200) {
        const contentLength = parseInt(response.headers['content-length'] || '0', 10);
        resolve(contentLength);
      } else {
        resolve(0);
      }
    }).on('error', () => {
      clearTimeout(timeout);
      resolve(0);
    });
  });
}

// Fonction helper pour télécharger un fichier
function downloadFile(url, outputPath) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(false), 10000); // Timeout 10s
    
    try {
      const file = fs.createWriteStream(outputPath);
      
      https.get(url, (response) => {
        clearTimeout(timeout);
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(true);
          });
          file.on('error', () => resolve(false));
        } else {
          resolve(false);
        }
      }).on('error', () => {
        clearTimeout(timeout);
        resolve(false);
      });
    } catch (error) {
      clearTimeout(timeout);
      resolve(false);
    }
  });
}

async function syncSpacesImages() {
  try {
    // Connexion MongoDB avec timeout court
    console.log('🔗 [SPACES SYNC] Tentative connexion MongoDB...');
    
    const mongoose = require('mongoose');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-pousse';
    
    // Connexion avec timeout très court pour ne pas bloquer
    await Promise.race([
      mongoose.connect(mongoUri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 3000, // 3 secondes max
        connectTimeoutMS: 3000
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 4000))
    ]);
    
    console.log('✅ [SPACES SYNC] Connecté à MongoDB');
    
    // Schéma simple
    const nieuwkoopItemSchema = new mongoose.Schema({
      reference: String,
      name: String,
      images: [{ url: String, isPrimary: Boolean, alt: String }]
    }, { collection: 'nieuwkoopitems' });
    
    const NieuwkoopItem = mongoose.model('NieuwkoopItem', nieuwkoopItemSchema);
    
    // Récupérer articles avec URLs Spaces (avec timeout)
    const articles = await Promise.race([
      NieuwkoopItem.find({ 'images.url': { $regex: 'digitaloceanspaces.com' } }).limit(10),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Query timeout')), 3000))
    ]);
    
    console.log(`📊 [SPACES SYNC] Trouvé ${articles.length} articles avec images Spaces`);
    
    // Créer les dossiers de destination
    ['public', 'dist'].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    let downloadCount = 0;
    
    // Traiter chaque article (max 10 pour éviter surcharge)
    for (const article of articles.slice(0, 10)) {
      if (article.images && article.images.length > 0) {
        const imageUrl = article.images[0].url;
        
        if (imageUrl && imageUrl.includes('digitaloceanspaces.com')) {
          const urlParts = imageUrl.split('/');
          const filename = urlParts[urlParts.length - 1];
          
          console.log(`📥 [SPACES SYNC] Traitement: ${filename}`);
          
          // Vérifier taille (skip si 0 bytes)
          const fileSize = await checkFileSize(imageUrl);
          
          if (fileSize === 0) {
            console.log(`⚠️ [SPACES SYNC] ${filename} ignoré (0 Bytes - corrompu)`);
            continue;
          }
          
          // Télécharger vers public et dist
          const publicPath = path.join('public', filename);
          const distPath = path.join('dist', filename);
          
          const [publicOk, distOk] = await Promise.all([
            downloadFile(imageUrl, publicPath),
            downloadFile(imageUrl, distPath)
          ]);
          
          if (publicOk && distOk) {
            downloadCount++;
            console.log(`✅ [SPACES SYNC] ${filename} téléchargé (${fileSize} bytes)`);
          } else {
            console.log(`⚠️ [SPACES SYNC] Échec téléchargement ${filename}`);
          }
        }
      }
    }
    
    await mongoose.connection.close();
    console.log(`🎯 [SPACES SYNC] Terminé: ${downloadCount} images synchronisées`);
    
  } catch (error) {
    console.log(`⚠️ [SPACES SYNC] Erreur (non critique): ${error.message}`);
  } finally {
    // Toujours terminer proprement
    console.log('🏁 [SPACES SYNC] Script terminé');
    process.exit(0);
  }
}

// Exécution avec gestion d'erreurs globales
process.on('uncaughtException', (error) => {
  console.log('⚠️ [SPACES SYNC] Exception non gérée:', error.message);
  process.exit(0);
});

process.on('unhandledRejection', (error) => {
  console.log('⚠️ [SPACES SYNC] Promesse rejetée:', error.message);
  process.exit(0);
});

// Lancer la synchronisation
syncSpacesImages();