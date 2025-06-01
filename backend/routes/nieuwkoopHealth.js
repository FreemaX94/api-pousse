const authMiddleware = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
router.use(authMiddleware());

router.get('/health', (req, res) => res.json({ status: 'success', data: 'OK' }));

module.exports = router;