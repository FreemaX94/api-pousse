const express = require('express');
const {
  register,
  login,
  activate,
  me,
  logout,
  refresh
} = require('../controllers/authController.js');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Auth publiques
router.post('/register', register);
router.post('/login', login);
router.post('/activate', activate);
router.post('/refresh', refresh);

// Auth protégées
router.get('/me', authMiddleware, me);
router.post('/logout', authMiddleware, logout);

module.exports = router;