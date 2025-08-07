// backend/routes/stocks.js

const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { 
  getStockByCategory, 
  getStockById,
  createStockEntry,
  updateStockEntry,
  deleteStockEntry,
  exportStocks 
} = require('../controllers/stockController');

const router = express.Router();

// 🔒 Récupération des stocks par catégorie ou recherche libre
router.get(
  '/',
  authMiddleware(),
  celebrate({
    [Segments.QUERY]: Joi.object()
      .keys({
        search:    Joi.string().optional(),
        categorie: Joi.string()
          .valid('Plantes', 'Contenants', 'Décor', 'Artificiels', 'Séchés')
          .optional()
      })
      // autorise d’autres params (ex. page, sort…)
      .unknown(true)
  }),
  getStockByCategory
);

// 🔒 Récupération d'un stock par son ID unique
router.get(
  '/:stockId',
  authMiddleware(),
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      stockId: Joi.string().pattern(/^ST-\d{4}-\d{4}$/).required()
    })
  }),
  getStockById
);

// 🔒 Création d'une nouvelle entrée de stock
router.post(
  '/',
  authMiddleware(),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      product: Joi.string().required(),
      categorie: Joi.string()
        .valid('Plantes', 'Contenants', 'Décor', 'Artificiels', 'Séchés')
        .required(),
      quantity: Joi.number().min(0).required(),
      type: Joi.string().valid('in', 'out', 'adjust').required()
    })
  }),
  createStockEntry
);

// 🔒 Mise à jour d'une entrée de stock
router.put(
  '/:stockId',
  authMiddleware(),
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      stockId: Joi.string().pattern(/^ST-\d{4}-\d{4}$/).required()
    }),
    [Segments.BODY]: Joi.object().keys({
      product: Joi.string().optional(),
      categorie: Joi.string()
        .valid('Plantes', 'Contenants', 'Décor', 'Artificiels', 'Séchés')
        .optional(),
      quantity: Joi.number().min(0).optional(),
      type: Joi.string().valid('in', 'out', 'adjust').optional()
    })
  }),
  updateStockEntry
);

// 🔒 Suppression d'une entrée de stock
router.delete(
  '/:stockId',
  authMiddleware(),
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      stockId: Joi.string().pattern(/^ST-\d{4}-\d{4}$/).required()
    })
  }),
  deleteStockEntry
);

// 🔒 Export PDF/CSV selon catégorie
router.get(
  '/export',
  authMiddleware(),
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      categorie: Joi.string()
        .valid('Plantes', 'Contenants', 'Décor', 'Artificiels', 'Séchés')
        .optional(),
      format: Joi.string().valid('csv', 'pdf').optional()
    })
  }),
  exportStocks
);

module.exports = router;
