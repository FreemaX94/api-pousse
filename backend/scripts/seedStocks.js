import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CatalogueItem from '../models/CatalogueItem.js';
import StockEntry from '../models/StockEntry.js';

dotenv.config();

const CATEGORIES = ['Plantes', 'Contenants', 'Décor', 'Artificiels', 'Séchés'];

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('📦 Connected to DB');

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
    console.log(`✅ ${inserted.length} ajoutés pour ${categorie}`);
    total += inserted.length;
  }

  console.log(`🎉 Total importé : ${total} éléments`);
  mongoose.disconnect();
};

run().catch(err => {
  console.error('❌ Erreur import:', err);
  process.exit(1);
});
