const mongoose = require('mongoose');
const config = require('../config/config');
const NieuwkoopItem = require('../models/nieuwkoopItemModel');

async function migrateToOrderField() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connecté à MongoDB');

    // Compter les articles sans le champ toOrder
    const itemsWithoutToOrder = await NieuwkoopItem.countDocuments({
      'stock.toOrder': { $exists: false }
    });

    console.log(`📊 Articles sans champ toOrder: ${itemsWithoutToOrder}`);

    if (itemsWithoutToOrder === 0) {
      console.log('✅ Tous les articles ont déjà le champ toOrder');
      return;
    }

    // Ajouter le champ toOrder: 0 à tous les articles qui n'en ont pas
    const result = await NieuwkoopItem.updateMany(
      { 'stock.toOrder': { $exists: false } },
      { $set: { 'stock.toOrder': 0 } }
    );

    console.log(`✅ Migration terminée: ${result.modifiedCount} articles mis à jour`);

    // Vérification
    const verification = await NieuwkoopItem.countDocuments({
      'stock.toOrder': { $exists: false }
    });

    if (verification === 0) {
      console.log('✅ Vérification réussie: tous les articles ont le champ toOrder');
    } else {
      console.log(`❌ Erreur: ${verification} articles n'ont toujours pas le champ toOrder`);
    }

  } catch (error) {
    console.error('❌ Erreur de migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter la migration
migrateToOrderField();