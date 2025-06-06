// backend/routes/expenses.js
const express = require('express');
const { createExpense, getExpenses, validateCreateExpense, validateGetExpenses } = require('../controllers/expenseController.js');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(authMiddleware());

router.post('/', validateCreateExpense, createExpense);
router.get('/', validateGetExpenses, getExpenses);

module.exports = router;
