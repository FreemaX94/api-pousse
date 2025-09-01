// Script pour tester l'accès aux images movements
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

async function testMovementsAccess() {
  console.log('🔄 Test d\'accès aux images movements...');
  
  const baseURL = 'http://localhost:3001';
  
  try {
    // Lister les images disponibles dans le dossier
    const movementsDir = path.join(__dirname, '../src/public/movements');
    const files = await fs.readdir(movementsDir);
    
    console.log(`\n📁 Images disponibles dans movements: ${files.length}`);
    files.forEach(file => {
      console.log(`   📸 ${file}`);
    });
    
    if (files.length > 0) {
      // Tester l'accès à la première image
      const testImage = files.find(f => f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png'));
      
      if (testImage) {
        const imageURL = `${baseURL}/movements/${testImage}`;
        console.log(`\n🔗 Test d'accès: ${imageURL}`);
        
        try {
          const response = await axios.head(imageURL, { timeout: 5000 });
          console.log(`✅ Image accessible: ${response.status} ${response.statusText}`);
          console.log(`📊 Taille: ${response.headers['content-length']} bytes`);
          console.log(`🖼️  Type: ${response.headers['content-type']}`);
        } catch (err) {
          if (err.code === 'ECONNREFUSED') {
            console.log('❌ Serveur non démarré. Démarrez le serveur avec:');
            console.log('   npm run dev');
          } else {
            console.log(`❌ Erreur d'accès: ${err.message}`);
          }
        }
      }
    }
    
    // Instructions pour l'utilisateur
    console.log(`\n📋 INSTRUCTIONS:`);
    console.log('1. Démarrez le serveur: npm run dev');
    console.log('2. Les images seront accessibles via: http://localhost:3001/movements/FILENAME');
    console.log('3. Dans l\'interface, les URL /movements/ fonctionneront automatiquement');
    
    // Créer un fichier de test
    const testPath = path.join(movementsDir, 'test-access.txt');
    await fs.writeFile(testPath, 'Test d\'accès aux fichiers movements - ' + new Date().toISOString());
    console.log('\n✅ Fichier de test créé: test-access.txt');
    console.log('🔗 Testez l\'accès: http://localhost:3001/movements/test-access.txt');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

if (require.main === module) {
  testMovementsAccess();
}

module.exports = testMovementsAccess;