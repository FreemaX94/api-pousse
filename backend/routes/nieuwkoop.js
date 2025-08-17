const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const controller = require('../controllers/nieuwkoopController');

// 📊 Monitoring pour Nieuwkoop
let businessMetricsMiddleware;
try {
  businessMetricsMiddleware = require('../middlewares/monitoring').businessMetricsMiddleware;
} catch (error) {
  businessMetricsMiddleware = (type) => (req, res, next) => next();
}

const router = express.Router();

// ✅ Route PUBLIQUE pour le plugin Nieuwkoop
router.get('/prices/:productId', controller.getItemPrice);

// 🔒 Protéger le reste des routes
router.use(authMiddleware());

// 🔍 Produits (API Nieuwkoop)
router.get('/items', controller.getItems);
router.get('/items/:productId', controller.getItem);
router.get('/items/:productId/image', controller.getItemImage);
router.get('/items/:productId/details', controller.getItemDetails);

// 📦 Stock local
router.post('/stock', controller.createNieuwkoopItem);
router.get('/stock', businessMetricsMiddleware('nieuwkoop_search'), controller.getNieuwkoopItems);
router.put('/stock/:id', controller.updateNieuwkoopQuantity);
router.put('/stock/:id/note', controller.updateNieuwkoopNote);
router.put('/stock/:id/category', controller.updateNieuwkoopCategory); // ✅ Route de MAJ catégorie
router.put('/stock/:id/refresh-dimensions', controller.refreshNieuwkoopDimensions); // ✅ Route pour rafraîchir les dimensions depuis l'API
router.delete('/stock/:id', controller.deleteNieuwkoopItem);
router.delete('/stock/all', controller.deleteAllNieuwkoopItems);

// 📚 Catalogue
router.get('/catalog', controller.getCatalog);
router.get('/catalog/:catalogId', controller.getCatalogById);

// 🧾 Stock (API officielle)
router.get('/stock/:productId', controller.getStockById);
router.get('/stock', controller.getStocks);

// 🩺 Health check
router.get('/health', controller.getHealth);

// ✅ Extension Chrome
router.post('/save', controller.createNieuwkoopItem);

module.exports = router;
