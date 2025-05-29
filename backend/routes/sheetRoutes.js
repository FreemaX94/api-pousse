const express = require('express');
const { Sheet, exportSheet, validateImportSheet, validateExportSheet } = require('../controllers/sheetController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/import', authMiddleware, validateImportSheet, importSheet);
router.get('/export', authMiddleware, validateExportSheet, exportSheet);

module.exports = router;