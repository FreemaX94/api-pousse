(async () => {
// backend/services/salesOrdersService.js
const createError = require('http-errors');
const mongoose = require('mongoose');
const SalesOrder = require('../models/salesOrdersModel.js');

/**
 * Crée une nouvelle commande.
 * @param {{ customerId: string, items: { productId: string, quantity: number }[] }} payload
 * @returns {Promise<Object>}
 */
exports.createOrder({ customerId, items }) {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw createError(400, 'customerId invalide')
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw createError(400, 'La liste items est requise et doit contenir au moins un élément')
  }

  const sanitizedItems = items.map(({ productId, quantity }, idx) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw createError(400, `productId invalide à l’index ${idx}`)
    }
    if (typeof quantity !== 'number' || quantity < 1) {
      throw createError(400, `quantity invalide pour l’item à l’index ${idx}`)
    }
    return { product: productId, quantity }
  })

  const order = await SalesOrder.create({
    customer: customerId,
    items: sanitizedItems,
    status: 'pending',
    createdAt: new Date()
  })

  return order.toObject()
}

/**
 * Compte les commandes selon un filtre.
 * @param {{ status?: string }} options
 * @returns {Promise<number>}
 */
exports.countOrders({ status } = {}) {
  const q = {}
  if (status) q.status = status
  return SalesOrder.countDocuments(q)
}

/**
 * Liste les commandes avec pagination et filtre de statut.
 * @param {{ status?: string, page?: number, limit?: number }} options
 * @returns {Promise<{ data: Object[], meta: { total: number, page: number, limit: number } }>}
 */
exports.listOrders({ status, page = 1, limit = 50 } = {}) {
  const q = {}
  if (status) q.status = status

  const skip = (Math.max(page, 1) - 1) * limit
  const [ total, data ] = await Promise.all([
    countOrders({ status }),
    SalesOrder.find(q)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
  ])

  return { data, meta: { total, page, limit } }
}
})();