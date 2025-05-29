(async () => {
// backend/services/produitsService.js
const createError = require('http-errors');
const mongoose = require('mongoose');
const Produit = require('../models/Produit.js');

/**
 * Crée un nouveau produit.
 * @param {{ name: string, description?: string, price: number, category: string }} payload
 * @returns {Promise<Object>}
 */
exports.createProduit({ name, description = '', price, category }) {
  if (!name || price == null || !category) {
    throw createError(400, 'Les champs name, price et category sont requis')
  }
  // Prévenir les doublons sur nom + catégorie
  const exists = await Produit.findOne({ name, category })
  if (exists) {
    throw createError(409, `Le produit "${name}" existe déjà dans la catégorie "${category}"`)
  }
  const prod = await Produit.create({ name, description, price, category })
  return prod.toObject()
}

/**
 * Compte les produits selon un filtre.
 * @param {{ category?: string }} filter
 * @returns {Promise<number>}
 */
exports.countProduits({ category } = {}) {
  const q = {}
  if (category) q.category = category
  return Produit.countDocuments(q)
}

/**
 * Liste les produits avec pagination et filtre de catégorie.
 * @param {{ category?: string, page?: number, limit?: number }} options
 * @returns {Promise<{ data: Object[], meta: { total: number, page: number, limit: number } }>}
 */
exports.listProduits({ category, page = 1, limit = 50 } = {}) {
  const q = {}
  if (category) q.category = category

  const skip = (Math.max(page, 1) - 1) * limit
  const [ total, data ] = await Promise.all([
    countProduits({ category }),
    Produit.find(q)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean()
  ])

  return { data, meta: { total, page, limit } }
}

/**
 * Récupère un produit par son ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
exports.getProduitById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de produit invalide')
  }
  const prod = await Produit.findById(id).lean()
  if (!prod) {
    throw createError(404, 'Produit non trouvé')
  }
  return prod
}

/**
 * Met à jour un produit existant.
 * @param {string} id
 * @param {{ name?: string, description?: string, price?: number, category?: string }} update
 * @returns {Promise<Object>}
 */
exports.updateProduit(id, update) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de produit invalide')
  }
  const payload = {}
  if (update.name) payload.name = update.name
  if (update.description !== undefined) payload.description = update.description
  if (update.price != null) payload.price = update.price
  if (update.category) payload.category = update.category

  const updated = await Produit.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true
  }).lean()

  if (!updated) {
    throw createError(404, 'Produit non trouvé')
  }
  return updated
}

/**
 * Supprime un produit.
 * @param {string} id
 * @returns {Promise<Object>}
 */
exports.deleteProduit(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de produit invalide')
  }
  const deleted = await Produit.findByIdAndDelete(id).lean()
  if (!deleted) {
    throw createError(404, 'Produit non trouvé')
  }
  return deleted
}
})();