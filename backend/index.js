require('dotenv').config();
const mongoose = require('mongoose');
const { app, setupRoutes } = require('./app.js');
require('./models/CatalogueItem');

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/api-pousse')
    .then(() => {
      console.log('✅ Connected to MongoDB');
      setupRoutes();
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('❌ MongoDB connection failed:', err);
      process.exit(1);
    });
}