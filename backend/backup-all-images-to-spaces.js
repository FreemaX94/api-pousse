const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import du service d'upload
const { uploadFile } = require('./src/shared/services/spacesService');

async function backupAllImagesToSpaces() {
  try {
    console.log('🔄 SAUVEGARDE COMPLÈTE DES IMAGES VERS SPACES');
    console.log('='.repeat(60));
    
    // Dossiers à scanner
    const imageDirs = [
      './public',
      './dist', 
      './uploads/movements',
      './uploads'
    ];
    
    let totalFound = 0;
    let totalUploaded = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    
    for (const dir of imageDirs) {
      if (!fs.existsSync(dir)) {
        console.log(`📂 Dossier ${dir} n'existe pas, ignoré`);
        continue;
      }
      
      console.log(`\n📁 Scan du dossier: ${dir}`);
      console.log('-'.repeat(30));
      
      // Fonction récursive pour scanner tous les fichiers
      const scanDirectory = async (currentDir, relativeDir = '') => {
        const files = fs.readdirSync(currentDir);
        
        for (const file of files) {
          const fullPath = path.join(currentDir, file);
          const relativePath = path.join(relativeDir, file);
          const stats = fs.statSync(fullPath);
          
          if (stats.isDirectory()) {
            // Scanner récursivement les sous-dossiers
            await scanDirectory(fullPath, relativePath);
          } else {
            // Vérifier si c'est une image
            const ext = path.extname(file).toLowerCase();
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
            
            if (!imageExtensions.includes(ext)) {
              continue;
            }
            
            totalFound++;
            console.log(`[${totalFound}] 📸 ${relativePath} (${(stats.size / 1024).toFixed(1)}KB)`);
            
            // Ignorer les fichiers vides
            if (stats.size === 0) {
              console.log(`   ⚠️  Fichier vide, ignoré`);
              totalSkipped++;
              continue;
            }
            
            try {
              // Lire le fichier
              const fileBuffer = fs.readFileSync(fullPath);
              
              // Déterminer le type MIME
              let mimeType = 'image/jpeg';
              if (ext === '.png') mimeType = 'image/png';
              else if (ext === '.gif') mimeType = 'image/gif';
              else if (ext === '.webp') mimeType = 'image/webp';
              
              // Nom pour Spaces
              let spacesFilename = file;
              if (relativePath.includes('movement') && !file.startsWith('movement_')) {
                spacesFilename = `movement_${file}`;
              }
              
              console.log(`   📤 Upload: ${spacesFilename}`);
              
              // Upload vers Spaces
              const spacesUrl = await uploadFile(fileBuffer, spacesFilename, mimeType, 'movements');
              console.log(`   ✅ Uploadé: ${spacesUrl}`);
              totalUploaded++;
              
            } catch (error) {
              console.log(`   ❌ Erreur: ${error.message}`);
              totalErrors++;
            }
          }
        }
      };
      
      await scanDirectory(dir);
    }
    
    console.log('\n📊 RÉSUMÉ FINAL:');
    console.log('='.repeat(40));
    console.log(`📸 Images trouvées: ${totalFound}`);
    console.log(`✅ Images uploadées: ${totalUploaded}`);
    console.log(`⏭️  Images ignorées: ${totalSkipped}`);
    console.log(`❌ Erreurs: ${totalErrors}`);
    console.log('');
    console.log('🎉 Sauvegarde complète terminée !');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
  
  process.exit(0);
}

// Lancer la sauvegarde
backupAllImagesToSpaces();