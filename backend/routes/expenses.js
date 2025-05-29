const express = require('express');
const { createExpense, getExpenses, validateCreateExpense, validateGetExpenses } = require('../controllers/expenseController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/', authMiddleware, validateCreateExpense, createExpense);
router.get('/', authMiddleware, validateGetExpenses, getExpenses);

module.exports = router;