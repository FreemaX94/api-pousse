const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CatalogueItem = require('../models/CatalogueItem');
const StockEntry = require('../models/StockEntry');
const logger = require('../utils/logger');

dotenv.config();

const CATEGORIES = ['Plantes', 'Contenants', 'Décor', 'Artificiels', 'Séchés'];

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  logger.log('📦 Connected to DB');

  let total = 0;

  for (const categorie of CATEGORIES) {
    const items = await CatalogueItem.find({ categorie });
    const entries = items.map(item => ({
      product: item._id,
      categorie,
      quantity: 1,
      type: 'in',
      date: new Date(),
    }));

    const inserted = await StockEntry.insertMany(entries);
    logger.log(`✅ ${inserted.length} ajoutés pour ${categorie}`);
    total += inserted.length;
  }

  logger.log(`🎉 Total importé : ${total} éléments`);
  mongoose.disconnect();
};

run().catch(err => {
  logger.error('❌ Erreur import:', err);
  process.exit(1);
});
