const express = require('express');
const { createOrder, getOrders, validateCreateOrder, validateGetOrders } = require('../controllers/salesOrdersController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/', authMiddleware, validateCreateOrder, createOrder);
router.get('/', authMiddleware, validateGetOrders, getOrders);

module.exports = router;