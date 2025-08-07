// backend/routes/expenses.js
const express = require('express');
const { 
  createExpense, 
  getExpenses, 
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseStats,
  getExpensesByCategory,
  getPendingExpenses,
  approveExpense,
  rejectExpense,
  validateCreateExpense, 
  validateGetExpenses 
} = require('../controllers/expenseController.js');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(authMiddleware());

// Routes statistiques (avant les routes avec paramètres)
router.get('/stats', getExpenseStats);
router.get('/by-category', getExpensesByCategory);
router.get('/pending-approval', getPendingExpenses);

// Routes CRUD
router.post('/', validateCreateExpense, createExpense);
router.get('/', validateGetExpenses, getExpenses);
router.get('/:id', getExpenseById);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

// Actions spécifiques
router.patch('/:id/approve', approveExpense);
router.patch('/:id/reject', rejectExpense);

module.exports = router;
