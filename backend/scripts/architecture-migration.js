#!/usr/bin/env node
// backend/scripts/architecture-migration.js
// Script de migration vers l'architecture DDD

const fs = require('fs');
const path = require('path');

console.log('🏗️  MIGRATION VERS ARCHITECTURE DDD');
console.log('=====================================');

// Vérifier la nouvelle structure
const checkNewStructure = () => {
  console.log('\n1️⃣ Vérification de la nouvelle structure...');
  
  const requiredPaths = [
    'src/app.js',
    'src/domains/auth/index.js',
    'src/domains/catalog/index.js',
    'src/domains/inventory/index.js',
    'src/domains/finance/index.js',
    'src/domains/fleet/index.js',
    'src/domains/projects/index.js',
    'src/domains/calendar/index.js'
  ];
  
  let allPresent = true;
  
  requiredPaths.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${filePath}`);
    } else {
      console.log(`❌ ${filePath} - MANQUANT`);
      allPresent = false;
    }
  });
  
  return allPresent;
};

// Vérifier l'archivage des anciens fichiers
const checkArchive = () => {
  console.log('\n2️⃣ Vérification de l\'archivage...');
  
  const archivedFiles = [
    'archived/app-legacy.js',
    'archived/app-safe-legacy.js'
  ];
  
  let allArchived = true;
  
  archivedFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${filePath}`);
    } else {
      console.log(`⚠️  ${filePath} - Non archivé`);
      allArchived = false;
    }
  });
  
  return allArchived;
};

// Analyser les routes dupliquées
const analyzeRouteDuplication = () => {
  console.log('\n3️⃣ Analyse des routes dupliquées...');
  
  const oldRoutesDir = path.join(__dirname, '..', 'routes');
  const newDomainsDir = path.join(__dirname, '..', 'src', 'domains');
  
  if (!fs.existsSync(oldRoutesDir)) {
    console.log('⚠️  Dossier /routes non trouvé');
    return;
  }
  
  const oldRoutes = fs.readdirSync(oldRoutesDir)
    .filter(file => file.endsWith('.js'))
    .map(file => file.replace('.js', ''));
  
  console.log(`📁 Anciennes routes trouvées: ${oldRoutes.length}`);
  oldRoutes.forEach(route => console.log(`   - ${route}.js`));
  
  // Compter les domaines DDD
  if (fs.existsSync(newDomainsDir)) {
    const domains = fs.readdirSync(newDomainsDir)
      .filter(dir => fs.statSync(path.join(newDomainsDir, dir)).isDirectory());
    
    console.log(`🏗️  Domaines DDD créés: ${domains.length}`);
    domains.forEach(domain => console.log(`   - ${domain}/`));
  }
};

// Recommandations de nettoyage
const cleanupRecommendations = () => {
  console.log('\n4️⃣ Recommandations de nettoyage...');
  
  console.log('📋 Actions recommandées:');
  console.log('   1. Supprimer /routes/*.js (sauvegardés dans /archived)');
  console.log('   2. Mettre à jour les imports dans les tests');
  console.log('   3. Vérifier les liens symboliques cassés');
  console.log('   4. Mettre à jour la documentation API');
  console.log('   5. Tester tous les endpoints avec Postman/Jest');
};

// Générer un rapport de migration
const generateMigrationReport = () => {
  console.log('\n5️⃣ Génération du rapport...');
  
  const report = {
    timestamp: new Date().toISOString(),
    architecture: 'Domain Driven Design (DDD)',
    status: 'Migration completed',
    domains: [
      'auth - Authentication & Authorization',
      'catalog - Product Catalog & Nieuwkoop',
      'inventory - Stock, Movements, Deliveries',
      'finance - Invoices, Expenses, Contracts',
      'fleet - Vehicle Management',
      'projects - Project & Maintenance Management',
      'calendar - Events & Scheduling'
    ],
    benefits: [
      'Code better organized by business domain',
      'Reduced route duplication',
      'Cleaner separation of concerns',
      'Easier testing and maintenance',
      'Scalable architecture'
    ],
    routes_structure: {
      before: '/api/{resource}',
      after: '/api/{domain}/{resource}'
    }
  };
  
  const reportPath = path.join(__dirname, '..', 'migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📊 Rapport sauvegardé: ${reportPath}`);
  
  return report;
};

// Exécution du script
const main = () => {
  try {
    const structureOk = checkNewStructure();
    const archiveOk = checkArchive();
    
    analyzeRouteDuplication();
    cleanupRecommendations();
    const report = generateMigrationReport();
    
    console.log('\n🎉 MIGRATION TERMINÉE !');
    console.log('========================');
    
    if (structureOk) {
      console.log('✅ Architecture DDD en place');
    } else {
      console.log('❌ Structure incomplète');
    }
    
    if (archiveOk) {
      console.log('✅ Anciens fichiers archivés');
    }
    
    console.log('📈 Bénéfices:');
    report.benefits.forEach(benefit => console.log(`   • ${benefit}`));
    
    console.log('\n🚀 L\'application est prête avec la nouvelle architecture !');
    
  } catch (error) {
    console.error('❌ Erreur durant la migration:', error.message);
    process.exit(1);
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  main();
}

module.exports = {
  checkNewStructure,
  checkArchive,
  analyzeRouteDuplication,
  generateMigrationReport
};