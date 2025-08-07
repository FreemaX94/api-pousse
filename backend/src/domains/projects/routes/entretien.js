// backend/routes/entretien.js
const { authMiddleware } = require('../../../shared/middleware/authMiddleware');
const express = require('express');
const router = express.Router();
router.use(authMiddleware());

router.get('/', (req, res) => {
  res.send('Route entretien OK');
});

module.exports = router;
