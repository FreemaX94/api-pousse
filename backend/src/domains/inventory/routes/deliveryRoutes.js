const express = require('express');
const {
  createDelivery,
  getDeliveries,
  validateCreateDelivery,
  validateGetDeliveries
} = require('../controllers/deliveryController');
const { authMiddleware } = require('../../../shared/middleware/authMiddleware');
const adminMiddleware = require('../../../shared/middleware/adminMiddleware');

const router = express.Router();
router.use(authMiddleware());

router.post('/', authMiddleware, adminMiddleware, validateCreateDelivery, createDelivery);
router.get('/', authMiddleware, validateGetDeliveries, getDeliveries);

module.exports = router;