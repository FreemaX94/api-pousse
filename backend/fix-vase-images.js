const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function fixVaseImages() {
  try {
    console.log('🏺 RÉPARATION DES IMAGES DE VASES');
    console.log('='.repeat(50));
    
    // Connexion MongoDB Atlas
    const mongoUri = process.env.MONGODB_URI;
    console.log('🔗 Connexion à MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion MongoDB réussie');
    
    // Import du modèle
    const NieuwkoopItem = require('./src/domains/catalog/models/nieuwkoopItemModel');
    
    // Récupération des articles EXT- (vases) avec problèmes d'images
    console.log('🔍 Recherche des vases avec images problématiques...');
    const vases = await NieuwkoopItem.find({
      reference: { $regex: '^EXT-' }, // Articles externes (vases)
      imageUrl: { $exists: true, $ne: null, $ne: '' }
    }).lean();
    
    console.log(`🏺 ${vases.length} vases trouvés avec images`);
    console.log('');
    
    let processedCount = 0;
    let fixedCount = 0;
    let notFoundCount = 0;
    
    // Dossiers où chercher les images
    const imageDirs = [
      './public',
      './dist',
      './uploads/movements',
      './uploads'
    ];
    
    for (const vase of vases) {
      processedCount++;
      console.log(`[${processedCount}/${vases.length}] ${vase.reference}`);
      console.log(`   📝 Nom: ${vase.name}`);
      console.log(`   🔗 URL actuelle: ${vase.imageUrl}`);
      
      // Vérifier si l'image est accessible en production
      const isLocal = vase.imageUrl.includes('/api/catalog/nieuwkoop/movement-image/');
      const isSpaces = vase.imageUrl.includes('digitaloceanspaces.com');
      
      if (isSpaces) {
        console.log(`   ✅ Déjà sur Spaces, OK`);
        continue;
      }
      
      if (isLocal) {
        // Extraire le nom de fichier
        const filename = vase.imageUrl.split('/movement-image/')[1];
        console.log(`   📁 Recherche fichier: ${filename}`);
        
        // Chercher le fichier localement
        let localImageFound = false;
        let localImagePath = null;
        
        for (const dir of imageDirs) {
          const possiblePaths = [
            path.join(dir, filename),
            path.join(dir, 'movements', filename),
            path.join(dir, 'assets', filename)
          ];
          
          for (const possiblePath of possiblePaths) {
            if (fs.existsSync(possiblePath)) {
              localImagePath = possiblePath;
              localImageFound = true;
              console.log(`   ✅ Fichier trouvé: ${localImagePath}`);
              break;
            }
          }
          if (localImageFound) break;
        }
        
        if (localImageFound) {
          // Construire l'URL Spaces directe
          const spacesUrl = `https://api-pousse-uploads.ams3.cdn.digitaloceanspaces.com/movements/${filename}`;
          
          console.log(`   🔄 Mise à jour URL vers: ${spacesUrl}`);
          
          // Mettre à jour dans la DB
          await NieuwkoopItem.updateOne(
            { _id: vase._id },
            { 
              $set: { 
                imageUrl: spacesUrl,
                imageUrlBackup: vase.imageUrl
              }
            }
          );
          
          console.log(`   ✅ URL mise à jour dans la base`);
          fixedCount++;
          
        } else {
          console.log(`   ❌ Fichier non trouvé localement`);
          notFoundCount++;
        }
      }
      
      console.log('');
    }
    
    console.log('📊 RÉSUMÉ:');
    console.log('='.repeat(30));
    console.log(`🏺 Vases traités: ${processedCount}`);
    console.log(`✅ URLs corrigées: ${fixedCount}`);
    console.log(`❌ Images non trouvées: ${notFoundCount}`);
    console.log('');
    
    if (fixedCount > 0) {
      console.log('🎉 Images de vases réparées ! Elles devraient maintenant s\'afficher en production.');
    } else {
      console.log('⚠️  Aucune correction nécessaire ou possible.');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

// Lancer la réparation
fixVaseImages();