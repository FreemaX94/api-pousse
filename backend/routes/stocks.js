const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getStockByCategory, exportStocks } = require('../controllers/stockController'); // MODIF : import des controllers

const router = express.Router();

// 🔒 Récupération des stocks par catégorie
router.get(
  '/',
  authMiddleware(), // vous protégez toujours la route
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      search: Joi.string().optional(),
      categorie: Joi.string()                             // MODIF : on autorise la query `categorie`
        .valid('Plantes', 'Contenants', 'Décor', 'Artificiels', 'Séchés')
        .required(),                                      // obligatoire côté back
    }),
  }),
  getStockByCategory                                    // MODIF : on appelle directement le controller
);

// (Optionnel) 🔒 Export PDF des stocks par catégorie
router.get(
  '/export',
  authMiddleware(),
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      categorie: Joi.string()
        .valid('Plantes', 'Contenants', 'Décor', 'Artificiels', 'Séchés')
        .required(),
    }),
  }),
  exportStocks                                          // MODIF : export via controller
);

module.exports = router;
