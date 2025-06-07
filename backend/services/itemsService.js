// backend/services/itemsService.js
const createError = require('http-errors');
const mongoose = require('mongoose');
const Item = require('../models/Item.js');

/**
 * Crée un nouvel item générique.
 * @param {{ name: string, type: string, data?: any }} payload
 * @returns {Promise<Object>}
 */
async function createItem({ name, type, data }) {
  if (!name || !type) {
    throw createError(400, 'Les champs name et type sont requis');
  }
  // Éviter les doublons
  const exists = await Item.findOne({ name, type });
  if (exists) {
    throw createError(409, `Un item de type "${type}" nommé "${name}" existe déjà`);
  }
  const item = await Item.create({ name, type, data });
  return item.toObject();
}

/**
 * Compte les items selon filtre.
 * @param {{ type?: string }} filter
 * @returns {Promise<number>}
 */
async function countItems({ type } = {}) {
  const q = {};
  if (type) q.type = type;
  return Item.countDocuments(q);
}

/**
 * Liste les items avec pagination et filtre de type.
 * @param {{ type?: string, page?: number, limit?: number }} options
 * @returns {Promise<{ data: Object[], meta: { total: number, page: number, limit: number } }>}
 */
async function listItems({ type, page = 1, limit = 50 } = {}) {
  const q = {};
  if (type) q.type = type;

  const skip = (Math.max(page, 1) - 1) * limit;
  const [ total, data ] = await Promise.all([
    countItems({ type }),
    Item.find(q)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean()
  ]);

  return { data, meta: { total, page, limit } };
}

/**
 * Récupère un item par son ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
async function getItemById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID d’item invalide');
  }
  const item = await Item.findById(id).lean();
  if (!item) {
    throw createError(404, 'Item non trouvé');
  }
  return item;
}

/**
 * Met à jour un item existant.
 * @param {string} id
 * @param {{ name?: string, type?: string, data?: any }} update
 * @returns {Promise<Object>}
 */
async function updateItem(id, update) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID d’item invalide');
  }
  const payload = {};
  if (update.name) payload.name = update.name;
  if (update.type) payload.type = update.type;
  if (update.data !== undefined) payload.data = update.data;

  const updated = await Item.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true
  }).lean();

  if (!updated) {
    throw createError(404, 'Item non trouvé');
  }
  return updated;
}

/**
 * Supprime un item.
 * @param {string} id
 * @returns {Promise<Object>}
 */
async function deleteItem(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID d’item invalide');
  }
  const deleted = await Item.findByIdAndDelete(id).lean();
  if (!deleted) {
    throw createError(404, 'Item non trouvé');
  }
  return deleted;
}

module.exports = {
  createItem,
  countItems,
  listItems,
  getItemById,
  updateItem,
  deleteItem
};
