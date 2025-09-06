// Test simple pour voir où ça plante dans les domaines
console.log('🔄 Test loading auth domain...');

try {
  console.log('1. Loading auth domain index...');
  const authDomain = require('./backend/src/domains/auth/index.js');
  console.log('✅ Auth domain loaded successfully');
  console.log('Routes:', typeof authDomain.routes);
} catch (error) {
  console.error('❌ Erreur auth domain:', error.message);
  console.error('Stack:', error.stack);
}