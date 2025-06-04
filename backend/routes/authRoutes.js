const express = require('express');
const {
  register,
  activate,
  login,
  refresh,
  me,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware'); // ✅ destructuring

const router = express.Router();

// 🔓 Routes publiques
router.post('/register', register);
router.post('/activate', activate);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// 🔒 Routes protégées
router.get('/me', authMiddleware(), me);
router.post('/logout', authMiddleware(), logout);

module.exports = router;
