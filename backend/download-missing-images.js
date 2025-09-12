const fs = require('fs');
const path = require('path');
const https = require('https');

async function downloadMissingImages() {
  try {
    console.log('🔍 RECHERCHE DES 9 IMAGES MANQUANTES SUR SPACES');
    console.log('='.repeat(60));
    
    // Les 9 images manquantes identifiées
    const missingImages = [
      'movement_nm-000305-vase-medicis-en-ceramique-blanc-brillant-d26cm-h35cm-p-image-121414-grande_1756727939829.jpg',
      'movement_nm-000308-vase-medicis-en-ceramique-blanc-brillant-d31cm-h23cm-p-image-121417-grande_1756728465219.jpg',
      'movement_nm-000304-vase-medicis-en-ceramique-blanc-brillant-d22cm-h295cm-p-image-121413-grande_1756728252297.jpg',
      'movement_Capture_da_A_cranA_2025-08-21_A_08_49_16_1757283402328.jpeg',
      'movement_nm-000303-vase-medicis-en-ceramique-blanc-brillant-d195cm-h255cm-p-image-121412-grande_1756728198183.jpg',
      'movement_nm-000306-vase-medicis-en-ceramique-blanc-brillant-d20cm-h16cm-p-image-121415-grande_1756728339575.jpg',
      'movement_jo-000021-vase-bouteille-en-verre-vert-olive-d6cm-h10cm-p-image-121032-grande_1756711722633.jpg',
      'movement_jo-000003-vase-bouteille-en-verre-vert-olive-d105cm-h85cm-p-image-121017-grande_1756712797287.jpg',
      'movement_a281nh-vase-bouteille-en-verre-lavande-d105cm-h85cm-p-image-117041-grande_1756711869707.jpg'
    ];
    
    // URLs Spaces possibles
    const spacesBaseUrls = [
      'https://api-pousse-uploads.ams3.digitaloceanspaces.com/movements/',
      'https://api-pousse-uploads.ams3.cdn.digitaloceanspaces.com/movements/'
    ];
    
    console.log(`🎯 Recherche de ${missingImages.length} images sur Spaces...`);
    console.log('');
    
    let foundCount = 0;
    let downloadedCount = 0;
    
    // Créer les dossiers de destination
    const destDirs = ['./public', '../frontend/dist/public'];
    destDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        try {
          fs.mkdirSync(dir, { recursive: true });
          console.log(`📁 Dossier créé: ${dir}`);
        } catch (e) {
          console.log(`⚠️  Impossible de créer ${dir}: ${e.message}`);
        }
      }
    });
    
    for (const imageName of missingImages) {
      console.log(`\\n🔍 Recherche: ${imageName}`);
      let imageFound = false;
      let workingUrl = null;
      
      // Tester les différentes URLs Spaces
      for (const baseUrl of spacesBaseUrls) {
        const testUrl = baseUrl + imageName;
        console.log(`   🌐 Test: ${testUrl}`);
        
        try {
          // Test avec HEAD request pour vérifier existence
          const exists = await new Promise((resolve) => {
            const req = https.request(testUrl, { method: 'HEAD' }, (res) => {
              console.log(`     📊 Status: ${res.statusCode} | Size: ${res.headers['content-length'] || 'unknown'}`);
              resolve(res.statusCode === 200);
            });
            
            req.on('error', (err) => {
              console.log(`     ❌ Erreur: ${err.message}`);
              resolve(false);
            });
            
            req.setTimeout(10000, () => {
              console.log(`     ⏰ Timeout`);
              req.destroy();
              resolve(false);
            });
            
            req.end();
          });
          
          if (exists) {
            console.log(`   ✅ Image trouvée sur Spaces !`);
            workingUrl = testUrl;
            imageFound = true;
            foundCount++;
            break;
          }
        } catch (error) {
          console.log(`     ❌ Erreur test: ${error.message}`);
        }
      }
      
      if (imageFound && workingUrl) {
        console.log(`   📥 Téléchargement depuis: ${workingUrl}`);
        
        try {
          // Télécharger l'image
          const imageBuffer = await new Promise((resolve, reject) => {
            https.get(workingUrl, (res) => {
              if (res.statusCode !== 200) {
                reject(new Error(`HTTP ${res.statusCode}`));
                return;
              }
              
              const data = [];
              res.on('data', chunk => data.push(chunk));
              res.on('end', () => resolve(Buffer.concat(data)));
            }).on('error', reject);
          });
          
          console.log(`   💾 Image téléchargée (${(imageBuffer.length / 1024).toFixed(1)}KB)`);
          
          // Sauvegarder dans les dossiers de destination
          let savedCount = 0;
          for (const destDir of destDirs) {
            try {
              const destPath = path.join(destDir, imageName);
              fs.writeFileSync(destPath, imageBuffer);
              console.log(`     ✅ Sauvegardé dans: ${destDir}`);
              savedCount++;
            } catch (e) {
              console.log(`     ❌ Erreur sauvegarde ${destDir}: ${e.message}`);
            }
          }
          
          if (savedCount > 0) {
            downloadedCount++;
          }
          
        } catch (error) {
          console.log(`   ❌ Erreur téléchargement: ${error.message}`);
        }
      } else {
        console.log(`   ❌ Image non trouvée sur Spaces`);
      }
    }
    
    console.log('\\n📊 RÉSULTATS FINAUX:');
    console.log('='.repeat(40));
    console.log(`🔍 Images recherchées: ${missingImages.length}`);
    console.log(`✅ Images trouvées sur Spaces: ${foundCount}`);
    console.log(`💾 Images téléchargées: ${downloadedCount}`);
    console.log(`❌ Images définitivement manquantes: ${missingImages.length - foundCount}`);
    
    if (downloadedCount > 0) {
      console.log('\\n🎉 Images récupérées ! Il faut maintenant redéployer pour les rendre accessibles en production.');
    }
    
    if (foundCount < missingImages.length) {
      console.log('\\n⚠️  Certaines images sont définitivement perdues et doivent être re-uploadées manuellement.');
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Lancer la recherche
downloadMissingImages();