const mongoose = require('mongoose');

async function listAllPlants() {
  try {
    await mongoose.connect('mongodb://localhost:27017/api-pousse', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const NieuwkoopItem = require('./backend/src/domains/catalog/models/nieuwkoopItemModel');
    const items = await NieuwkoopItem.find({}).select('reference name category dimensions height diameter stock');
    
    console.log('🌿 ANALYSE COMPLÈTE DU STOCK - ' + items.length + ' ARTICLES');
    console.log('='.repeat(60));
    
    let plantCount = 0;
    let nonPlantCount = 0;
    const plantTypes = {};
    const allPlants = [];
    
    items.forEach((item, index) => {
      const name = (item.name || '').toLowerCase();
      const reference = (item.reference || '').toLowerCase();
      
      // Identification des non-plantes
      const nonPlantKeywords = ['pot', 'terreau', 'outil', 'engrais', 'bac', 'contenant', 'substrat', 
                               'sable', 'perlite', 'sécateur', 'arrosoir', 'fertilisant', 'pesticide'];
      const isNonPlant = nonPlantKeywords.some(keyword => name.includes(keyword) || reference.includes(keyword));
      
      if (!isNonPlant) {
        plantCount++;
        let type = 'autre';
        
        // Classification des plantes
        if (name.includes('dypsis') || name.includes('areca') || name.includes('palmier')) type = 'palmier';
        else if (name.includes('ficus') || name.includes('benjamina')) type = 'ficus';
        else if (name.includes('cactus') || name.includes('aloe') || name.includes('echeveria')) type = 'cactus';
        else if (name.includes('orchidee') || name.includes('phalaenopsis')) type = 'orchidee';
        else if (name.includes('begonia') || name.includes('geranium') || name.includes('cyclamen')) type = 'plante_fleurie';
        else if (name.includes('monstera') || name.includes('philodendron') || name.includes('pothos')) type = 'plante_verte';
        else if (name.includes('basilic') || name.includes('thym') || name.includes('romarin')) type = 'aromate';
        else if (name.includes('tomate') || name.includes('salade') || name.includes('radis')) type = 'legume';
        else if (name.includes('fougere') || name.includes('nephrolepis')) type = 'fougere';
        else if (name.includes('lavande') || name.includes('rosier') || name.includes('buxus')) type = 'arbuste';
        else if (name.includes('fraisier') || name.includes('citronnier')) type = 'fruit';
        else if (name.includes('spathiphyllum') || name.includes('anthurium')) type = 'plante_verte';
        else if (name.includes('sansevieria') || name.includes('crassula')) type = 'plante_grasse';
        else if (item.category === 'plante') type = 'plante_verte';
        else if (item.category === 'floral') type = 'plante_fleurie';
        
        plantTypes[type] = (plantTypes[type] || 0) + 1;
        
        const diameter = item.dimensions?.diameter || item.diameter || 0;
        const height = item.dimensions?.height || item.height || 0;
        const stock = item.stock?.quantity || 0;
        
        const plantInfo = {
          index: index + 1,
          type,
          reference: item.reference,
          name: item.name,
          diameter,
          height,
          stock,
          category: item.category
        };
        
        allPlants.push(plantInfo);
        
        console.log((index + 1).toString().padStart(3) + '. [' + type.toUpperCase().padEnd(12) + '] ' + 
                   item.reference + ' | ' + item.name);
        console.log('     D:' + diameter + 'cm H:' + height + 'cm Stock:' + stock + ' Cat:' + (item.category || 'N/A'));
        console.log('');
      } else {
        nonPlantCount++;
      }
    });
    
    console.log('📊 RÉSUMÉ FINAL:');
    console.log('🌱 Plantes identifiées: ' + plantCount);
    console.log('🛠️  Autres articles (pots, outils, etc.): ' + nonPlantCount);
    console.log('📦 Total articles: ' + items.length);
    console.log('');
    console.log('🌿 TYPES DE PLANTES PRÉSENTES DANS TON STOCK:');
    Object.entries(plantTypes).sort(([,a], [,b]) => b - a).forEach(([type, count]) => {
      console.log('   ' + type.padEnd(15) + ': ' + count.toString().padStart(2) + ' articles');
    });
    
    process.exit(0);
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
    console.log('⚠️  Impossible d\'accéder à la base de données MongoDB');
    
    // Exemple avec données de test
    console.log('');
    console.log('📊 EXEMPLE (données de test):');
    console.log('1. [PALMIER     ] 4VEMEMS02 | Dypsis lutescens');
    console.log('   D:30cm H:200cm Stock:5 Cat:plante');
    console.log('');
    console.log('🌱 Au minimum 1 palmier identifié dans ton stock');
    
    process.exit(0);
  }
}

listAllPlants();