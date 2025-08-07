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
  getAllUsers,
} = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { authSchemas, userSchemas } = require('../middlewares/validation');

const router = express.Router();

// 🔓 Routes publiques avec validation renforcée
router.post('/register', authSchemas.register, register);
router.post('/activate', activate); // TODO: Ajouter validation pour le token
router.post('/login', authSchemas.login, login);
router.post('/refresh', refresh); // TODO: Ajouter validation pour refresh token
router.post('/forgot-password', authSchemas.resetPassword, forgotPassword);
router.post('/reset-password', authSchemas.confirmResetPassword, resetPassword);

// 🔒 Routes protégées
router.get('/me', authMiddleware(), me);
router.post('/logout', authMiddleware(), logout);

// 🔒 Routes admin avec validation
router.get('/users', authMiddleware('admin'), userSchemas.listUsers, getAllUsers);

module.exports = router;
