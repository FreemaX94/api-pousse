const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import du service Spaces
const { uploadFile } = require('./src/shared/services/spacesService');

async function uploadAllVasesToSpaces() {
  try {
    console.log('🚀 UPLOAD DE TOUTES LES IMAGES DE VASES VERS SPACES');
    console.log('='.repeat(60));
    
    // Dossiers sources
    const sourceDirs = [
      './public',
      './dist'
    ];
    
    let totalFiles = 0;
    let uploadedFiles = 0;
    let skippedFiles = 0;
    let errorFiles = 0;
    
    for (const sourceDir of sourceDirs) {
      if (!fs.existsSync(sourceDir)) {
        console.log(`📂 Dossier ${sourceDir} n'existe pas, ignoré`);
        continue;
      }
      
      console.log(`\\n📁 TRAITEMENT DE ${sourceDir.toUpperCase()}:`);
      console.log('-'.repeat(40));
      
      // Lister tous les fichiers movement_
      const files = fs.readdirSync(sourceDir);
      const movementFiles = files.filter(file => 
        file.startsWith('movement_') && (file.endsWith('.jpg') || file.endsWith('.jpeg'))
      );
      
      console.log(`📸 ${movementFiles.length} images de vases trouvées`);
      
      for (const filename of movementFiles) {
        totalFiles++;
        const filePath = path.join(sourceDir, filename);
        
        console.log(`\\n[${totalFiles}] ${filename}`);
        
        try {
          // Lire le fichier
          const fileBuffer = fs.readFileSync(filePath);
          const stats = fs.statSync(filePath);
          
          console.log(`   📏 Taille: ${(stats.size / 1024).toFixed(1)}KB`);
          
          if (stats.size === 0) {
            console.log(`   ⚠️  Fichier vide, ignoré`);
            skippedFiles++;
            continue;
          }
          
          // Déterminer le type MIME
          const ext = path.extname(filename).toLowerCase();
          const mimeType = ext === '.jpeg' ? 'image/jpeg' : 'image/jpeg';
          
          console.log(`   📤 Upload vers Spaces...`);
          
          // Upload vers Spaces dans le dossier movements
          const spacesUrl = await uploadFile(fileBuffer, filename, mimeType, 'movements');
          
          console.log(`   ✅ Uploadé: ${spacesUrl}`);
          uploadedFiles++;
          
        } catch (error) {
          console.log(`   ❌ Erreur: ${error.message}`);
          errorFiles++;
        }
      }
    }
    
    console.log('\\n📊 RÉSUMÉ FINAL:');
    console.log('='.repeat(50));
    console.log(`📸 Fichiers traités: ${totalFiles}`);
    console.log(`✅ Images uploadées: ${uploadedFiles}`);
    console.log(`⏭️  Images ignorées: ${skippedFiles}`);
    console.log(`❌ Erreurs: ${errorFiles}`);
    
    if (uploadedFiles > 0) {
      console.log('\\n🎉 SUCCÈS ! Toutes les images de vases sont maintenant sur Spaces');
      console.log('\\n🔗 Les images sont maintenant accessibles via:');
      console.log('   https://api-pousse-uploads.ams3.cdn.digitaloceanspaces.com/movements/[filename]');
      console.log('\\n💡 Pour que les vases s\'affichent, il faut maintenant:');
      console.log('   1. Mettre à jour les URLs dans la base de données');
      console.log('   2. Ou configurer les routes pour rediriger vers Spaces');
    } else {
      console.log('\\n⚠️  Aucune image n\'a été uploadée. Vérifiez la configuration Spaces.');
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Lancer l'upload
uploadAllVasesToSpaces();