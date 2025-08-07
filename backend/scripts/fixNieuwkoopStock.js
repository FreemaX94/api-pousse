const mongoose = require('mongoose');
const NieuwkoopItem = require('../models/nieuwkoopItemModel');
require('dotenv').config();

async function fixNieuwkoopStock() {
  try {
    // Connecter à la base de données
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apiPousse');
    console.log('✅ Connecté à MongoDB');

    // Trouver l'article "Chamaerops humilis"
    const item = await NieuwkoopItem.findOne({ name: 'Chamaerops humilis' });
    
    if (!item) {
      console.log('❌ Article "Chamaerops humilis" non trouvé');
      return;
    }

    console.log('🔍 Article trouvé:', item.name);
    console.log('📦 Anciennes valeurs:');
    console.log('- height:', item.height);
    console.log('- diameter:', item.diameter);
    console.log('- price:', item.price);
    console.log('- quantity:', item.quantity);

    // Mettre à jour avec les bonnes valeurs
    const updates = {
      $set: {
        'dimensions.height': item.height || 90,
        'dimensions.diameter': item.diameter || 28,
        'pricing.price': item.price || 32.12,
        'stock.quantity': item.quantity || 1,
        'stock.reservedQuantity': item.reservedQuantity || 0,
        'images': item.image ? [{
          url: item.image,
          isPrimary: true
        }] : []
      },
      $unset: {
        'height': 1,
        'diameter': 1,
        'price': 1,
        'quantity': 1,
        'reservedQuantity': 1,
        'image': 1,
        'note': 1
      }
    };

    await NieuwkoopItem.findByIdAndUpdate(item._id, updates);
    console.log('✅ Article mis à jour');

    // Vérifier la mise à jour
    const updatedItem = await NieuwkoopItem.findById(item._id);
    console.log('\n📊 Nouvelles valeurs:');
    console.log('- stock.quantity:', updatedItem.stock?.quantity);
    console.log('- pricing.price:', updatedItem.pricing?.price);
    console.log('- dimensions.height:', updatedItem.dimensions?.height);
    console.log('- dimensions.diameter:', updatedItem.dimensions?.diameter);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
}

fixNieuwkoopStock();