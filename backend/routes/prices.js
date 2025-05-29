const express = require('express');
const { getPrices, createPrice, validateGetPrices, validateCreatePrice } = require('../controllers/pricesController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const adminMiddleware = require('../middlewares/adminMiddleware.js');

const router = express.Router();

router.get('/', validateGetPrices, getPrices);
router.post('/', authMiddleware, adminMiddleware, validateCreatePrice, createPrice);

module.exports = router;