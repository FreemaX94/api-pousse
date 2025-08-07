const mongoose = require('mongoose');
const StockEntry = require('../models/StockEntry');
const { getNextSequenceValue } = require('../models/Counter');
const config = require('../config/config');

const migrateStockIds = async () => {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(config.mongoURI);
    
    console.log('📊 Recherche des entrées de stock sans stockId...');
    const entriesWithoutStockId = await StockEntry.find({ stockId: { $exists: false } });
    
    console.log(`📈 ${entriesWithoutStockId.length} entrées trouvées sans stockId`);
    
    if (entriesWithoutStockId.length === 0) {
      console.log('✅ Toutes les entrées ont déjà un stockId');
      return;
    }
    
    const year = new Date().getFullYear();
    
    for (let i = 0; i < entriesWithoutStockId.length; i++) {
      const entry = entriesWithoutStockId[i];
      
      try {
        const sequenceValue = await getNextSequenceValue('stockEntry');
        const paddedSequence = sequenceValue.toString().padStart(4, '0');
        const stockId = `ST-${year}-${paddedSequence}`;
        
        await StockEntry.findByIdAndUpdate(entry._id, { stockId });
        
        console.log(`✅ ${i + 1}/${entriesWithoutStockId.length} - ID assigné: ${stockId}`);
      } catch (error) {
        console.error(`❌ Erreur pour l'entrée ${entry._id}:`, error.message);
      }
    }
    
    console.log('🎉 Migration terminée avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur pendant la migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Déconnexion de MongoDB');
  }
};

// Exécuter la migration si ce script est appelé directement
if (require.main === module) {
  migrateStockIds();
}

module.exports = migrateStockIds;