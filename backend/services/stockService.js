const mongoose = require('mongoose');
const createError = require('../utils/createError');
const StockEntry = require('../models/StockEntry');

exports.adjustStock = ({ productId, categorie, change }) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw createError(400, 'productId invalide');
  }
  const entry = new StockEntry({ product: productId, categorie, quantity: change, type: 'adjust' });
  return entry.save();
};

exports.getStock = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw createError(400, 'productId invalide');
  }
  return await StockEntry.find({ product: productId }).populate('product');
};

exports.getStockByCategory = async (categorie) => {
  if (!categorie) {
    throw createError(400, 'Catégorie manquante');
  }
  return await StockEntry.find({ categorie }).populate('product');
};