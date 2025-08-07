// backend/routes/produits.js
const express = require('express');
const { getProduits, createProduit, validateGetProduits, validateCreateProduit } = require('../controllers/produitsController.js');
const { authMiddleware } = require('../../../shared/middleware/authMiddleware');
const adminMiddleware = require('../../../shared/middleware/adminMiddleware.js');

const router = express.Router();
router.use(authMiddleware());

router.get('/', validateGetProduits, getProduits);
router.post('/', adminMiddleware, validateCreateProduit, createProduit);

module.exports = router;
