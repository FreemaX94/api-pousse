const express = require('express');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { authSchemas, userSchemas } = require('../middlewares/validation');

const router = express.Router();

// 🔓 Routes publiques avec validation renforcée
router.post('/register', ...authController.register);
router.post('/activate', ...authController.activate); // TODO: Ajouter validation pour le token
router.post('/login', authSchemas.login, ...authController.login);
router.post('/refresh', ...authController.refresh); // TODO: Ajouter validation pour refresh token
router.post('/forgot-password', ...authController.forgotPassword);
router.post('/reset-password', ...authController.resetPassword);

// 🔒 Routes protégées
router.get('/me', authMiddleware(), authController.me);
router.post('/logout', authMiddleware(), authController.logout);

// 🔒 Routes admin avec validation
router.get('/users', authMiddleware('admin'), userSchemas.listUsers, authController.getAllUsers);

module.exports = router;
