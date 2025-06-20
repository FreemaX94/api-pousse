const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProduitSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, index: true }
}, { timestamps: true });

module.exports = mongoose.model('Produit', ProduitSchema);
