// backend/routes/sanitizeTest.js
const { authMiddleware } = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
router.use(authMiddleware());

router.get('/', (req, res) => {
  res.send('Route sanitizeTest OK');
});

module.exports = router;
