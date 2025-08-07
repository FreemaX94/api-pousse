const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('base64');
}

const secrets = {
  JWT_SECRET: generateSecret(),
  SESSION_SECRET: generateSecret(),
  REDIS_PASSWORD: generateSecret(32),
  SENTRY_DSN: '<à récupérer depuis Sentry>',
  RECAPTCHA_SECRET: '<à récupérer depuis Google>',
};

console.log('🔐 Nouveaux secrets générés:\n');
Object.entries(secrets).forEach(([key, value]) => {
  console.log(`${key}=${value}`);
});

console.log('\n⚠️  IMPORTANT: Copiez ces valeurs dans votre .env et changez immédiatement:');
console.log('- Le mot de passe MongoDB');
console.log('- Les credentials Nieuwkoop');
console.log('- La clé privée Google');
