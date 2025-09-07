#!/usr/bin/env node

/**
 * Script de préparation des uploads - VERSION SIMPLE
 * Ne bloque jamais le déploiement
 */

const fs = require('fs');
const path = require('path');

try {
  console.log('🚀 Préparation uploads (version robuste)...');
  
  const uploadsDir = path.join(__dirname, 'uploads');
  
  // Créer le dossier et sous-dossiers
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Dossier uploads créé:', uploadsDir);
  }
  
  // Créer sous-dossiers requis
  const subDirs = ['movements', 'backup_uploads'];
  subDirs.forEach(subDir => {
    const subPath = path.join(uploadsDir, subDir);
    if (!fs.existsSync(subPath)) {
      fs.mkdirSync(subPath, { recursive: true });
      console.log('✅ Sous-dossier créé:', subDir);
    }
  });
  
  console.log('✅ Préparation uploads terminée avec succès');
  
  // Ne jamais faire d'exit() ou process.exit() qui pourrait bloquer
} catch (error) {
  console.log('⚠️ Erreur préparation uploads (non critique):', error.message);
  console.log('✅ Continuation normale du démarrage...');
  // On ne fait rien qui puisse bloquer le processus
}