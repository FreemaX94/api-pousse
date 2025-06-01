const express = require('express');
const { celebrate } = require('celebrate');
const {
  validateCreateInvoice,
  validateGetInvoices,
} = require('../validations/invoiceValidation');
const {
  createInvoice,
  getInvoices,
} = require('../controllers/invoiceController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// 🔒 Middleware global pour les admins
router.use(authMiddleware('admin'));

// 📤 Créer une facture
router.post(
  '/',
  authMiddleware(),
  celebrate(validateCreateInvoice), // ✅ WRAP AVEC CELEBRATE
  createInvoice
);

// 📥 Lire les factures
router.get(
  '/',
  authMiddleware(),
  celebrate(validateGetInvoices), // ✅ WRAP AVEC CELEBRATE
  getInvoices
);

module.exports = router;
