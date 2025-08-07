// backend/routes/deliveries.js
const { authMiddleware } = require('../../../shared/middleware/authMiddleware');
const express = require('express');
const router = express.Router();
router.use(authMiddleware());

router.get('/', (req, res) => {
  res.send('Route deliveries OK');
});

module.exports = router;
