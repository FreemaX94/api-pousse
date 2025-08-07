// backend/routes/contractsRoutes.js
const { authMiddleware } = require('../../../shared/middleware/authMiddleware');
const express = require('express');
const router = express.Router();
router.use(authMiddleware('admin'));

router.get('/', (req, res) => {
  res.status(200).json({ message: 'ok' });
});

module.exports = router;
