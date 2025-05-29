const express = require('express');
const { syncSheet } = require('../controllers/sheetSyncController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/sync', authMiddleware, syncSheet);

module.exports = router;