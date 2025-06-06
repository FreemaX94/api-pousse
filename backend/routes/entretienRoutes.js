// backend/routes/entretienRoutes.js
const { authMiddleware } = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
router.use(authMiddleware());

router.get('/', (req, res) => {
  res.status(200).json({ message: 'ok' });
});

module.exports = router;
