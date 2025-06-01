const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const { authMiddleware } = require('../middlewares/authMiddleware'); // ✅ correction ici

const router = express.Router();

// 🔒 Route protégée avec validation de la query
router.get(
  '/',
  authMiddleware(), // ✅ appelle bien la fonction
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      search: Joi.string().optional(),
    }),
  }),
  async (req, res) => {
    try {
      // Logique métier de récupération des stocks (à compléter si besoin)
      res.status(200).json({ message: 'Stocks récupérés avec succès' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
