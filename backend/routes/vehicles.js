const express = require('express');
const { createVehicle, getVehicles, validateCreateVehicle, validateGetVehicles } = require('../controllers/vehicleController.js');

// ✅ Import correct de authMiddleware
const { authMiddleware } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/', authMiddleware('admin'), validateCreateVehicle, createVehicle);
router.get('/', validateGetVehicles, getVehicles);

module.exports = router;