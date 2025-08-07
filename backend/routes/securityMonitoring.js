const express = require('express');
const { getStats } = require('../middlewares/bruteForceProtection');
const router = express.Router();

/**
 * GET /api/security/stats
 * Statistiques de sécurité (accès admin uniquement)
 */
router.get('/stats', (req, res) => {
  try {
    const stats = getStats();
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      security: {
        activeFailedAttempts: stats.failedAttempts,
        blockedIPs: stats.blockedIPs,
        totalBlocked: stats.totalBlocked
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques'
    });
  }
});

module.exports = router;