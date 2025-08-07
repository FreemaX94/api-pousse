// backend/services/expenseService.js
const createError = require('http-errors');
const mongoose = require('mongoose');
const Expense = require('../models/Expense.js');

/**
 * Crée une nouvelle dépense.
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
async function createExpense(payload) {
  const { amount, description, date, currency, category = 'other', createdBy } = payload;
  
  if (amount == null || description == null || date == null || currency == null) {
    throw createError(400, 'Tous les champs (amount, description, date, currency) sont requis');
  }
  
  const expenseData = {
    amount,
    description,
    date,
    currency,
    category,
    createdBy,
    status: 'draft',
    ...payload
  };
  
  const exp = await Expense.create(expenseData);
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
 * Liste les dépenses avec pagination et filtres.
 * @param {Object} options
 * @returns {Promise<{ data: Object[], meta: Object }>}
 */
async function listExpenses(options = {}) {
  const { 
    from, 
    to, 
    category, 
    status, 
    search, 
    page = 1, 
    limit = 50,
    sortBy = 'date',
    sortOrder = 'desc'
  } = options;

  const query = {};
  
  // Filtres de dates
  if (from) query.date = { ...query.date, $gte: new Date(from) };
  if (to) query.date = { ...query.date, $lte: new Date(to) };
  
  // Filtres par catégorie et statut
  if (category) query.category = category;
  if (status) query.status = status;
  
  // Recherche textuelle
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { description: searchRegex },
      { 'vendor.name': searchRegex }
    ];
  }

  const skip = (Math.max(page, 1) - 1) * limit;
  
  // Tri
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const [total, data] = await Promise.all([
    Expense.countDocuments(query),
    Expense.find(query)
      .populate('createdBy', 'username email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()
  ]);

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.max(page, 1);

  return { 
    data, 
    meta: { 
      totalItems: total,
      currentPage,
      totalPages,
      limit,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    } 
  };
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
