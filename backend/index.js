// backend/index.js
require('dotenv').config();

// 🚀 New Relic APM - DÉSACTIVÉ temporairement pour éviter l'erreur lazyrouter
const NEW_RELIC_DISABLED = true; // Mettre à false pour réactiver New Relic

let newRelicEnabled = false;
if (!NEW_RELIC_DISABLED && process.env.NEW_RELIC_LICENSE_KEY && process.env.NEW_RELIC_LICENSE_KEY !== 'YOUR_LICENSE_KEY_HERE') {
  newRelicEnabled = true;
  console.log('⏳ New Relic APM sera activé après l\'initialisation');
} else {
  console.log('⚠️ New Relic APM désactivé');
}
console.log('📦 Chargement des modules...');

console.log('1️⃣ Chargement mongoose...');
let mongoose;
try {
  mongoose = require('mongoose');
  console.log('✅ Mongoose chargé avec succès');
} catch (error) {
  console.error('❌ Erreur chargement mongoose:', error.message);
  console.log('💡 Suggestion: Exécutez "npm install" pour installer les dépendances');
  process.exit(1);
}

console.log('2️⃣ Chargement app.js (DDD Architecture)...');
let app, initializeDomains;
try {
  const appModule = require('./src/app.js');
  app = appModule.app;
  initializeDomains = appModule.initializeDomains;
  console.log('✅ app.js (DDD) chargé avec succès');
} catch (error) {
  console.error('❌ Erreur chargement app.js:', error.message);
  console.log('💡 Suggestion: Vérifiez que tous les modules sont installés');
  process.exit(1);
}

console.log('3️⃣ Chargement logger...');
const logger = require('./utils/logger');

// Ne pas charger CatalogueItem ici, il est déjà chargé dans les domaines
// console.log('4️⃣ Chargement CatalogueItem...');
// require('./models/CatalogueItem');

console.log('5️⃣ Chargement config...');
const config = require('./config/config');
console.log('✅ Tous les modules chargés');

const PORT = config.port;
console.log(`📡 Port configuré: ${PORT}`);

// Handlers pour erreurs non catchées
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

if (process.env.NODE_ENV !== 'test') {
  console.log('🔄 Tentative de connexion MongoDB...');
  console.log('MongoDB URI:', config.mongoURI ? 'Configuré' : 'Non configuré');
  
  mongoose.connect(config.mongoURI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: false
  })
    .then(() => {
      console.log('✅ Connected to MongoDB');
      logger.info('✅ Connected to MongoDB');
      
      console.log(`🚀 Démarrage serveur sur le port ${PORT}...`);
      
      // Initialisation unique des domaines
      try {
        console.log('🔄 Initialisation unique des domaines...');
        const { setupDomains } = require('./src/app.js');
        setupDomains();
        console.log('✅ Domaines initialisés avec succès');
      } catch (err) {
        console.error('❌ Erreur initialisation domaines:', err.message);
      }
      
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        logger.info(`🚀 Server running on port ${PORT}`);
        
        // Activer New Relic maintenant que tout est initialisé
        if (newRelicEnabled) {
          try {
            require('newrelic');
            console.log('✅ New Relic APM activé après initialisation');
          } catch (error) {
            console.log('⚠️ Erreur activation New Relic:', error.message);
          }
        }
      });
    })
    .catch(err => {
      console.error('❌ MongoDB connection failed:', err);
      logger.error('❌ MongoDB connection failed:', err);
      process.exit(1);
    });
} else {
  console.log('🧪 Mode test détecté - connexion MongoDB ignorée');
}