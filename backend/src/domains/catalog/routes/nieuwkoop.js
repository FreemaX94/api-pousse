const express = require('express');
const { authMiddleware } = require('../../../shared/middleware/authMiddleware');
const controller = require('../controllers/nieuwkoopController');

const router = express.Router();

// ✅ Routes PUBLIQUES pour le plugin Nieuwkoop
router.get('/prices/:productId', controller.getItemPrice);
router.get('/stock', (req, res, next) => {
  console.log('🔍 Route GET /stock appelée (PUBLIC)');
  controller.getNieuwkoopItems(req, res, next);
});
router.get('/items/:productId/image', controller.getItemImage);

// 🔒 Protéger le reste des routes
router.use(authMiddleware());

// 🔍 Produits (API Nieuwkoop)
router.get('/items', controller.getItems);
router.get('/items/:productId', controller.getItem);
router.get('/items/:productId/details', controller.getItemDetails);

// 📦 Stock local
router.post('/stock', controller.createNieuwkoopItem);
router.put('/stock/:id', controller.updateNieuwkoopQuantity);
router.put('/stock/:id/note', controller.updateNieuwkoopNote);
router.put('/stock/:id/category', controller.updateNieuwkoopCategory); // ✅ Route de MAJ catégorie
router.delete('/stock/:id', controller.deleteNieuwkoopItem);
router.delete('/stock/all', controller.deleteAllNieuwkoopItems);

// 📚 Catalogue
router.get('/catalog', controller.getCatalog);
router.get('/catalog/:catalogId', controller.getCatalogById);

// 🧾 Stock (API officielle)
router.get('/stock/:productId', controller.getStockById);

// 🩺 Health check
router.get('/health', controller.getHealth);

// ✅ Extension Chrome
router.post('/save', controller.createNieuwkoopItem);

module.exports = router;
