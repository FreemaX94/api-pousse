const express = require('express');
const { createVehicle, getVehicles, validateCreateVehicle, validateGetVehicles } = require('../controllers/vehicleController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const adminMiddleware = require('../middlewares/adminMiddleware.js');

const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, validateCreateVehicle, createVehicle);
router.get('/', validateGetVehicles, getVehicles);

module.exports = router;