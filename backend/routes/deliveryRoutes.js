const express = require('express');
const {
  createDelivery,
  getDeliveries,
  validateCreateDelivery,
  validateGetDeliveries
} = require('../controllers/deliveryController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, validateCreateDelivery, createDelivery);
router.get('/', authMiddleware, validateGetDeliveries, getDeliveries);

module.exports = router;
