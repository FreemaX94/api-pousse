// backend/routes/depots.js
const { authMiddleware } = require('../../../shared/middleware/authMiddleware');
const express = require('express');
const router = express.Router();
router.use(authMiddleware());

router.get('/', (req, res) => {
  res.send('Route depots OK');
});

module.exports = router;
