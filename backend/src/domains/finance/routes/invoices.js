const express = require('express');
const { celebrate } = require('celebrate');
const {
  validateCreateInvoice,
  validateGetInvoices,
} = require('../validators/invoiceValidation');
const {
  createInvoice,
  getInvoices,
} = require('../controllers/invoiceController');
const { authMiddleware } = require('../../../shared/middleware/authMiddleware');

const router = express.Router();

// 📤 Créer une facture
router.post(
  '/',
  authMiddleware('admin'),
  celebrate(validateCreateInvoice), // ✅ WRAP AVEC CELEBRATE
  createInvoice
);

// 📥 Lire les factures
router.get(
  '/',
  celebrate(validateGetInvoices), // ✅ WRAP AVEC CELEBRATE
  getInvoices
);

module.exports = router;
