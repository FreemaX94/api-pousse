// backend/routes/sheetSyncRoutes.js
const express = require('express');
const { syncSheet } = require('../controllers/sheetSyncController.js');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(authMiddleware());

router.post('/sync', syncSheet);

module.exports = router;
