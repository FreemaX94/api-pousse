const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const controller = require('../controllers/nieuwkoopController');

const router = express.Router();

// 🔐 Authentification globale sur toutes les routes Nieuwkoop
router.use(authMiddleware());

// 🔍 Lecture des produits de l'API externe
router.get('/items', controller.getItems);
router.get('/items/:productId', controller.getItem);
router.get('/items/:productId/image', controller.getItemImage);
router.get('/items/:productId/details', controller.getItemDetails);
router.get('/prices/:productId', controller.getItemPrice);

// 📦 Stock local (importé depuis Nieuwkoop)
router.post('/stock', controller.createNieuwkoopItem);
router.get('/stock', controller.getNieuwkoopItems);

// 📚 Catalogue
router.get('/catalog', controller.getCatalog);
router.get('/catalog/:catalogId', controller.getCatalogById);

// 🧾 Stock API externe
router.get('/stock/:productId', controller.getStockById);
router.get('/stock', controller.getStocks);

// 🩺 Health Check
router.get('/health', controller.getHealth);

module.exports = router;
