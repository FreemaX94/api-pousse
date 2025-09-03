const express = require('express');
const {
  register,
  activate,
  login,
  refresh,
  me,
  logout,
  forgotPassword,
  resetPassword
  // revokeAllTokens,
  // getTokenStats,
  // autoRefresh
} = require('../controllers/authController');
const { authMiddleware } = require('../../../shared/middleware/authMiddleware'); // ✅ destructuring

const router = express.Router();

// 🔓 Routes publiques
router.post('/register', register);
router.post('/activate', activate);
router.post('/login', (req, res, next) => {
  console.log('🔥 ROUTE LOGIN HIT - Method:', req.method, 'URL:', req.url);
  login(req, res, next);
});
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// 🔒 Routes protégées
router.get('/me', authMiddleware(), me);
router.get('/test', (req, res) => res.json({ message: 'Route auth/test fonctionne' }));
router.post('/logout', authMiddleware(), logout);

// 🔄 Nouvelles routes JWT avancées - À IMPLÉMENTER
// router.post('/auto-refresh', authMiddleware(), autoRefresh);
// router.post('/revoke-all-tokens', authMiddleware(), revokeAllTokens);

// 📊 Routes admin - À IMPLÉMENTER
// router.get('/token-stats', authMiddleware('admin'), getTokenStats);

module.exports = router;
