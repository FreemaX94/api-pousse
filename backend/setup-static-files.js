// Script pour forcer la copie des fichiers statiques
const fs = require('fs');
const path = require('path');

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

console.log('🚨 SETUP COMPLETE');