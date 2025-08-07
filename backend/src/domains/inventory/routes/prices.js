// backend/routes/prices.js
const express = require('express');
const { getPrices, createPrice, validateGetPrices, validateCreatePrice } = require('../controllers/pricesController.js');
const { authMiddleware } = require('../../../shared/middleware/authMiddleware');
const adminMiddleware = require('../../../shared/middleware/adminMiddleware.js');

const router = express.Router();
router.use(authMiddleware());

router.get('/', validateGetPrices, getPrices);
router.post('/', adminMiddleware, validateCreatePrice, createPrice);

module.exports = router;
