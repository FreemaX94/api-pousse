// Script pour lister toutes les plantes du stock
const mongoose = require('mongoose');

async function listAllPlants() {
  try {
    // Connexion à la base de données
    await mongoose.connect('mongodb://localhost:27017/api-pousse', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connexion à MongoDB réussie');
    
    // Import du modèle
    const NieuwkoopItem = require('./backend/src/domains/catalog/models/nieuwkoopItemModel');
    
    // Récupération de tous les articles
    const items = await NieuwkoopItem.find({}).lean();
    
    console.log('\n🌿 ANALYSE COMPLÈTE DU STOCK');
    console.log('='.repeat(60));
    console.log(`📦 Total articles dans la base: ${items.length}`);
    console.log('');
    
    let plantCount = 0;
    let nonPlantCount = 0;
    const plantsByType = {};
    
    // Analyse de chaque article
    items.forEach((item, index) => {
      const name = (item.name || '').toLowerCase();
      const ref = (item.reference || '').toLowerCase();
      
      // Mots-clés pour identifier les non-plantes
      const nonPlantKeywords = [
        'pot', 'bac', 'jardiniere', 'cache-pot', 'contenant', 'vasque',
        'terreau', 'substrat', 'compost', 'terre', 'sable', 'perlite',
        'outil', 'bêche', 'sécateur', 'arrosoir', 'pulverisateur',
        'engrais', 'fertilisant', 'pesticide', 'insecticide', 'traitement',
        'tuteur', 'treillage', 'paillis', 'voile', 'bache',
        'graine', 'bulbe', 'semence'
      ];
      
      // Vérifier si c'est un article non-plante
      const isNonPlant = nonPlantKeywords.some(keyword => 
        name.includes(keyword) || ref.includes(keyword)
      );
      
      if (isNonPlant) {
        nonPlantCount++;
        return; // Passer au suivant
      }
      
      // C'est une plante, classifier le type
      plantCount++;
      let plantType = 'autre';
      
      // Classification détaillée
      if (name.includes('dypsis') || name.includes('areca') || name.includes('palmier') || 
          name.includes('chamaerops') || name.includes('phoenix') || name.includes('washingtonia')) {
        plantType = 'palmier';
      } else if (name.includes('ficus') || name.includes('benjamina') || name.includes('elastica')) {
        plantType = 'ficus';
      } else if (name.includes('cactus') || name.includes('aloe') || name.includes('echeveria') || 
                 name.includes('sedum') || name.includes('cereus')) {
        plantType = 'cactus';
      } else if (name.includes('orchidee') || name.includes('phalaenopsis') || name.includes('dendrobium')) {
        plantType = 'orchidee';
      } else if (name.includes('monstera') || name.includes('philodendron') || name.includes('pothos') || 
                 name.includes('spathiphyllum') || name.includes('anthurium') || name.includes('dracaena')) {
        plantType = 'plante_verte';
      } else if (name.includes('begonia') || name.includes('impatiens') || name.includes('geranium') || 
                 name.includes('cyclamen') || name.includes('azalee')) {
        plantType = 'plante_fleurie';
      } else if (name.includes('fougere') || name.includes('nephrolepis') || name.includes('pteris')) {
        plantType = 'fougere';
      } else if (name.includes('basilic') || name.includes('thym') || name.includes('romarin') || 
                 name.includes('persil') || name.includes('menthe')) {
        plantType = 'aromate';
      } else if (name.includes('tomate') || name.includes('salade') || name.includes('radis') || 
                 name.includes('courgette')) {
        plantType = 'legume';
      } else if (name.includes('fraisier') || name.includes('citronnier') || name.includes('oranger')) {
        plantType = 'fruit';
      } else if (name.includes('lavande') || name.includes('rosier') || name.includes('buxus')) {
        plantType = 'arbuste';
      } else if (name.includes('sansevieria') || name.includes('crassula') || name.includes('kalanchoe')) {
        plantType = 'plante_grasse';
      } else if (item.category === 'plante') {
        plantType = 'plante_verte';
      } else if (item.category === 'floral') {
        plantType = 'plante_fleurie';
      }
      
      // Compter par type
      plantsByType[plantType] = (plantsByType[plantType] || 0) + 1;
      
      // Afficher les détails
      const diameter = item.dimensions?.diameter || item.diameter || 'N/A';
      const height = item.dimensions?.height || item.height || 'N/A';
      const stock = item.stock?.quantity || 0;
      const category = item.category || 'N/A';
      
      console.log(`${(index + 1).toString().padStart(3)}. [${plantType.toUpperCase().padEnd(13)}] ${item.reference}`);
      console.log(`     ${item.name}`);
      console.log(`     📏 D:${diameter}cm H:${height}cm | 📦 Stock:${stock} | 🏷️ Cat:${category}`);
      console.log('');
    });
    
    // Résumé final
    console.log('📊 RÉSUMÉ FINAL:');
    console.log('='.repeat(40));
    console.log(`🌱 Plantes identifiées: ${plantCount}`);
    console.log(`🛠️  Autres articles: ${nonPlantCount}`);
    console.log(`📦 Total: ${items.length}`);
    console.log('');
    
    console.log('🌿 TYPES DE PLANTES DANS TON STOCK:');
    console.log('='.repeat(40));
    
    // Trier par nombre décroissant
    const sortedTypes = Object.entries(plantsByType).sort(([,a], [,b]) => b - a);
    
    sortedTypes.forEach(([type, count]) => {
      const typeLabel = type.replace('_', ' ').toUpperCase();
      console.log(`   ${typeLabel.padEnd(15)}: ${count.toString().padStart(2)} articles`);
    });
    
    console.log('\n✅ Analyse terminée !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.log('\n💡 Suggestions:');
    console.log('   1. Assure-toi que MongoDB est démarré');
    console.log('   2. Vérifie que tu es dans le bon dossier');
    console.log('   3. Lance: npm install dans le dossier backend');
  }
  
  process.exit(0);
}

// Démarrer l'analyse
listAllPlants();