require('dotenv').config();

function getEnv(name, defValue) {
  const value = process.env[name] ?? defValue;
  if (value === undefined) {
    throw new Error(`❌ Variable d'environnement manquante : ${name}`);
  }
  return value;
}

const config = {
  // Port HTTP
  port: parseInt(getEnv('PORT', '3001'), 10),

  // Environnement d'exécution
  nodeEnv: getEnv('NODE_ENV', 'development'),
  isProduction: getEnv('NODE_ENV', 'development') === 'production',

  // Base de données
  mongoURI: getEnv('MONGODB_URI', 'mongodb://localhost:27017/api-pousse'),

  // Authent JWT
  jwtSecret: getEnv('JWT_SECRET', 'dev-secret-key-change-in-production'),

  // Redis
  redis: {
    host: getEnv('REDIS_HOST', '127.0.0.1'),
    port: parseInt(getEnv('REDIS_PORT', '6379'), 10),
    url: `redis://${getEnv('REDIS_HOST', '127.0.0.1')}:${getEnv('REDIS_PORT', '6379')}`,
  },

  // SMTP / mailing (optionnel)
  email: {
    user: getEnv('EMAIL_USER', ''),
    pass: getEnv('EMAIL_PASS', ''),
  },
};

module.exports = config;
