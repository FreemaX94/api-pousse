const mongoose = require('mongoose');
require('dotenv').config();

async function checkMovements() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connecté à MongoDB');
    
    // Charger le modèle Movement
    const Movement = require('./src/domains/inventory/models/movementModel');
    
    // Récupérer les derniers mouvements
    const movements = await Movement.find().sort({ createdAt: -1 }).limit(5);
    
    console.log('📝 Derniers mouvements:');
    movements.forEach(m => {
      console.log(`- ${m.type} | ${m.reference} | ${m.name} | ${m.quantity} | ${m.createdAt.toISOString()}`);
    });
    
    // Chercher spécifiquement Terra cotta
    const terraCotta = await Movement.find({ name: /terra cotta/i }).sort({ createdAt: -1 });
    
    console.log('\n🏺 Mouvements Terra Cotta:');
    terraCotta.forEach(m => {
      console.log(`- ${m.type} | ${m.reference} | ${m.name} | ${m.quantity} | ${m.price} | ${m.createdAt.toISOString()}`);
    });
    
    // Chercher par référence EXT
    const extMovements = await Movement.find({ reference: /^EXT-/ }).sort({ createdAt: -1 }).limit(3);
    
    console.log('\n🆔 Mouvements externes (EXT-):');
    extMovements.forEach(m => {
      console.log(`- ${m.type} | ${m.reference} | ${m.name} | ${m.quantity} | ${m.price} | ${m.createdAt.toISOString()}`);
    });
    
    mongoose.disconnect();
    
  } catch (err) {
    console.error('❌ Erreur:', err);
    process.exit(1);
  }
}

checkMovements();