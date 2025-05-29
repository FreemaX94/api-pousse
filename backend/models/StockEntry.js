const mongoose = require('mongoose');
const { Schema } = mongoose;

const StockEntrySchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'CatalogueItem', required: true, index: true },
  categorie: { type: String, enum: ['Plantes','Contenants','Décor','Artificiels','Séchés'], required: true, index: true },
  quantity: { type: Number, required: true },
  type: { type: String, enum: ['in', 'out', 'adjust'], required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('StockEntry', StockEntrySchema);