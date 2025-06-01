const express = require('express');
const {
  register,
  activate,
  login,
  refresh,
  me,
  logout,
} = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware'); // ✅ destructuring

const router = express.Router();

// 🔓 Routes publiques
router.post('/register', register);
router.post('/activate', activate);
router.post('/login', login);
router.post('/refresh', refresh);

// 🔒 Routes protégées
router.get('/me', authMiddleware(), me);
router.post('/logout', authMiddleware(), logout);

module.exports = router;
