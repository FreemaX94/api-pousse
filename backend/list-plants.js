const mongoose = require('mongoose');
require('dotenv').config();

async function listPlants() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-pousse';
    console.log('🔗 Connexion à:', mongoUri.replace(/\/\/.*@/, '//*****@')); // Masquer le mot de passe
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion MongoDB réussie');
    
    const NieuwkoopItem = require('./src/domains/catalog/models/nieuwkoopItemModel');
    const items = await NieuwkoopItem.find({}).lean();
    
    console.log('\n🌿 ANALYSE COMPLÈTE DU STOCK');
    console.log('='.repeat(60));
    console.log(`📦 Total articles: ${items.length}`);
    console.log('');
    
    let plantCount = 0;
    const plantTypes = {};
    
    items.forEach((item, i) => {
      const name = (item.name || '').toLowerCase();
      
      // Identifier les non-plantes
      const nonPlantKeywords = ['pot', 'bac', 'terreau', 'substrat', 'outil', 'sécateur', 'arrosoir', 'engrais', 'fertilisant'];
      const isNonPlant = nonPlantKeywords.some(keyword => name.includes(keyword));
      
      if (!isNonPlant) {
        plantCount++;
        
        // Classifier le type
        let type = 'autre';
        if (name.includes('dypsis') || name.includes('areca') || name.includes('palmier')) type = 'palmier';
        else if (name.includes('ficus')) type = 'ficus';  
        else if (name.includes('cactus') || name.includes('aloe')) type = 'cactus';
        else if (name.includes('orchidee')) type = 'orchidee';
        else if (name.includes('monstera') || name.includes('philodendron')) type = 'plante_verte';
        else if (name.includes('begonia') || name.includes('geranium')) type = 'plante_fleurie';
        else if (name.includes('fougere')) type = 'fougere';
        else if (name.includes('basilic') || name.includes('thym')) type = 'aromate';
        else if (name.includes('sansevieria')) type = 'plante_grasse';
        else if (item.category === 'plante') type = 'plante_verte';
        else if (item.category === 'floral') type = 'plante_fleurie';
        
        plantTypes[type] = (plantTypes[type] || 0) + 1;
        
        const diameter = item.dimensions?.diameter || item.diameter || 'N/A';
        const height = item.dimensions?.height || item.height || 'N/A';
        const stock = item.stock?.quantity || 0;
        
        console.log(`${(i+1).toString().padStart(3)}. [${type.toUpperCase().padEnd(12)}] ${item.reference}`);
        console.log(`     ${item.name}`);
        console.log(`     📏 D:${diameter}cm H:${height}cm | 📦 Stock:${stock}`);
        console.log('');
      }
    });
    
    console.log('📊 RÉSUMÉ:');
    console.log(`🌱 Plantes: ${plantCount}`);
    console.log(`🛠️  Autres: ${items.length - plantCount}`);
    console.log('');
    console.log('🌿 TYPES DE PLANTES:');
    Object.entries(plantTypes).sort(([,a], [,b]) => b - a).forEach(([type, count]) => {
      console.log(`   ${type.padEnd(15)}: ${count}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  process.exit(0);
}

listPlants();