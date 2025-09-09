// Script pour forcer la copie des fichiers statiques
const fs = require('fs');
const path = require('path');
const https = require('https'); // Import manquant pour téléchargements Spaces

console.log('🚨 SETUP STATIC FILES - FORCE COPY');

// Créer tous les dossiers nécessaires
const dirs = [
  'public',
  'public/assets',
  'dist',
  'dist/assets'
];

dirs.forEach(dir => {
  try {
    fs.mkdirSync(dir, { recursive: true });
    console.log('✅ Created directory:', dir);
  } catch (e) {
    console.log('📁 Directory exists:', dir);
  }
});

// Copier tous les fichiers depuis ../frontend/dist si ils existent
const frontendDist = '../frontend/dist';
if (fs.existsSync(frontendDist)) {
  console.log('📂 Frontend dist found, copying...');
  
  function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      const files = fs.readdirSync(src);
      files.forEach(file => {
        copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      fs.copyFileSync(src, dest);
      console.log('📄 Copied:', path.basename(dest));
    }
  }
  
  try {
    copyRecursive(frontendDist, 'public');
    copyRecursive(frontendDist, 'dist');
    console.log('✅ All files copied to public and dist');
  } catch (e) {
    console.log('❌ Copy error:', e.message);
  }
}

// Lister ce qu'on a maintenant
console.log('\n📊 FINAL STATUS:');
['public/assets', 'dist/assets'].forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
    console.log(`${dir}: ${files.length} JS files`);
  } else {
    console.log(`${dir}: NOT FOUND`);
  }
});

// Copier aussi les images de mouvements vers public pour que la route les trouve
const uploadsMovements = 'uploads/movements';
if (fs.existsSync(uploadsMovements)) {
  console.log('📂 Movement images found, copying to public...');
  const publicMovements = 'public';
  const distMovements = 'dist';
  
  try {
    const movementFiles = fs.readdirSync(uploadsMovements);
    movementFiles.forEach(file => {
      if (file.startsWith('movement_')) {
        fs.copyFileSync(path.join(uploadsMovements, file), path.join(publicMovements, file));
        fs.copyFileSync(path.join(uploadsMovements, file), path.join(distMovements, file));
        console.log('📄 Copied movement image:', file);
      }
    });
    console.log('✅ Movement images copied to public and dist');
  } catch (e) {
    console.log('⚠️ Movement copy error:', e.message);
  }
}

// 🌐 NOUVEAU: Télécharger les images de Spaces vers public et dist
async function downloadSpacesImages() {
  try {
    console.log('🌐 Téléchargement des images Spaces vers public/dist...');
    
    const mongoose = require('mongoose');
    
    // Connexion MongoDB pour récupérer les articles avec URLs Spaces
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-pousse';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connecté à MongoDB pour récupération images Spaces');
    
    // Schéma pour récupérer les articles
    const nieuwkoopItemSchema = new mongoose.Schema({
      reference: String,
      name: String,
      images: [{ url: String, isPrimary: Boolean, alt: String }]
    }, { collection: 'nieuwkoopitems' });
    
    const NieuwkoopItem = mongoose.model('NieuwkoopItem', nieuwkoopItemSchema);
    
    // Récupérer tous les articles avec URLs Spaces
    const articlesWithSpacesImages = await NieuwkoopItem.find({
      'images.url': { $regex: 'digitaloceanspaces.com' }
    });
    
    console.log(`📊 Trouvé ${articlesWithSpacesImages.length} articles avec images Spaces`);
    
    let downloadCount = 0;
    
    for (const article of articlesWithSpacesImages) {
      if (article.images && article.images.length > 0) {
        const imageUrl = article.images[0].url;
        
        if (imageUrl && imageUrl.includes('digitaloceanspaces.com')) {
          // Extraire le nom de fichier de l'URL
          const urlParts = imageUrl.split('/');
          const filename = urlParts[urlParts.length - 1];
          
          console.log(`📥 Téléchargement: ${filename} depuis Spaces`);
          
          // Télécharger vers public et dist
          const publicPath = path.join('public', filename);
          const distPath = path.join('dist', filename);
          
          try {
            // Vérifier d'abord la taille du fichier sur Spaces
            const fileSize = await checkFileSize(imageUrl);
            
            if (fileSize === 0) {
              console.log(`⚠️ ${filename} ignoré (0 Bytes sur Spaces - fichier corrompu)`);
              continue;
            }
            
            await downloadFile(imageUrl, publicPath);
            await downloadFile(imageUrl, distPath);
            downloadCount++;
            console.log(`✅ ${filename} téléchargé vers public et dist (${fileSize} bytes)`);
          } catch (downloadError) {
            console.log(`⚠️ Erreur téléchargement ${filename}:`, downloadError.message);
          }
        }
      }
    }
    
    await mongoose.connection.close();
    console.log(`🎯 Téléchargement terminé: ${downloadCount} images copiées depuis Spaces`);
    
  } catch (error) {
    console.log('⚠️ Erreur téléchargement Spaces (non critique):', error.message);
  }
}

// Fonction helper pour vérifier la taille d'un fichier sur Spaces
function checkFileSize(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { method: 'HEAD' }, (response) => {
      if (response.statusCode === 200) {
        const contentLength = parseInt(response.headers['content-length'] || '0', 10);
        resolve(contentLength);
      } else {
        resolve(0); // Si erreur, considérer comme 0 bytes
      }
    }).on('error', (err) => {
      resolve(0); // Si erreur réseau, considérer comme 0 bytes
    });
  });
}

// Fonction helper pour télécharger un fichier
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Exécuter le téléchargement Spaces de manière asynchrone
downloadSpacesImages().then(() => {
  console.log('🚨 SETUP COMPLETE');
}).catch((error) => {
  console.log('⚠️ Setup terminé avec erreurs Spaces:', error.message);
  console.log('🚨 SETUP COMPLETE');
});