const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const controller = require('../controllers/nieuwkoopController');

const router = express.Router();

// 🔐 Appliquer auth sur tout
router.use(authMiddleware());

// 🔍 Produits (API Nieuwkoop)
router.get('/items', controller.getItems);
router.get('/items/:productId', controller.getItem);
router.get('/items/:productId/image', controller.getItemImage);
router.get('/items/:productId/details', controller.getItemDetails);
router.get('/prices/:productId', controller.getItemPrice);

// 📦 Stock local (importé depuis Nieuwkoop)
router.post('/stock', controller.createNieuwkoopItem);
router.get('/stock', controller.getNieuwkoopItems);
router.put('/stock/:id', controller.updateNieuwkoopQuantity);  // ✅ modification quantité
router.delete('/stock/:id', controller.deleteNieuwkoopItem);   // ✅ suppression article

// 📚 Catalogue
router.get('/catalog', controller.getCatalog);
router.get('/catalog/:catalogId', controller.getCatalogById);

// 🧾 Stock (API officielle)
router.get('/stock/:productId', controller.getStockById);
router.get('/stock', controller.getStocks);

// 🩺 Health
router.get('/health', controller.getHealth);

module.exports = router;
