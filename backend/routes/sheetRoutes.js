// backend/routes/sheetRoutes.js
const express = require('express');
const { Sheet, exportSheet, validateImportSheet, validateExportSheet } = require('../controllers/sheetController.js');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(authMiddleware());

router.post('/import', validateImportSheet, importSheet);
router.get('/export', validateExportSheet, exportSheet);

module.exports = router;
