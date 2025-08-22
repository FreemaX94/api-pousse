const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function updateTerraCotta() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connecté à MongoDB');
    
    const NieuwkoopItem = require('./src/domains/catalog/models/nieuwkoopItemModel');
    
    // Trouver le Terra cotta emaillé
    const terraCotta = await NieuwkoopItem.findOne({ 
      name: /terra cotta emaillé/i,
      'metadata.isExternal': true
    });
    
    if (!terraCotta) {
      console.log('❌ Terra cotta emaillé non trouvé');
      return;
    }
    
    console.log('🔍 Terra cotta trouvé:', terraCotta.reference);
    console.log('📷 Images actuelles:', terraCotta.images);
    
    // Vérifier si l'image existe physiquement
    if (terraCotta.images && terraCotta.images.length > 0) {
      const imageUrl = terraCotta.images[0].url;
      const imageName = path.basename(imageUrl);
      
      // Vérifier dans l'ancien emplacement
      const oldPath = path.join(__dirname, 'src', 'public', 'movements', imageName);
      const newPath = path.join(__dirname, 'public', 'movements', imageName);
      
      console.log('🔍 Vérification fichier image:');
      console.log('- Ancien chemin:', oldPath, '- Existe:', fs.existsSync(oldPath));
      console.log('- Nouveau chemin:', newPath, '- Existe:', fs.existsSync(newPath));
      
      // Copier l'image si elle existe dans l'ancien emplacement
      if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
        // Créer le dossier de destination s'il n'existe pas
        const publicMovementsDir = path.dirname(newPath);
        if (!fs.existsSync(publicMovementsDir)) {
          fs.mkdirSync(publicMovementsDir, { recursive: true });
          console.log('📁 Dossier public/movements créé');
        }
        
        fs.copyFileSync(oldPath, newPath);
        console.log('📦 Image copiée vers le bon emplacement');
      }
    }
    
    // Mettre à jour les dimensions
    const updatedItem = await NieuwkoopItem.findByIdAndUpdate(
      terraCotta._id,
      {
        $set: {
          'dimensions.height': 30,
          'dimensions.diameter': 33,
          'dimensions.unit': 'cm'
        }
      },
      { new: true }
    );
    
    console.log('✅ Dimensions mises à jour:');
    console.log('- Hauteur:', updatedItem.dimensions.height, 'cm');
    console.log('- Diamètre:', updatedItem.dimensions.diameter, 'cm');
    
    // Afficher l'état final
    console.log('📊 État final du Terra cotta emaillé:');
    console.log('- Référence:', updatedItem.reference);
    console.log('- Nom:', updatedItem.name);
    console.log('- Prix:', updatedItem.pricing.price, '€');
    console.log('- Stock:', updatedItem.stock.quantity);
    console.log('- Hauteur:', updatedItem.dimensions.height, 'cm');
    console.log('- Diamètre:', updatedItem.dimensions.diameter, 'cm');
    console.log('- Images:', updatedItem.images.length);
    
    mongoose.disconnect();
    
  } catch (err) {
    console.error('❌ Erreur:', err);
    process.exit(1);
  }
}

updateTerraCotta();