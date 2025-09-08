#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Script pour sauvegarder les images importantes dans le dépôt Git
// Cela permet de les conserver lors des déploiements

const uploadsDir = path.join(__dirname, 'uploads/movements');
const backupDir = path.join(__dirname, 'src/assets/backup-images');

// Créer le dossier de backup s'il n'existe pas
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

console.log('🔄 Sauvegarde des images de mouvements...');

if (fs.existsSync(uploadsDir)) {
  const files = fs.readdirSync(uploadsDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|gif)$/i.test(file)
  );

  console.log(`📸 Trouvé ${imageFiles.length} images à sauvegarder`);

  imageFiles.forEach(file => {
    const srcPath = path.join(uploadsDir, file);
    const destPath = path.join(backupDir, file);
    
    try {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Sauvegardé: ${file}`);
    } catch (err) {
      console.error(`❌ Erreur pour ${file}:`, err.message);
    }
  });

  console.log('✅ Sauvegarde terminée !');
} else {
  console.log('❌ Dossier uploads/movements introuvable');
}