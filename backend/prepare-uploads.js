#!/usr/bin/env node

/**
 * Script de préparation des uploads - VERSION SIMPLE
 * Ne bloque jamais le déploiement
 */

const fs = require('fs');
const path = require('path');

try {
  console.log('🚀 Préparation uploads (version simple)...');
  
  const uploadsDir = path.join(__dirname, 'uploads');
  
  // Créer simplement le dossier s'il n'existe pas
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Dossier uploads créé');
  } else {
    console.log('✅ Dossier uploads existe déjà');
  }
  
  console.log('✅ Préparation terminée sans erreur');
} catch (error) {
  console.log('⚠️ Erreur préparation uploads (non bloquante):', error.message);
  console.log('✅ Le serveur peut démarrer normalement');
}