// backend/routes/sheetRoutes.js
const express = require('express');
const { exportSheet, validateImportSheet, validateExportSheet, importSheet } = require('../controllers/sheetController.js');
const { authMiddleware } = require('../../../shared/middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware());

router.post('/import', validateImportSheet, importSheet);
router.get('/export', validateExportSheet, exportSheet);

module.exports = router;
