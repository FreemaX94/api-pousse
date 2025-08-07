const service = require('../services/expenseService.js');
const { celebrate, Joi, Segments } = require('celebrate');
const Expense = require('../models/Expense');

exports.validateCreateExpense = celebrate({
  [Segments.BODY]: Joi.object({
    amount: Joi.number().positive().required(),
    description: Joi.string().required(),
    date: Joi.date().required(),
    currency: Joi.string().length(3).required(),
    category: Joi.string().optional(),
    vendor: Joi.object().optional()
  })
});

exports.createExpense = async (req, res, next) => {
  try {
    const expenseData = {
      ...req.body,
      createdBy: req.user?.userId
    };
    const e = await service.createExpense(expenseData);
    res.status(201).json({ status: 'success', data: e });
  } catch (err) {
    next(err);
  }
};

exports.validateGetExpenses = celebrate({
  [Segments.QUERY]: Joi.object({
    from: Joi.date().optional(),
    to: Joi.date().optional(),
    page: Joi.number().min(1).optional(),
    limit: Joi.number().max(200).optional(),
    category: Joi.string().optional(),
    status: Joi.string().optional(),
    search: Joi.string().optional(),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').optional()
  })
});

exports.getExpenses = async (req, res, next) => {
  try {
    const { data, meta } = await service.listExpenses(req.query);
    res.json({ status: 'success', data, pagination: meta });
  } catch (err) {
    next(err);
  }
};

exports.getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('createdBy', 'username email');
    if (!expense) {
      return res.status(404).json({ status: 'error', message: 'Dépense non trouvée' });
    }
    res.json({ status: 'success', data: expense });
  } catch (err) {
    next(err);
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('createdBy', 'username email');
    
    if (!expense) {
      return res.status(404).json({ status: 'error', message: 'Dépense non trouvée' });
    }
    
    res.json({ status: 'success', data: expense });
  } catch (err) {
    next(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ status: 'error', message: 'Dépense non trouvée' });
    }
    res.json({ status: 'success', message: 'Dépense supprimée' });
  } catch (err) {
    next(err);
  }
};

exports.getExpenseStats = async (req, res, next) => {
  try {
    const { period = 'year' } = req.query;
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);
    
    const stats = await Expense.getExpenseStats(startDate, endDate);
    res.json({ status: 'success', data: stats });
  } catch (err) {
    next(err);
  }
};

exports.getExpensesByCategory = async (req, res, next) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const categories = await Expense.getExpensesByCategory(parseInt(year));
    res.json({ status: 'success', data: categories });
  } catch (err) {
    next(err);
  }
};

exports.getPendingExpenses = async (req, res, next) => {
  try {
    const pending = await Expense.getPendingApprovals();
    res.json({ status: 'success', data: pending });
  } catch (err) {
    next(err);
  }
};

exports.approveExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ status: 'error', message: 'Dépense non trouvée' });
    }
    
    await expense.approve(req.user?.userId, req.body.notes);
    res.json({ status: 'success', data: expense });
  } catch (err) {
    next(err);
  }
};

exports.rejectExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ status: 'error', message: 'Dépense non trouvée' });
    }
    
    await expense.reject(req.user?.userId, req.body.reason);
    res.json({ status: 'success', data: expense });
  } catch (err) {
    next(err);
  }
};