(async () => {
// backend/services/pricesService.js
const createError = require('http-errors');
const mongoose = require('mongoose');
const Price = require('../models/Price.js');

/**
 * Crée un nouveau tarif pour un produit.
 * @param {{ productId: string, price: number, currency: string, validFrom?: Date|string }} payload
 * @returns {Promise<Object>}
 */
exports.createPrice({ productId, price, currency, validFrom }) {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw createError(400, 'productId invalide')
  }
  if (price == null) {
    throw createError(400, 'Le champ price est requis')
  }
  if (!currency) {
    throw createError(400, 'Le champ currency est requis')
  }
  const doc = await Price.create({
    product: productId,
    price,
    currency,
    validFrom: validFrom ? new Date(validFrom) : new Date()
  })
  return doc.toObject()
}

/**
 * Compte les tarifs selon un filtre de produit.
 * @param {{ productId?: string }} filter
 * @returns {Promise<number>}
 */
exports.countPrices({ productId } = {}) {
  const q = {}
  if (productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw createError(400, 'productId invalide')
    }
    q.product = productId
  }
  return Price.countDocuments(q)
}

/**
 * Liste les tarifs avec pagination et filtre de produit.
 * @param {{ productId?: string, page?: number, limit?: number }} options
 * @returns {Promise<{ data: Object[], meta: { total: number, page: number, limit: number } }>}
 */
exports.listPrices({ productId, page = 1, limit = 50 } = {}) {
  const q = {}
  if (productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw createError(400, 'productId invalide')
    }
    q.product = productId
  }

  const skip = (Math.max(page, 1) - 1) * limit
  const [ total, data ] = await Promise.all([
    countPrices({ productId }),
    Price.find(q)
      .sort({ validFrom: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
  ])

  return { data, meta: { total, page, limit } }
}

/**
 * Récupère un tarif par son ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
exports.getPriceById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de tarif invalide')
  }
  const doc = await Price.findById(id).lean()
  if (!doc) {
    throw createError(404, 'Tarif non trouvé')
  }
  return doc
}
})();