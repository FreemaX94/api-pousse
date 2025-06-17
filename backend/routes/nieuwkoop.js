// backend/routes/nieuwkoop.js

const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const controller = require('../controllers/nieuwkoopController');

const router = express.Router();

router.use(authMiddleware());

// Items
router.get('/items', controller.getItems);
router.get('/items/:productId', controller.getItem);
router.get('/items/:productId/image', controller.getItemImage);
router.get('/items/:productId/details', controller.getItemDetails); // ✅ Détails
router.get('/prices/:productId', controller.getItemPrice); // ✅ Prix

// Catalogue
router.get('/catalog', controller.getCatalog);
router.get('/catalog/:catalogId', controller.getCatalogById);

// Stock
router.get('/stock', controller.getStocks);
router.get('/stock/:productId', controller.getStockById);

// Health
router.get('/health', controller.getHealth);

module.exports = router;
