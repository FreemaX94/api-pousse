const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const authMiddleware = require('../middlewares/authMiddleware');
const { celebrate, Joi, Segments } = require('celebrate');

router.get('/', authMiddleware, celebrate({
  [Segments.QUERY]: Joi.object().keys({
    categorie: Joi.string().required()
  })
}), stockController.getStockByCategory);

router.get('/export', authMiddleware, stockController.exportStocks);

module.exports = router;