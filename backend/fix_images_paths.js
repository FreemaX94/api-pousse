const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function fixImagesPaths() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connecté à MongoDB');
    
    const NieuwkoopItem = require('./src/domains/catalog/models/nieuwkoopItemModel');
    
    // Créer le dossier public/movements s'il n'existe pas
    const publicMovementsDir = path.join(__dirname, 'public', 'movements');
    if (!fs.existsSync(publicMovementsDir)) {
      fs.mkdirSync(publicMovementsDir, { recursive: true });
      console.log('📁 Dossier public/movements créé');
    }
    
    // Chercher les articles externes avec des images
    const externalItems = await NieuwkoopItem.find({ 
      'metadata.isExternal': true,
      'images.0': { $exists: true }
    });
    
    console.log(`🔍 ${externalItems.length} articles externes avec images trouvés`);
    
    for (const item of externalItems) {
      let updated = false;
      
      for (let i = 0; i < item.images.length; i++) {
        const image = item.images[i];
        console.log(`📷 Image actuelle: ${image.url}`);
        
        // Si l'image commence par /movements/, on doit la déplacer et corriger le chemin
        if (image.url.startsWith('/movements/')) {
          const filename = path.basename(image.url);
          const oldPath = path.join(__dirname, 'src', 'public', 'movements', filename);
          const newPath = path.join(publicMovementsDir, filename);
          
          // Déplacer le fichier s'il existe
          if (fs.existsSync(oldPath)) {
            fs.copyFileSync(oldPath, newPath);
            console.log(`📦 Image déplacée: ${filename}`);
          }
          
          // Mettre à jour le chemin dans la base (garder le même chemin, juste déplacer le fichier)
          console.log(`✅ Chemin image OK: ${image.url}`);
        }
      }
    }
    
    console.log('✅ Correction des chemins d\'images terminée');
    mongoose.disconnect();
    
  } catch (err) {
    console.error('❌ Erreur:', err);
    process.exit(1);
  }
}

fixImagesPaths();