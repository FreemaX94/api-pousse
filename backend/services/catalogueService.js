const createError = require('http-errors');
const mongoose = require('mongoose');
const CatalogueItem = require('../models/CatalogueItem.js');

// 🔍 Récupère tous les items d’une catégorie (avec pagination)
exports.findByCategorie = async (categorie, { page = 1, limit = 50 } = {}) => {
  if (typeof categorie !== 'string' || !categorie.trim()) {
    throw createError(400, 'Catégorie invalide');
  }
  const filter = { categorie };
  const skip = (Math.max(page, 1) - 1) * limit;
  const [total, data] = await Promise.all([
    CatalogueItem.countDocuments(filter),
    CatalogueItem.find(filter)
      .sort({ nom: 1 })
      .skip(skip)
      .limit(limit)
      .lean()
  ]);
  return { data, meta: { total, page, limit } };
};

// ➕ Crée un nouvel item
exports.createItem = async ({ categorie, nom, infos }) => {
  if (!categorie || !nom) {
    throw createError(400, 'Catégorie et nom sont requis');
  }
  const exists = await CatalogueItem.findOne({ categorie, nom });
  if (exists) {
    throw createError(409, `L’item "${nom}" existe déjà dans la catégorie "${categorie}"`);
  }
  const item = await CatalogueItem.create({ categorie, nom, infos });
  return item.toObject();
};

// ✏️ Met à jour un item
exports.updateItem = async (id, updatePayload) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID d’item invalide');
  }
  const updated = await CatalogueItem.findByIdAndUpdate(
    id,
    { $set: updatePayload },
    { new: true, runValidators: true }
  ).lean();
  if (!updated) {
    throw createError(404, 'Item non trouvé');
  }
  return updated;
};

// ❌ Supprime un item
/**
 * Supprime un item du catalogue.
 * @param {string} id
 * @returns {Promise<Object>}
 */
exports.deleteItem = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID d’item invalide');
  }
  const deleted = await CatalogueItem.findByIdAndDelete(id).lean();
  if (!deleted) {
    throw createError(404, 'Item non trouvé');
  }
  return deleted;
};

// 📋 Récupère tous les items du catalogue
exports.findAllItems = async () => {
  return await CatalogueItem.find({}).sort({ categorie: 1, nom: 1 }).lean();
};

// 📊 Compte les items par catégorie
exports.countByCategory = async () => {
  const results = await CatalogueItem.aggregate([
    { $group: { _id: "$categorie", total: { $sum: 1 } } },
    { $sort: { total: -1 } }
  ]);
  return results.map(r => ({ categorie: r._id, total: r.total }));
};
