const mongoose = require('mongoose');
require('dotenv').config();

async function convertTerraCotta() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connecté à MongoDB');
    
    const Movement = require('./src/domains/inventory/models/movementModel');
    const NieuwkoopItem = require('./src/domains/catalog/models/nieuwkoopItemModel');
    
    // Trouver le mouvement Terra cotta emaillé
    const terraCottaMovement = await Movement.findOne({ 
      name: /terra cotta emaillé/i,
      reference: /^EXT-/
    }).sort({ createdAt: -1 });
    
    if (!terraCottaMovement) {
      console.log('❌ Mouvement Terra cotta emaillé non trouvé');
      return;
    }
    
    console.log('🔍 Mouvement trouvé:', terraCottaMovement.reference, terraCottaMovement.name);
    
    // Vérifier si l'article existe déjà dans le catalogue
    const existingItem = await NieuwkoopItem.findOne({ 
      reference: terraCottaMovement.reference 
    });
    
    if (existingItem) {
      console.log('✅ Article déjà présent dans le catalogue:', existingItem.reference);
    } else {
      // Créer l'article dans le catalogue
      const newItem = await NieuwkoopItem.create({
        reference: terraCottaMovement.reference,
        name: terraCottaMovement.name,
        description: `Article externe: ${terraCottaMovement.name}`,
        category: 'externe',
        pricing: {
          price: terraCottaMovement.price || 0,
          currency: 'EUR'
        },
        stock: {
          quantity: terraCottaMovement.quantity,
          reservedQuantity: 0,
          minimumAlert: 0
        },
        images: terraCottaMovement.image ? [{
          url: terraCottaMovement.image,
          isPrimary: true,
          alt: terraCottaMovement.name
        }] : [],
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
      
      console.log('✅ Article créé dans le catalogue:', newItem.reference);
    }
    
    // Vérifier tous les articles externes
    const allExternal = await NieuwkoopItem.find({ 'metadata.isExternal': true });
    console.log(`📦 ${allExternal.length} articles externes dans le catalogue:`);
    allExternal.forEach(item => {
      console.log(`- ${item.reference}: ${item.name} (${item.stock.quantity} unités)`);
    });
    
    mongoose.disconnect();
    
  } catch (err) {
    console.error('❌ Erreur:', err);
    process.exit(1);
  }
}

convertTerraCotta();