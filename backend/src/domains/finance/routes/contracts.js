// backend/routes/contracts.js
const { authMiddleware } = require('../../../shared/middleware/authMiddleware');
const express = require('express');
const router = express.Router();
router.use(authMiddleware('admin'));

router.get('/', (req, res) => {
  res.send('Route contracts OK');
});

module.exports = router;
