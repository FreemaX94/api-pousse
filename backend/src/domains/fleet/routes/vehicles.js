const express = require('express');
const { 
  createVehicle, 
  getVehicles, 
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getVehicleStats,
  getExpiringDocuments,
  uploadDocument,
  validateCreateVehicle, 
  validateGetVehicles 
} = require('../controllers/vehicleController.js');

// ✅ Import correct de authMiddleware
const { authMiddleware } = require('../../../shared/middleware/authMiddleware.js');

const router = express.Router();

// Routes statistiques (avant les routes avec paramètres)
router.get('/stats', getVehicleStats);
router.get('/expiring-documents', getExpiringDocuments);

// Routes CRUD
router.post('/', authMiddleware('admin'), validateCreateVehicle, createVehicle);
router.get('/', validateGetVehicles, getVehicles);
router.get('/:id', getVehicleById);
router.put('/:id', authMiddleware('admin'), updateVehicle);
router.delete('/:id', authMiddleware('admin'), deleteVehicle);

// Upload de documents
router.post('/:id/documents', authMiddleware('user'), uploadDocument);

module.exports = router;