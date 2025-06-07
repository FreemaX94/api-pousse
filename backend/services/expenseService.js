// backend/services/expenseService.js
const createError = require('http-errors');
const mongoose = require('mongoose');
const Expense = require('../models/Expense.js');

/**
 * Crée une nouvelle dépense.
 * @param {{ amount: number, description: string, date: Date|string, currency: string }} payload
 * @returns {Promise<Object>}
 */
async function createExpense({ amount, description, date, currency }) {
  if (amount == null || description == null || date == null || currency == null) {
    throw createError(400, 'Tous les champs (amount, description, date, currency) sont requis');
  }
  const exp = await Expense.create({ amount, description, date, currency });
  return exp.toObject();
}

/**
 * Compte les dépenses selon un filtre de dates.
 * @param {{ from?: Date|string, to?: Date|string }} filter
 * @returns {Promise<number>}
 */
async function countExpenses(filter = {}) {
  const q = {};
  if (filter.from) q.date = { ...q.date, $gte: new Date(filter.from) };
  if (filter.to)   q.date = { ...q.date, $lte: new Date(filter.to) };
  return Expense.countDocuments(q);
}

/**
 * Liste les dépenses avec pagination et filtre de dates.
 * @param {{ from?: Date|string, to?: Date|string, page?: number, limit?: number }} options
 * @returns {Promise<{ data: Object[], meta: { total: number, page: number, limit: number } }>}
 */
async function listExpenses({ from, to, page = 1, limit = 50 } = {}) {
  const q = {};
  if (from) q.date = { ...q.date, $gte: new Date(from) };
  if (to)   q.date = { ...q.date, $lte: new Date(to) };

  const skip = (Math.max(page, 1) - 1) * limit;
  const [ total, data ] = await Promise.all([
    countExpenses({ from, to }),
    Expense.find(q)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
  ]);

  return { data, meta: { total, page, limit } };
}

/**
 * Récupère une dépense par son ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
async function getExpenseById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de dépense invalide');
  }
  const exp = await Expense.findById(id).lean();
  if (!exp) {
    throw createError(404, 'Dépense non trouvée');
  }
  return exp;
}

/**
 * Met à jour une dépense existante.
 * @param {string} id
 * @param {{ amount?: number, description?: string, date?: Date|string, currency?: string }} update
 * @returns {Promise<Object>}
 */
async function updateExpense(id, update) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de dépense invalide');
  }
  const exp = await Expense.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
  if (!exp) {
    throw createError(404, 'Dépense non trouvée');
  }
  return exp;
}

/**
 * Supprime une dépense.
 * @param {string} id
 * @returns {Promise<Object>}
 */
async function deleteExpense(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de dépense invalide');
  }
  const exp = await Expense.findByIdAndDelete(id).lean();
  if (!exp) {
    throw createError(404, 'Dépense non trouvée');
  }
  return exp;
}

module.exports = {
  createExpense,
  countExpenses,
  listExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
};
