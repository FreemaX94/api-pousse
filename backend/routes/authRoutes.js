const express = require('express');
const router = express.Router();
const { register, activate, login, refresh, me, logout } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/activate', activate);
router.post('/refresh', refresh);

// 🔒 Routes protégées
router.get('/me', authMiddleware(), me);
router.post('/logout', authMiddleware(), logout);

module.exports = router;
