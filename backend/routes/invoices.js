const express = require('express');
const { createInvoice, getInvoices, validateCreateInvoice, validateGetInvoices } = require('../controllers/invoiceController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();
router.use(authMiddleware('admin'));

router.post('/', authMiddleware, validateCreateInvoice, createInvoice);
router.get('/', authMiddleware, validateGetInvoices, getInvoices);

module.exports = router;