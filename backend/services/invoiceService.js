(async () => {
// backend/services/invoiceService.js
const createError = require('http-errors');
const mongoose = require('mongoose');
const Invoice = require('../models/Invoice.js');

/**
 * Crée une nouvelle facture.
 * @param {{ orderId: string, amount: number, dueDate: Date|string }} payload
 * @returns {Promise<Object>}
 */
exports.createInvoice({ orderId, amount, dueDate }) {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw createError(400, 'orderId invalide')
  }
  if (amount == null) {
    throw createError(400, 'amount est requis')
  }
  if (!dueDate) {
    throw createError(400, 'dueDate est requis')
  }

  const inv = await Invoice.create({
    orderId,
    amount,
    dueDate: new Date(dueDate)
  })
  return inv.toObject()
}

/**
 * Compte les factures selon filtre.
 * @param {{ status?: string }} filter
 * @returns {Promise<number>}
 */
exports.countInvoices({ status } = {}) {
  const q = {}
  if (status) q.status = status
  return Invoice.countDocuments(q)
}

/**
 * Liste les factures avec pagination et filtre de statut.
 * @param {{ status?: string, page?: number, limit?: number }} options
 * @returns {Promise<{ data: Object[], meta: { total: number, page: number, limit: number } }>}
 */
exports.listInvoices({ status, page = 1, limit = 50 } = {}) {
  const q = {}
  if (status) q.status = status

  const skip = (Math.max(page, 1) - 1) * limit
  const [ total, data ] = await Promise.all([
    countInvoices({ status }),
    Invoice.find(q)
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(limit)
      .lean()
  ])
  return { data, meta: { total, page, limit } }
}

/**
 * Récupère une facture par son ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
exports.getInvoiceById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de facture invalide')
  }
  const inv = await Invoice.findById(id).lean()
  if (!inv) {
    throw createError(404, 'Facture non trouvée')
  }
  return inv
}

/**
 * Met à jour une facture existante.
 * @param {string} id
 * @param {{ amount?: number, dueDate?: Date|string, status?: string }} update
 * @returns {Promise<Object>}
 */
exports.updateInvoice(id, update) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de facture invalide')
  }
  const payload = {}
  if (update.amount != null) payload.amount = update.amount
  if (update.dueDate) payload.dueDate = new Date(update.dueDate)
  if (update.status) payload.status = update.status

  const updated = await Invoice.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true }
  ).lean()
  if (!updated) {
    throw createError(404, 'Facture non trouvée')
  }
  return updated
}

/**
 * Supprime une facture.
 * @param {string} id
 * @returns {Promise<Object>}
 */
exports.deleteInvoice(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de facture invalide')
  }
  const deleted = await Invoice.findByIdAndDelete(id).lean()
  if (!deleted) {
    throw createError(404, 'Facture non trouvée')
  }
  return deleted
}
})();