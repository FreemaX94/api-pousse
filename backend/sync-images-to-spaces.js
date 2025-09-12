const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();

// Import du service d'upload
const { uploadFile } = require('./src/shared/services/spacesService');

async function syncImagesToSpaces() {
  try {
    console.log('🚀 DÉBUT DE LA SYNCHRONISATION VERS SPACES');
    console.log('='.repeat(60));
    
    // Connexion MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-pousse';
    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion MongoDB réussie');
    
    // Import des modèles
    const NieuwkoopItem = require('./src/domains/catalog/models/nieuwkoopItemModel');
    
    // Récupération des articles avec images
    console.log('📦 Récupération des articles avec images...');
    const items = await NieuwkoopItem.find({
      imageUrl: { $exists: true, $ne: null, $ne: '' }
    }).lean();
    
    console.log(`📸 ${items.length} articles avec images trouvés`);
    console.log('');
    
    let processedCount = 0;
    let uploadedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    // Dossiers d'images à synchroniser
    const imageDirs = [
      './public',
      './dist', 
      './uploads/movements'
    ];
    
    for (const item of items) {
      processedCount++;
      console.log(`[${processedCount}/${items.length}] ${item.reference} - ${item.name}`);
      
      const imageUrl = item.imageUrl;
      console.log(`   🔗 URL actuelle: ${imageUrl}`);
      
      // Vérifier si c'est déjà une URL Spaces
      if (imageUrl.includes('digitaloceanspaces.com')) {
        console.log('   ⏭️  Déjà sur Spaces, ignorer');
        skippedCount++;
        continue;
      }
      
      let imageFound = false;
      let localImagePath = null;
      
      // Chercher l'image dans tous les dossiers
      for (const dir of imageDirs) {
        // Extraire le nom du fichier depuis l'URL
        let filename = '';
        
        if (imageUrl.includes('/movement-image/')) {
          filename = imageUrl.split('/movement-image/')[1];
        } else if (imageUrl.includes('/api/catalog/nieuwkoop/')) {
          filename = imageUrl.split('/api/catalog/nieuwkoop/')[1];
        } else {
          filename = path.basename(imageUrl);
        }
        
        const possiblePaths = [
          path.join(dir, filename),
          path.join(dir, 'movements', filename),
          path.join(dir, 'assets', filename)
        ];
        
        for (const possiblePath of possiblePaths) {
          if (fs.existsSync(possiblePath)) {
            localImagePath = possiblePath;
            imageFound = true;
            console.log(`   ✅ Image trouvée: ${localImagePath}`);
            break;
          }
        }
        
        if (imageFound) break;
      }
      
      if (!imageFound) {
        console.log(`   ❌ Image non trouvée localement`);
        errorCount++;
        continue;
      }
      
      try {
        // Lire le fichier
        const fileBuffer = fs.readFileSync(localImagePath);
        const stats = fs.statSync(localImagePath);
        
        if (stats.size === 0) {
          console.log(`   ⚠️  Fichier vide (0 bytes), ignoré`);
          skippedCount++;
          continue;
        }
        
        // Déterminer le type MIME
        const ext = path.extname(localImagePath).toLowerCase();
        let mimeType = 'image/jpeg';
        if (ext === '.png') mimeType = 'image/png';
        else if (ext === '.gif') mimeType = 'image/gif';
        else if (ext === '.webp') mimeType = 'image/webp';
        
        // Générer nom de fichier pour Spaces
        const originalFilename = path.basename(localImagePath);
        const spacesFilename = originalFilename.startsWith('movement_') 
          ? originalFilename 
          : `movement_${originalFilename}`;
        
        console.log(`   📤 Upload vers Spaces: ${spacesFilename} (${(stats.size / 1024).toFixed(1)}KB)`);
        
        // Upload vers Spaces
        const spacesUrl = await uploadFile(fileBuffer, spacesFilename, mimeType, 'movements');
        console.log(`   🎯 URL Spaces: ${spacesUrl}`);
        
        // Mettre à jour l'article dans la DB
        await NieuwkoopItem.updateOne(
          { _id: item._id },
          { 
            $set: { 
              imageUrl: spacesUrl,
              imageUrlBackup: imageUrl // Sauvegarder l'ancienne URL
            }
          }
        );
        
        console.log(`   ✅ Article mis à jour avec URL Spaces`);
        uploadedCount++;
        
      } catch (error) {
        console.log(`   ❌ Erreur upload: ${error.message}`);
        errorCount++;
      }
      
      console.log('');
    }
    
    console.log('📊 RÉSUMÉ FINAL:');
    console.log('='.repeat(40));
    console.log(`📦 Articles traités: ${processedCount}`);
    console.log(`✅ Images uploadées: ${uploadedCount}`);
    console.log(`⏭️  Déjà sur Spaces: ${skippedCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);
    console.log('');
    console.log('🎉 Synchronisation terminée !');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
  
  process.exit(0);
}

// Lancer la synchronisation
syncImagesToSpaces();