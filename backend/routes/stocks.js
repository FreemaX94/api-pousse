const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// ✅ Correction ici : on extrait bien la fonction authMiddleware
const { authMiddleware } = require('../middlewares/authMiddleware');

const { celebrate, Joi, Segments } = require('celebrate');

// 🔒 Route protégée avec validation de la query
router.get(
  '/',
  authMiddleware,
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      categorie: Joi.string().required()
    })
  }),
  stockController.getStockByCategory
);

// 🔒 Export des stocks sécurisé
router.get('/export', authMiddleware, stockController.exportStocks);

module.exports = router;
