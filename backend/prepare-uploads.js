#!/usr/bin/env node

/**
 * Script de préparation des uploads pour le déploiement production
 * S'assure que le dossier uploads existe et est accessible
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Préparation des uploads pour production...');

// Chemins
const backendDir = __dirname;
const uploadsDir = path.join(backendDir, 'uploads');
const publicDir = path.join(backendDir, 'public');
const publicUploadsDir = path.join(publicDir, 'uploads');

// 1. Créer le dossier uploads principal s'il n'existe pas
if (!fs.existsSync(uploadsDir)) {
  console.log('📁 Création dossier uploads:', uploadsDir);
  fs.mkdirSync(uploadsDir, { recursive: true });
  
  // Créer un fichier .gitkeep pour s'assurer qu'il soit dans git
  fs.writeFileSync(path.join(uploadsDir, '.gitkeep'), '# Dossier uploads pour fichiers uploadés\n');
}

// 2. Créer les sous-dossiers nécessaires
const subDirs = ['movements', 'backup_uploads'];
subDirs.forEach(dir => {
  const subPath = path.join(uploadsDir, dir);
  if (!fs.existsSync(subPath)) {
    console.log('📁 Création sous-dossier:', subPath);
    fs.mkdirSync(subPath, { recursive: true });
    fs.writeFileSync(path.join(subPath, '.gitkeep'), '');
  }
});

// 3. Copier uploads vers public/uploads pour backup
if (!fs.existsSync(publicUploadsDir)) {
  console.log('📁 Création backup dans public/uploads');
  fs.mkdirSync(publicUploadsDir, { recursive: true });
  
  // Copier les fichiers existants si il y en a
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    files.forEach(file => {
      if (file !== '.gitkeep' && !fs.statSync(path.join(uploadsDir, file)).isDirectory()) {
        const src = path.join(uploadsDir, file);
        const dest = path.join(publicUploadsDir, file);
        fs.copyFileSync(src, dest);
        console.log('📄 Copié:', file);
      }
    });
  }
}

console.log('✅ Préparation uploads terminée');
console.log('📊 Statistiques:');
console.log('  - uploads/ exists:', fs.existsSync(uploadsDir));
console.log('  - public/uploads/ exists:', fs.existsSync(publicUploadsDir));

if (fs.existsSync(uploadsDir)) {
  const files = fs.readdirSync(uploadsDir);
  console.log('  - Fichiers uploads/:', files.length);
}