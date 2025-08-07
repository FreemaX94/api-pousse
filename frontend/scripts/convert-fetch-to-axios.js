#!/usr/bin/env node

/**
 * Script pour identifier les conversions fetch → axios nécessaires
 * Ce script analyse les fichiers et génère des recommandations
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

const findFetchUsage = (dir, results = []) => {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.includes('node_modules')) {
      findFetchUsage(fullPath, results);
    } else if (item.endsWith('.jsx') || item.endsWith('.js')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const fetchMatches = content.match(/fetch\(/g);
        const axiosMatches = content.match(/axios\.|import.*axios/g);
        
        if (fetchMatches && fetchMatches.length > 0) {
          const relativePath = path.relative(srcDir, fullPath);
          
          results.push({
            file: relativePath,
            fetchCount: fetchMatches.length,
            hasAxios: !!axiosMatches,
            priority: getPriority(relativePath, content)
          });
        }
      } catch (error) {
        console.warn(`Erreur lecture ${fullPath}:`, error.message);
      }
    }
  });
  
  return results;
};

const getPriority = (filePath, content) => {
  // Priorité haute pour les composants critiques
  if (filePath.includes('auth') || filePath.includes('Admin')) return 'HIGH';
  if (filePath.includes('finance') || filePath.includes('invoice')) return 'HIGH';
  if (filePath.includes('inventory') || filePath.includes('stock')) return 'HIGH';
  
  // Priorité moyenne pour les autres composants
  if (filePath.includes('components/')) return 'MEDIUM';
  if (filePath.includes('pages/')) return 'MEDIUM';
  
  // Priorité basse pour les utilitaires et tests
  if (filePath.includes('utils/') || filePath.includes('test')) return 'LOW';
  
  return 'MEDIUM';
};

console.log('🔍 Recherche des usages de fetch() dans le frontend...\n');

const results = findFetchUsage(srcDir);

// Trier par priorité et nombre d'occurrences
results.sort((a, b) => {
  const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
  const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
  if (priorityDiff !== 0) return priorityDiff;
  return b.fetchCount - a.fetchCount;
});

console.log(`📊 Trouvé ${results.length} fichiers utilisant fetch()\n`);

console.log('🎯 PRIORITÉ HAUTE - À convertir en premier:');
results.filter(r => r.priority === 'HIGH').forEach(result => {
  console.log(`  📄 ${result.file} (${result.fetchCount} appels fetch)`);
});

console.log('\n🔶 PRIORITÉ MOYENNE:');
results.filter(r => r.priority === 'MEDIUM').forEach(result => {
  console.log(`  📄 ${result.file} (${result.fetchCount} appels fetch)`);
});

console.log('\n🔸 PRIORITÉ BASSE:');
results.filter(r => r.priority === 'LOW').forEach(result => {
  console.log(`  📄 ${result.file} (${result.fetchCount} appels fetch)`);
});

console.log('\n📝 Résumé:');
console.log(`  • Total fichiers: ${results.length}`);
console.log(`  • Priorité haute: ${results.filter(r => r.priority === 'HIGH').length}`);
console.log(`  • Priorité moyenne: ${results.filter(r => r.priority === 'MEDIUM').length}`);
console.log(`  • Priorité basse: ${results.filter(r => r.priority === 'LOW').length}`);

console.log('\n🚀 Prochaines étapes recommandées:');
console.log('1. Convertir tous les fichiers de priorité HAUTE');
console.log('2. Ajouter import api from "../../api/axios" (ajuster le chemin)');
console.log('3. Remplacer fetch() par api.get(), api.post(), etc.');
console.log('4. Utiliser handleApiError() pour la gestion d\'erreurs');
console.log('5. Ajouter un état loading pour UX améliorée');

// Générer un exemple de conversion
console.log('\n💡 Exemple de conversion:');
console.log('AVANT:');
console.log(`  const res = await fetch('/api/data');
  const data = await res.json();`);
console.log('\nAPRÈS:');
console.log(`  const response = await api.get('/data');
  const data = response.data;`);