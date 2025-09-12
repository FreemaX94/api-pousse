const mongoose = require('mongoose');
require('dotenv').config();

async function checkAllImages() {
  try {
    console.log('🔍 VÉRIFICATION DE TOUTES LES IMAGES');
    console.log('='.repeat(50));
    
    // Connexion MongoDB Atlas
    const mongoUri = process.env.MONGODB_URI;
    console.log('🔗 Connexion à MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion MongoDB réussie');
    
    // Import du modèle
    const NieuwkoopItem = require('./src/domains/catalog/models/nieuwkoopItemModel');
    
    // Récupération de TOUS les articles avec images
    console.log('📦 Récupération de tous les articles avec images...');
    const items = await NieuwkoopItem.find({
      'images.0': { $exists: true } // Au moins une image dans l'array
    }).lean();
    
    console.log(`📸 ${items.length} articles avec images trouvés`);
    console.log('');
    
    let spacesCount = 0;
    let localCount = 0;
    let otherCount = 0;
    let localProblematic = [];
    
    items.forEach((item, index) => {
      console.log(`[${index + 1}/${items.length}] ${item.reference}`);
      console.log(`   📝 ${item.name}`);
      
      // Traiter chaque image de l'article
      if (item.images && item.images.length > 0) {
        item.images.forEach((image, imgIndex) => {
          const imageUrl = image.url;
          console.log(`   🔗 Image ${imgIndex + 1}: ${imageUrl}`);
          
          const isSpaces = imageUrl.includes('digitaloceanspaces.com');
          const isLocal = imageUrl.includes('/api/catalog/nieuwkoop/movement-image/') || 
                         imageUrl.includes('/movement-image/');
          
          if (isSpaces) {
            console.log('     ☁️  Type: SPACES (OK)');
            spacesCount++;
          } else if (isLocal) {
            console.log('     🏠 Type: LOCALE (PROBLÉMATIQUE)');
            localCount++;
            localProblematic.push({
              reference: item.reference,
              name: item.name,
              imageUrl: imageUrl
            });
          } else {
            console.log('     ❓ Type: AUTRE');
            otherCount++;
          }
        });
      }
      
      console.log('');
    });
    
    console.log('📊 RÉSUMÉ DÉTAILLÉ:');
    console.log('='.repeat(40));
    console.log(`☁️  Images sur Spaces (OK): ${spacesCount}`);
    console.log(`🏠 Images locales (404 en prod): ${localCount}`);
    console.log(`❓ Autres types: ${otherCount}`);
    console.log('');
    
    if (localProblematic.length > 0) {
      console.log('🚨 ARTICLES AVEC IMAGES LOCALES PROBLÉMATIQUES:');
      console.log('-'.repeat(50));
      localProblematic.forEach((item, i) => {
        console.log(`${i + 1}. ${item.reference} - ${item.name}`);
        console.log(`   URL: ${item.imageUrl}`);
        
        // Extraire le nom de fichier pour voir s'il existe sur Spaces
        let filename = '';
        if (item.imageUrl.includes('/movement-image/')) {
          filename = item.imageUrl.split('/movement-image/')[1];
          const spacesUrl = `https://api-pousse-uploads.ams3.cdn.digitaloceanspaces.com/movements/${filename}`;
          console.log(`   📤 Spaces équivalent: ${spacesUrl}`);
        }
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

// Lancer la vérification
checkAllImages();