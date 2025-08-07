// backend/routes/eventsRoutes.js
const { authMiddleware } = require('../../../shared/middleware/authMiddleware');
const express = require('express');
const router = express.Router();
// Temporarily disable auth for testing
// router.use(authMiddleware());

router.get('/', (req, res) => {
  res.status(200).json({ message: 'ok' });
});

module.exports = router;
