const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function fixTerraCottaImage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
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
    console.log('📷 URL image actuelle:', terraCotta.images[0]?.url);
    
    // Chemin actuel du fichier avec caractères spéciaux
    const currentImageUrl = terraCotta.images[0]?.url;
    const currentFilename = path.basename(currentImageUrl);
    const currentPath = path.join(__dirname, 'public', 'movements', currentFilename);
    
    // Nouveau nom de fichier simplifié
    const newFilename = `terra_cotta_emaille_${Date.now()}.jpeg`;
    const newPath = path.join(__dirname, 'public', 'movements', newFilename);
    const newUrl = `/movements/${newFilename}`;
    
    console.log('📂 Fichier actuel:', currentPath);
    console.log('📂 Nouveau fichier:', newPath);
    console.log('🔗 Nouvelle URL:', newUrl);
    
    // Vérifier si le fichier actuel existe
    if (fs.existsSync(currentPath)) {
      console.log('✅ Fichier actuel trouvé');
      
      // Copier vers le nouveau nom
      fs.copyFileSync(currentPath, newPath);
      console.log('📦 Fichier copié avec nouveau nom');
      
      // Mettre à jour l'URL dans la base de données
      terraCotta.images[0].url = newUrl;
      await terraCotta.save();
      
      console.log('✅ URL mise à jour dans la base de données');
      
      // Supprimer l'ancien fichier
      fs.unlinkSync(currentPath);
      console.log('🗑️ Ancien fichier supprimé');
      
    } else {
      console.log('❌ Fichier actuel non trouvé à:', currentPath);
    }
    
    // Afficher l'état final
    const updatedItem = await NieuwkoopItem.findById(terraCotta._id);
    console.log('📊 État final:');
    console.log('- Référence:', updatedItem.reference);
    console.log('- Nom:', updatedItem.name);
    console.log('- URL image:', updatedItem.images[0]?.url);
    console.log('- Fichier existe:', fs.existsSync(path.join(__dirname, 'public', 'movements', path.basename(updatedItem.images[0]?.url))));
    
    mongoose.disconnect();
    
  } catch (err) {
    console.error('❌ Erreur:', err);
    process.exit(1);
  }
}

fixTerraCottaImage();