const mongoose = require('mongoose');
const NieuwkoopItem = require('../models/nieuwkoopItemModel');
require('dotenv').config();

async function debugNieuwkoopStock() {
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
    console.log('📦 Données complètes:', JSON.stringify(item, null, 2));

    // Vérifier les anciennes propriétés
    console.log('\n📋 Vérification des propriétés:');
    console.log('- item.quantity:', item.quantity);
    console.log('- item.price:', item.price);
    console.log('- item.stock?.quantity:', item.stock?.quantity);
    console.log('- item.pricing?.price:', item.pricing?.price);
    console.log('- item.reservedQuantity:', item.reservedQuantity);
    console.log('- item.stock?.reservedQuantity:', item.stock?.reservedQuantity);

    // Mettre à jour manuellement si nécessaire
    if (item.stock?.quantity === 0 || item.stock?.quantity === undefined) {
      console.log('\n🔧 Mise à jour manuelle du stock...');
      item.stock = item.stock || {};
      item.stock.quantity = 1; // Définir un stock de 1
      await item.save();
      console.log('✅ Stock mis à jour à 1');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
}

debugNieuwkoopStock();