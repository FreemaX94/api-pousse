// backend/routes/catalogue.js
const { authMiddleware } = require('../../../shared/middleware/authMiddleware');
const express = require('express');
const router = express.Router();
router.use(authMiddleware());
const controller = require('../controllers/catalogueController');

// 🔍 Récupérer tout le catalogue
router.get('/', controller.getAllItems);

// 📊 Compter les items par catégorie
router.get('/count-by-category', controller.countItemsByCategory);

// 🔍 Récupérer par catégorie
router.get('/:categorie', controller.validateGetByCategorie, controller.getByCategorie);

// ➕ Créer un item
router.post('/', controller.validateCreateItem, controller.createItem);

// ✏️ Mettre à jour un item
router.put('/:id', controller.validateUpdateItem, controller.updateItem);

// ❌ Supprimer un item
router.delete('/:id', controller.validateDeleteItem, controller.deleteItem);

module.exports = router;
