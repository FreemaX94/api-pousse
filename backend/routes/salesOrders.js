// backend/routes/salesOrders.js
const express = require('express');
const { createOrder, getOrders, validateCreateOrder, validateGetOrders } = require('../controllers/salesOrdersController.js');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(authMiddleware());

router.post('/', validateCreateOrder, createOrder);
router.get('/', validateGetOrders, getOrders);

module.exports = router;
