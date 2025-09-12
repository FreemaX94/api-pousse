const fs = require('fs');
const path = require('path');

async function fixMovementImages() {
  try {
    console.log('🔧 RÉPARATION DES IMAGES MOVEMENT_');
    console.log('='.repeat(50));
    
    // Images problématiques from browser logs
    const problematicImages = [
      'movement_nm-000305-vase-medicis-en-ceramique-blanc-brillant-d26cm-h35cm-p-image-121414-grande_1756727939829.jpg',
      'movement_j6-000011-vase-en-ceramique-vert-olive-d235cm-h20cm-p-image-120924-grande_1756728028161.jpg',
      'movement_IMG_9703_1756728131834.jpg',
      'movement_Capture_da_A_cranA_2025-08-21_A_08_49_16_1757358645488.jpeg',
      'movement_nm-000308-vase-medicis-en-ceramique-blanc-brillant-d31cm-h23cm-p-image-121417-grande_1756728465219.jpg',
      'movement_nm-000304-vase-medicis-en-ceramique-blanc-brillant-d22cm-h295cm-p-image-121413-grande_1756728252297.jpg',
      'movement_Capture_da_A_cranA_2025-08-21_A_08_49_16_1757283402328.jpeg',
      'movement_nm-000303-vase-medicis-en-ceramique-blanc-brillant-d195cm-h255cm-p-image-121412-grande_1756728198183.jpg',
      'movement_j6-000009-vase-en-ceramique-creme-d235cm-h20cm-p-image-120925-grande_1756728072939.jpg',
      'movement_a301w3-vase-en-verre-strie-violet-d13cm-h13cm-p-image-115687-grande_1756727883181.jpg',
      'movement_a075p5-vase-en-verre-fume-noir-d16cm-h195cm-p-image-119631-grande_1756710777583.jpg',
      'movement_nm-000306-vase-medicis-en-ceramique-blanc-brillant-d20cm-h16cm-p-image-121415-grande_1756728339575.jpg',
      'movement_b138dq-vase-en-verre-d13cm-h115cm-p-image-111958-grande_1756727837832.jpg',
      'movement_a249nh-vase-en-verre-strie-gris-d95cm-h25cm-p-image-113463-grande_1756710715711.jpg',
      'movement_IMG_9708_1756727781693.jpg',
      'movement_a268nh-vase-bouteille-en-verre-bleu-d7cm-h12cm-p-image-115653-grande_1756712936113.jpg',
      'movement_a010ih-vase-bouteille-en-verre-rouge-d7cm-h12cm-p-image-117030-grande_1756712969718.jpg',
      'movement_IMG_9711_1756727682723.jpg',
      'movement_j6-000046-vase-en-ceramique-bleu-fonce-d10cm-h18cm-p-image-120736-grande_1756710591864.jpg',
      'movement_a009ih-vase-bouteille-en-verre-rouge-d65cm-h11cm-p-image-117031-grande_1756713003196.jpg',
      'movement_a279nh-vase-bouteille-en-verre-bleu-fonce-d105cm-h85cm-p-image-117040-grande_1756711799863.jpg',
      'movement_jo-000021-vase-bouteille-en-verre-vert-olive-d6cm-h10cm-p-image-121032-grande_1756711722633.jpg',
      'movement_a264nh-vase-bouteille-en-verre-bleu-d65cm-h11cm-p-image-115654-grande_1756712873060.jpg',
      'movement_a275nh-vase-bouteille-en-verre-violet-d6cm-h10cm-p-image-117034-grande_1756711535493.jpg',
      'movement_jo-000003-vase-bouteille-en-verre-vert-olive-d105cm-h85cm-p-image-121017-grande_1756712797287.jpg',
      'movement_a266nh-vase-bouteille-en-verre-bleu-d105cm-h85cm-p-image-115655-grande_1756711838232.jpg',
      'movement_IMG_9715_1756728560843.jpg',
      'movement_a281nh-vase-bouteille-en-verre-lavande-d105cm-h85cm-p-image-117041-grande_1756711869707.jpg',
      'movement_IMG_9707_1756727745643.jpg',
      'movement_a280nh-vase-bouteille-en-verre-bordeaux-d105cm-h85cm-p-image-117042-grande_1756712822523.jpg',
      'movement_IMG_9710_1756727960926.jpg',
      'movement_j6-000039-vase-en-ceramique-framboise-d12cm-h23cm-p-image-120739-grande_1756710438008.jpg',
      'movement_jo-000004-vase-bouteille-en-verre-transparent-d9cm-h7cm-p-image-121014-grande_1756727928666.jpg'
    ];
    
    console.log(`🔍 Recherche de ${problematicImages.length} images problématiques...`);
    
    // Dossiers à scanner
    const searchDirs = [
      './uploads/movements',
      './uploads', 
      '../frontend/dist',
      '../frontend/dist/assets',
      './public',
      './dist'
    ];
    
    let foundImages = [];
    let missingImages = [];
    
    for (const imageName of problematicImages) {
      console.log(`\n📸 Recherche: ${imageName}`);
      let found = false;
      
      for (const dir of searchDirs) {
        if (!fs.existsSync(dir)) {
          console.log(`   📂 Dossier ${dir} n'existe pas`);
          continue;
        }
        
        const imagePath = path.join(dir, imageName);
        if (fs.existsSync(imagePath)) {
          const stats = fs.statSync(imagePath);
          console.log(`   ✅ Trouvé dans ${dir} (${(stats.size / 1024).toFixed(1)}KB)`);
          foundImages.push({
            name: imageName,
            path: imagePath,
            size: stats.size,
            dir: dir
          });
          found = true;
          break;
        }
      }
      
      if (!found) {
        console.log(`   ❌ Non trouvé`);
        missingImages.push(imageName);
      }
    }
    
    console.log('\n📊 RÉSULTATS:');
    console.log('='.repeat(30));
    console.log(`✅ Images trouvées: ${foundImages.length}`);
    console.log(`❌ Images manquantes: ${missingImages.length}`);
    
    if (foundImages.length > 0) {
      console.log('\n🎯 PLAN DE RÉPARATION:');
      console.log('1. Copier les images trouvées vers backend/public/');
      console.log('2. Copier vers frontend/dist/public/ si nécessaire');
      console.log('3. Tester l\'accessibilité en production');
      
      // Créer les dossiers de destination
      const destDirs = ['./public', './dist', '../frontend/dist/public'];
      destDirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
          try {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`📁 Dossier créé: ${dir}`);
          } catch (e) {
            console.log(`❌ Impossible de créer ${dir}: ${e.message}`);
          }
        }
      });
      
      console.log('\n🔄 COPIE DES IMAGES:');
      let copiedCount = 0;
      
      for (const image of foundImages) {
        console.log(`\n📸 ${image.name}`);
        
        // Copier vers backend/public
        try {
          const destPath1 = path.join('./public', image.name);
          fs.copyFileSync(image.path, destPath1);
          console.log(`   ✅ Copié vers backend/public/`);
          copiedCount++;
        } catch (e) {
          console.log(`   ❌ Erreur copie backend: ${e.message}`);
        }
        
        // Copier vers frontend/dist/public si le dossier existe
        try {
          const frontendPublic = '../frontend/dist/public';
          if (fs.existsSync('../frontend/dist')) {
            const destPath2 = path.join(frontendPublic, image.name);
            fs.copyFileSync(image.path, destPath2);
            console.log(`   ✅ Copié vers frontend/dist/public/`);
          }
        } catch (e) {
          console.log(`   ⚠️  Copie frontend ignorée: ${e.message}`);
        }
      }
      
      console.log(`\n🎉 ${copiedCount} images copiées avec succès !`);
      console.log('Les vases devraient maintenant s\'afficher en production.');
    }
    
    if (missingImages.length > 0) {
      console.log('\n⚠️  IMAGES MANQUANTES:');
      missingImages.forEach(img => console.log(`   - ${img}`));
      console.log('\nCes images doivent être récupérées depuis DigitalOcean Spaces ou re-uploadées.');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Lancer la réparation
fixMovementImages();