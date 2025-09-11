#!/usr/bin/env node

/**
 * 🌿 SCRIPT D'ANALYSE DES PLANTES - SYSTÈME D'ARROSAGE INTELLIGENT
 * Ce script analyse tous les articles du stock pour créer une base de données
 * optimisée des paramètres d'arrosage par type de plante
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration API
const API_BASE = process.env.API_BASE || 'http://localhost:3001';
const OUTPUT_FILE = path.join(__dirname, 'plants-analysis.json');

console.log('🌿 ANALYSE DES PLANTES - Système d\'Arrosage Intelligent');
console.log('=' .repeat(60));

/**
 * Récupère tous les articles du stock directement depuis la DB
 */
async function fetchAllStockItems() {
  try {
    console.log('📦 Récupération des articles du stock...');
    
    // Import MongoDB si disponible
    let NieuwkoopItem;
    try {
      const mongoose = require('mongoose');
      
      // Tentative de connexion à MongoDB
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect('mongodb://localhost:27017/api-pousse', {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
      }
      
      NieuwkoopItem = require('./backend/src/domains/catalog/models/nieuwkoopItemModel');
      const items = await NieuwkoopItem.find().lean();
      
      // Formatage des données comme l'API
      return items.map(item => ({
        reference: item.reference,
        name: item.name,
        price: item.pricing?.price || 0,
        category: item.category,
        dimensions: item.dimensions,
        diameter: item.dimensions?.diameter || item.diameter,
        height: item.dimensions?.height || item.height,
        stock: item.stock,
        availableQuantity: Math.max(0, (item.stock?.quantity || 0) - (item.stock?.reservedQuantity || 0)),
        createdAt: item.createdAt
      }));
      
    } catch (mongoError) {
      console.log('⚠️  MongoDB non disponible, utilisation de données simulées pour test');
      
      // Données de test basées sur ce qu'on sait
      return [
        {
          reference: '4VEMEMS02',
          name: 'Dypsis lutescens',
          category: 'plante',
          dimensions: { diameter: 30, height: 200 },
          diameter: 30,
          height: 200,
          stock: { quantity: 5 },
          availableQuantity: 5,
          createdAt: new Date('2024-01-01')
        }
      ];
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des articles:', error.message);
    
    // Retourne des données de test minimal
    return [
      {
        reference: '4VEMEMS02',
        name: 'Dypsis lutescens',
        category: 'plante',
        dimensions: { diameter: 30, height: 200 },
        diameter: 30,
        height: 200,
        stock: { quantity: 5 },
        availableQuantity: 5,
        createdAt: new Date('2024-01-01')
      }
    ];
  }
}

/**
 * Analyse le nom d'un article pour déterminer le type de plante
 */
function analyzePlantType(item) {
  const name = (item.name || '').toLowerCase();
  const reference = (item.reference || '').toLowerCase();
  const category = (item.category || '').toLowerCase();
  
  // Détection des types de plantes ET autres articles
  const patterns = {
    // PLANTES
    palmier: ['dypsis', 'areca', 'chamaerops', 'phoenix', 'washingtonia', 'trachycarpus', 'palmier', 'palm'],
    ficus: ['ficus', 'benjamina', 'elastica', 'lyrata'],
    cactus: ['cactus', 'cereus', 'opuntia', 'aloe', 'echeveria', 'sedum'],
    orchidee: ['orchidee', 'phalaenopsis', 'dendrobium', 'cattleya'],
    fougere: ['fougere', 'nephrolepis', 'pteris', 'asplenium'],
    plante_grasse: ['succulent', 'crassula', 'kalanchoe', 'sansevieria'],
    plante_verte: ['monstera', 'philodendron', 'pothos', 'chlorophytum', 'dracaena', 'spathiphyllum', 'anthurium'],
    plante_fleurie: ['begonia', 'impatiens', 'petunia', 'geranium', 'cyclamen', 'azalee'],
    arbuste: ['arbuste', 'buxus', 'lavande', 'rosier', 'rhododendron'],
    aromate: ['basilic', 'thym', 'romarin', 'persil', 'menthe', 'ciboulette'],
    legume: ['tomate', 'salade', 'radis', 'courgette', 'poivron'],
    fruit: ['fraisier', 'citronnier', 'oranger', 'olivier'],
    
    // NON-PLANTES (pas d'arrosage nécessaire)
    pot_contenant: ['pot', 'bac', 'jardiniere', 'cache-pot', 'vasque', 'contenant'],
    terreau_substrat: ['terreau', 'substrat', 'compost', 'terre', 'sable', 'perlite'],
    outil_jardin: ['bêche', 'pelle', 'sécateur', 'arrosoir', 'pulverisateur', 'outil'],
    engrais_produit: ['engrais', 'fertilisant', 'pesticide', 'insecticide', 'traitement'],
    decoration: ['statue', 'nain', 'decoration', 'galets', 'graviers'],
    graine_bulbe: ['graine', 'bulbe', 'semence', 'plant'],
    accessoire: ['tuteur', 'treillage', 'paillis', 'voile', 'bache']
  };
  
  // Recherche de correspondances
  for (const [type, keywords] of Object.entries(patterns)) {
    if (keywords.some(keyword => name.includes(keyword) || reference.includes(keyword))) {
      return {
        type,
        confidence: 'high',
        matchedKeyword: keywords.find(k => name.includes(k) || reference.includes(k))
      };
    }
  }
  
  // Classification par catégorie si pas de match précis
  if (category.includes('floral')) return { type: 'plante_fleurie', confidence: 'medium' };
  if (category.includes('plante')) return { type: 'plante_verte', confidence: 'low' };
  if (category.includes('arbuste')) return { type: 'arbuste', confidence: 'medium' };
  
  return { type: 'autre', confidence: 'low' };
}

/**
 * Calcule les dimensions et paramètres physiques
 */
function calculatePhysicalParams(item) {
  const diameter = item.dimensions?.diameter || item.diameter || 20;
  const height = item.dimensions?.height || item.height || 30;
  
  // Surface du pot (cm²)
  const potSurface = Math.PI * (diameter / 2) ** 2;
  
  // Volume d'arrosage théorique (litres) - méthode horticole 2.5cm
  const wateringVolume = (potSurface * 2.5) / 1000;
  
  // Estimation de la biomasse (approximative)
  const biomassIndex = (diameter * height) / 1000; // Index simplifié
  
  return {
    diameter,
    height,
    potSurface: Math.round(potSurface),
    wateringVolume: Math.round(wateringVolume * 1000) / 1000, // 3 décimales
    biomassIndex: Math.round(biomassIndex * 100) / 100
  };
}

/**
 * Analyse complète d'un article
 */
function analyzeItem(item) {
  const plantType = analyzePlantType(item);
  const physicalParams = calculatePhysicalParams(item);
  
  return {
    reference: item.reference,
    name: item.name,
    category: item.category,
    plantType: plantType.type,
    confidence: plantType.confidence,
    matchedKeyword: plantType.matchedKeyword,
    dimensions: {
      diameter: physicalParams.diameter,
      height: physicalParams.height,
      potSurface: physicalParams.potSurface,
      wateringVolume: physicalParams.wateringVolume,
      biomassIndex: physicalParams.biomassIndex
    },
    stock: {
      quantity: item.stock?.quantity || 0,
      available: item.availableQuantity || 0
    }
  };
}

/**
 * Génère les statistiques d'analyse
 */
function generateStats(analyzedItems) {
  const stats = {
    totalItems: analyzedItems.length,
    plantTypes: {},
    confidenceLevels: { high: 0, medium: 0, low: 0 },
    dimensionRanges: {
      diameter: { min: Infinity, max: 0, avg: 0 },
      height: { min: Infinity, max: 0, avg: 0 }
    }
  };
  
  let totalDiameter = 0, totalHeight = 0;
  
  analyzedItems.forEach(item => {
    // Comptage par type
    stats.plantTypes[item.plantType] = (stats.plantTypes[item.plantType] || 0) + 1;
    
    // Niveau de confiance
    stats.confidenceLevels[item.confidence]++;
    
    // Dimensions
    const d = item.dimensions.diameter;
    const h = item.dimensions.height;
    
    stats.dimensionRanges.diameter.min = Math.min(stats.dimensionRanges.diameter.min, d);
    stats.dimensionRanges.diameter.max = Math.max(stats.dimensionRanges.diameter.max, d);
    
    stats.dimensionRanges.height.min = Math.min(stats.dimensionRanges.height.min, h);
    stats.dimensionRanges.height.max = Math.max(stats.dimensionRanges.height.max, h);
    
    totalDiameter += d;
    totalHeight += h;
  });
  
  stats.dimensionRanges.diameter.avg = Math.round(totalDiameter / analyzedItems.length);
  stats.dimensionRanges.height.avg = Math.round(totalHeight / analyzedItems.length);
  
  return stats;
}

/**
 * Main function
 */
async function main() {
  try {
    // 1. Récupération des données
    const items = await fetchAllStockItems();
    console.log(`✅ ${items.length} articles récupérés`);
    
    if (items.length === 0) {
      console.log('⚠️  Aucun article trouvé dans le stock');
      return;
    }
    
    // 2. Analyse des articles
    console.log('🔍 Analyse des types de plantes...');
    const analyzedItems = items.map(analyzeItem);
    
    // 3. Génération des statistiques
    const stats = generateStats(analyzedItems);
    
    // 4. Affichage des résultats
    console.log('\n📊 RÉSULTATS DE L\'ANALYSE');
    console.log('=' .repeat(40));
    console.log(`Total d'articles analysés: ${stats.totalItems}`);
    
    console.log('\n🌱 Types de plantes identifiés:');
    Object.entries(stats.plantTypes)
      .sort(([,a], [,b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`  ${type.padEnd(15)} : ${count.toString().padStart(3)} articles`);
      });
    
    console.log('\n🎯 Niveaux de confiance:');
    console.log(`  Haute confiance : ${stats.confidenceLevels.high}`);
    console.log(`  Confiance moyenne: ${stats.confidenceLevels.medium}`);
    console.log(`  Faible confiance : ${stats.confidenceLevels.low}`);
    
    console.log('\n📏 Dimensions des pots:');
    console.log(`  Diamètre: ${stats.dimensionRanges.diameter.min}-${stats.dimensionRanges.diameter.max}cm (moy: ${stats.dimensionRanges.diameter.avg}cm)`);
    console.log(`  Hauteur : ${stats.dimensionRanges.height.min}-${stats.dimensionRanges.height.max}cm (moy: ${stats.dimensionRanges.height.avg}cm)`);
    
    // 5. Sauvegarde des résultats
    const output = {
      timestamp: new Date().toISOString(),
      stats,
      items: analyzedItems
    };
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`\n💾 Résultats sauvegardés dans: ${OUTPUT_FILE}`);
    
    // 6. Affichage de quelques exemples
    console.log('\n🔍 EXEMPLES D\'ARTICLES ANALYSÉS:');
    console.log('=' .repeat(60));
    analyzedItems.slice(0, 10).forEach(item => {
      console.log(`${item.reference} | ${item.name}`);
      console.log(`  Type: ${item.plantType} (${item.confidence}) | D:${item.dimensions.diameter}cm H:${item.dimensions.height}cm | Vol:${item.dimensions.wateringVolume}L`);
      console.log('');
    });
    
    console.log('✅ Analyse terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse:', error.message);
    process.exit(1);
  }
}

// Lancement du script
if (require.main === module) {
  main();
}

module.exports = { fetchAllStockItems, analyzeItem, generateStats };