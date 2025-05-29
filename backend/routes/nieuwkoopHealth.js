const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'success', data: 'OK' }));

module.exports = router;