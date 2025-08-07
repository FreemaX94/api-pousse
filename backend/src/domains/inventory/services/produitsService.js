const createError = require('http-errors');
const mongoose = require('mongoose');
const Produit = require('../models/Produit.js');

async function createProduit({ name, description = '', price, category }) {
  if (!name || price == null || !category) {
    throw createError(400, 'Les champs name, price et category sont requis');
  }

  const exists = await Produit.findOne({ name, category });
  if (exists) {
    throw createError(409, `Le produit "${name}" existe déjà dans la catégorie "${category}"`);
  }

  const prod = await Produit.create({ name, description, price, category });
  return prod.toObject();
}

async function countProduits({ category } = {}) {
  const q = {};
  if (category) q.category = category;
  return Produit.countDocuments(q);
}

async function listProduits({ category, page = 1, limit = 50 } = {}) {
  const q = {};
  if (category) q.category = category;

  const skip = (Math.max(page, 1) - 1) * limit;
  const [total, data] = await Promise.all([
    countProduits({ category }),
    Produit.find(q)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  return { data, meta: { total, page, limit } };
}

async function getProduitById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de produit invalide');
  }
  const prod = await Produit.findById(id).lean();
  if (!prod) {
    throw createError(404, 'Produit non trouvé');
  }
  return prod;
}

async function updateProduit(id, update) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de produit invalide');
  }
  const payload = {};
  if (update.name) payload.name = update.name;
  if (update.description !== undefined) payload.description = update.description;
  if (update.price != null) payload.price = update.price;
  if (update.category) payload.category = update.category;

  const updated = await Produit.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) {
    throw createError(404, 'Produit non trouvé');
  }
  return updated;
}

async function deleteProduit(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de produit invalide');
  }
  const deleted = await Produit.findByIdAndDelete(id).lean();
  if (!deleted) {
    throw createError(404, 'Produit non trouvé');
  }
  return deleted;
}

module.exports = {
  createProduit,
  countProduits,
  listProduits,
  getProduitById,
  updateProduit,
  deleteProduit,
};
