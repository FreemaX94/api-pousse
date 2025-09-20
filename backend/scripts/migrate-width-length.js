const mongoose = require('mongoose');
const config = require('../config/config');

// Charger le modèle NieuwkoopItem
const NieuwkoopItem = require('../src/domains/catalog/models/nieuwkoopItemModel');

async function migrateWidthLength() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(config.mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    });
    console.log('✅ Connecté à MongoDB');

    console.log('🔄 Recherche des articles sans width/length...');

    // Compter les articles qui n'ont pas de dimensions.width ou dimensions.length
    const itemsWithoutWidth = await NieuwkoopItem.countDocuments({
      'dimensions.width': { $exists: false }
    });

    const itemsWithoutLength = await NieuwkoopItem.countDocuments({
      'dimensions.length': { $exists: false }
    });

    console.log(`📊 Articles sans width: ${itemsWithoutWidth}`);
    console.log(`📊 Articles sans length: ${itemsWithoutLength}`);

    if (itemsWithoutWidth === 0 && itemsWithoutLength === 0) {
      console.log('✅ Tous les articles ont déjà width et length - aucune migration nécessaire');
      return;
    }

    console.log('🔄 Ajout des champs width et length manquants...');

    // Mettre à jour tous les articles qui n'ont pas de width
    const resultWidth = await NieuwkoopItem.updateMany(
      { 'dimensions.width': { $exists: false } },
      {
        $set: {
          'dimensions.width': 0,
          'width': 0
        }
      }
    );

    // Mettre à jour tous les articles qui n'ont pas de length
    const resultLength = await NieuwkoopItem.updateMany(
      { 'dimensions.length': { $exists: false } },
      {
        $set: {
          'dimensions.length': 0,
          'length': 0
        }
      }
    );

    console.log(`✅ Width ajouté à ${resultWidth.modifiedCount} articles`);
    console.log(`✅ Length ajouté à ${resultLength.modifiedCount} articles`);

    // Vérification finale
    const totalItems = await NieuwkoopItem.countDocuments();
    const itemsWithWidth = await NieuwkoopItem.countDocuments({
      'dimensions.width': { $exists: true }
    });
    const itemsWithLength = await NieuwkoopItem.countDocuments({
      'dimensions.length': { $exists: true }
    });

    console.log(`📊 Total articles: ${totalItems}`);
    console.log(`📊 Articles avec width: ${itemsWithWidth}`);
    console.log(`📊 Articles avec length: ${itemsWithLength}`);

    if (itemsWithWidth === totalItems && itemsWithLength === totalItems) {
      console.log('✅ Migration réussie ! Tous les articles ont maintenant width et length');
    } else {
      console.log('⚠️ Quelques articles n\'ont pas été migrés');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée');
  }
}

// Exécuter la migration si le script est appelé directement
if (require.main === module) {
  migrateWidthLength()
    .then(() => {
      console.log('🎉 Migration terminée');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = migrateWidthLength;