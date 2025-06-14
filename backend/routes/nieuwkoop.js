// backend/routes/nieuwkoop.js

const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const controller = require('../controllers/nieuwkoopController');

const router = express.Router();

// Appliquer l'authentification à toutes les routes Nieuwkoop
router.use(authMiddleware());

// Items
router.get('/items', controller.getItems);
router.get('/items/:productId', controller.getItem);
router.get('/items/:productId/image', controller.getItemImage);

// Catalogue
router.get('/catalog', controller.getCatalog);
router.get('/catalog/:catalogId', controller.getCatalogById);

// Stock
router.get('/stock', controller.getStocks);
router.get('/stock/:productId', controller.getStockById);

// Health check
router.get('/health', controller.getHealth);

module.exports = router;
