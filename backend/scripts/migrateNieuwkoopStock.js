const mongoose = require('mongoose');
const NieuwkoopItem = require('../models/nieuwkoopItemModel');
require('dotenv').config();

async function migrateNieuwkoopStock() {
  try {
    // Connecter à la base de données
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apiPousse');
    console.log('✅ Connecté à MongoDB');

    // Trouver tous les articles Nieuwkoop
    const items = await NieuwkoopItem.find({});
    console.log(`📦 Trouvé ${items.length} articles Nieuwkoop`);

    let migratedCount = 0;

    for (const item of items) {
      let needsUpdate = false;
      const updates = {};

      // Migrer la quantité si elle existe à la racine
      if (item.quantity !== undefined && (!item.stock || item.stock.quantity === undefined)) {
        if (!updates.stock) updates.stock = {};
        updates.stock.quantity = item.quantity;
        needsUpdate = true;
        console.log(`🔄 Migration quantité pour ${item.name}: ${item.quantity} → stock.quantity`);
      }

      // Migrer le prix si il existe à la racine
      if (item.price !== undefined && (!item.pricing || item.pricing.price === undefined)) {
        if (!updates.pricing) updates.pricing = {};
        updates.pricing.price = item.price;
        needsUpdate = true;
        console.log(`💰 Migration prix pour ${item.name}: ${item.price} → pricing.price`);
      }

      // Migrer les dimensions si elles existent à la racine
      if (item.height !== undefined && (!item.dimensions || item.dimensions.height === undefined)) {
        if (!updates.dimensions) updates.dimensions = {};
        updates.dimensions.height = item.height;
        needsUpdate = true;
        console.log(`📏 Migration hauteur pour ${item.name}: ${item.height} → dimensions.height`);
      }

      if (item.diameter !== undefined && (!item.dimensions || item.dimensions.diameter === undefined)) {
        if (!updates.dimensions) updates.dimensions = {};
        updates.dimensions.diameter = item.diameter;
        needsUpdate = true;
        console.log(`📏 Migration diamètre pour ${item.name}: ${item.diameter} → dimensions.diameter`);
      }

      // Migrer l'image si elle existe à la racine
      if (item.image !== undefined && (!item.images || item.images.length === 0)) {
        updates.images = [{
          url: item.image,
          isPrimary: true
        }];
        needsUpdate = true;
        console.log(`🖼️ Migration image pour ${item.name}: ${item.image} → images[0].url`);
      }

      // Migrer les notes si elles existent à la racine
      if (item.note !== undefined && !item.notes) {
        updates.notes = item.note;
        needsUpdate = true;
        console.log(`📝 Migration note pour ${item.name}: ${item.note} → notes`);
      }

      // Appliquer les mises à jour
      if (needsUpdate) {
        await NieuwkoopItem.findByIdAndUpdate(item._id, { $set: updates });
        migratedCount++;
        console.log(`✅ Article migré: ${item.name}`);
      }
    }

    console.log(`\n🎉 Migration terminée! ${migratedCount} articles mis à jour sur ${items.length}`);
    
    // Vérifier les résultats
    const updatedItems = await NieuwkoopItem.find({});
    console.log('\n📊 Résultats de la migration:');
    updatedItems.forEach(item => {
      console.log(`- ${item.name}: stock=${item.stock?.quantity || 0}, prix=${item.pricing?.price || 0}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
}

migrateNieuwkoopStock();