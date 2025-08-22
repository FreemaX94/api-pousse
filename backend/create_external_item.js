const mongoose = require('mongoose');
require('dotenv').config();

async function createExternalTest() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connecté à MongoDB');
    
    const NieuwkoopItem = require('./src/domains/catalog/models/nieuwkoopItemModel');
    
    // Créer un article externe de test
    const testExternal = await NieuwkoopItem.create({
      reference: 'EXT-TEST-12345',
      name: 'Test Article Externe',
      description: 'Article externe créé pour test',
      category: 'externe',
      pricing: {
        price: 25.50,
        currency: 'EUR'
      },
      stock: {
        quantity: 5,
        reservedQuantity: 0,
        minimumAlert: 1
      },
      metadata: {
        isExternal: true,
        source: 'external'
      },
      availability: {
        status: 'available',
        isActive: true
      },
      supplier: {
        name: 'Externe',
        code: 'EXT'
      }
    });
    
    console.log('✅ Article externe de test créé:', testExternal.reference);
    
    // Vérifier que l'article est bien dans la base
    const allExternal = await NieuwkoopItem.find({ 'metadata.isExternal': true });
    console.log(`📦 ${allExternal.length} articles externes trouvés dans la base:`);
    allExternal.forEach(item => {
      console.log(`- ${item.reference}: ${item.name} (${item.stock.quantity} unités)`);
    });
    
    mongoose.disconnect();
    
  } catch (err) {
    console.error('❌ Erreur:', err);
    process.exit(1);
  }
}

createExternalTest();