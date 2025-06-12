// backend/index.js
require('dotenv').config();
const mongoose = require('mongoose');
const { app } = require('./app.js');             // Suppression de l’import de setupRoutes
const logger = require('./utils/logger');
require('./models/CatalogueItem');

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/api-pousse')
    .then(() => {
      logger.log('✅ Connected to MongoDB');
      // ← Appel setupRoutes() supprimé ici pour éviter les doublons
      app.listen(PORT, () => {
        logger.log(`🚀 Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      logger.error('❌ MongoDB connection failed:', err);
      process.exit(1);
    });
}
