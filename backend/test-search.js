require('dotenv').config();
const mongoose = require('mongoose');
const NieuwkoopItem = require('./models/nieuwkoopItemModel');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  // Simuler la fonction getNieuwkoopItems
  const search = 'Argento';
  let query = {
    $or: [
      { 'availability.isActive': true },
      { 'availability.isActive': { $exists: false } }
    ]
  };
  
  if (search && search.length >= 2) {
    query = {
      ...query,
      $and: [
        {
          $or: [
            { 'availability.isActive': true },
            { 'availability.isActive': { $exists: false } }
          ]
        },
        {
          $or: [
            { reference: new RegExp(search, 'i') },
            { name: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
            { tags: new RegExp(search, 'i') }
          ]
        }
      ]
    };
  }
  
  const items = await NieuwkoopItem.find(query).limit(3).lean();
  
  console.log(`\n🔍 Recherche: "${search}"`);
  console.log(`📦 ${items.length} résultats trouvés\n`);
  
  const transformedItems = items.map(item => {
    const stockQuantity = item.stock?.quantity || item.quantity || 0;
    const reservedQuantity = item.stock?.reservedQuantity || item.reservedQuantity || 0;
    const availableQuantity = Math.max(0, stockQuantity - reservedQuantity);
    
    console.log(`\n${item.reference} - ${item.name}:`);
    console.log(`  Stock brut:`, item.stock);
    console.log(`  Stock calculé: Total=${stockQuantity}, Réservé=${reservedQuantity}, Disponible=${availableQuantity}`);
    
    return {
      reference: item.reference,
      name: item.name,
      stockQuantity,
      reservedQuantity,
      availableQuantity,
      price: item.price || item.pricing?.price || 0,
      height: item.height || item.dimensions?.height || 0,
      diameter: item.diameter || item.dimensions?.diameter || 0
    };
  });
  
  console.log('\n✅ Résultats transformés:', JSON.stringify(transformedItems, null, 2));
  mongoose.connection.close();
}).catch(err => {
  console.error('Erreur:', err);
  process.exit(1);
});