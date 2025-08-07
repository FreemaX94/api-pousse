#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Routes montées dans app.js
const mountedRoutes = [
  'authRoutes.js',
  'stocks.js',
  'invoices.js',
  'expenses.js',
  'vehicles.js',
  'concepteurs.js',
  'catalogue.js',
  'catalogueitems.js',
  'nieuwkoop.js',
  'eventsRoutes.js', // PAS events.js
  'movementRoutes.js',
  'partnerItems.js',
  'evenements.js',
  'comptoirfleuriste.js',
  'projets.js',
  'nieuwkoopProxy.js',
  'livraisons.js',
  'entretienRoutes.js', // PAS entretien.js
  'sync.js',
  'health.js',
  'security.js',
  'rbac.js'
];

// Lire tous les fichiers dans le dossier routes
const routesDir = path.join(__dirname, '..', 'routes');
const allFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.js'));

// Identifier les fichiers orphelins
const orphanFiles = allFiles.filter(file => !mountedRoutes.includes(file));

console.log('=== FICHIERS DE ROUTES ORPHELINS ===\n');
console.log(`Total des fichiers: ${allFiles.length}`);
console.log(`Fichiers montés: ${mountedRoutes.length}`);
console.log(`Fichiers orphelins: ${orphanFiles.length}\n`);

console.log('Fichiers à supprimer:');
console.log('---------------------');

// Grouper par type de doublon
const groups = {
  admin: [],
  user: [],
  contract: [],
  delivery: [],
  creation: [],
  depot: [],
  entretien: [],
  event: [],
  livraison: [],
  parametres: [],
  sanitize: [],
  sheet: [],
  statistiques: [],
  comptabilite: [],
  autres: []
};

orphanFiles.forEach(file => {
  if (file.includes('admin')) groups.admin.push(file);
  else if (file.includes('user')) groups.user.push(file);
  else if (file.includes('contract')) groups.contract.push(file);
  else if (file.includes('deliver')) groups.delivery.push(file);
  else if (file.includes('creation')) groups.creation.push(file);
  else if (file.includes('depot')) groups.depot.push(file);
  else if (file === 'entretien.js') groups.entretien.push(file);
  else if (file === 'events.js') groups.event.push(file);
  else if (file.includes('livraison') && file !== 'livraisons.js') groups.livraison.push(file);
  else if (file.includes('parametres')) groups.parametres.push(file);
  else if (file.includes('sanitize')) groups.sanitize.push(file);
  else if (file.includes('sheet')) groups.sheet.push(file);
  else if (file.includes('statistiques')) groups.statistiques.push(file);
  else if (file.includes('comptabilite')) groups.comptabilite.push(file);
  else groups.autres.push(file);
});

// Afficher par groupe
Object.entries(groups).forEach(([groupName, files]) => {
  if (files.length > 0) {
    console.log(`\n${groupName.toUpperCase()}:`);
    files.forEach(file => console.log(`  - ${file}`));
  }
});

console.log('\n=== COMMANDES DE SUPPRESSION ===\n');
console.log('# Pour supprimer tous les fichiers orphelins, exécutez:');
console.log('cd backend/routes');
orphanFiles.forEach(file => {
  console.log(`rm "${file}"`);
});

console.log('\n# Ou en une seule commande:');
console.log(`cd backend/routes && rm ${orphanFiles.map(f => `"${f}"`).join(' ')}`);