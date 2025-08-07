#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration de production...\n');

// Vérifications des fichiers critiques
const criticalFiles = [
  '.env.production',
  'package.json',
  'app.js',
  'index.js',
  'config/config.js'
];

console.log('📁 Fichiers critiques:');
criticalFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Vérification des variables d'environnement requises
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'SESSION_SECRET',
  'NIEUWKOOP_USER',
  'NIEUWKOOP_PASS',
  'NIEUWKOOP_CLIENT_ID',
  'NIEUWKOOP_CLIENT_SECRET',
  'GOOGLE_CLIENT_EMAIL',
  'GOOGLE_PRIVATE_KEY'
];

console.log('\n🔐 Variables d\'environnement requises pour production:');
requiredEnvVars.forEach(envVar => {
  console.log(`  • ${envVar}`);
});

// Vérification des dépendances de sécurité
const packageJson = require('../package.json');
const securityDeps = [
  'helmet',
  'express-rate-limit',
  'cors',
  'bcrypt',
  'jsonwebtoken'
];

console.log('\n🛡️ Dépendances de sécurité:');
securityDeps.forEach(dep => {
  const installed = packageJson.dependencies[dep];
  console.log(`  ${installed ? '✅' : '❌'} ${dep} ${installed || ''}`);
});

console.log('\n📋 Checklist de déploiement production:');
console.log('  • Configurer toutes les variables d\'environnement');
console.log('  • Tester la connexion à la base de données');
console.log('  • Vérifier les certificats SSL');
console.log('  • Configurer les logs de production');
console.log('  • Tester les endpoints critiques');
console.log('  • Configurer la surveillance (monitoring)');
console.log('  • Backup de la base de données');

console.log('\n✅ Vérification terminée!');