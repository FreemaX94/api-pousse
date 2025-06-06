// backend/routes/produits.js
const express = require('express');
const { getProduits, createProduit, validateGetProduits, validateCreateProduit } = require('../controllers/produitsController.js');
const { authMiddleware } = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware.js');

const router = express.Router();
router.use(authMiddleware());

router.get('/', validateGetProduits, getProduits);
router.post('/', adminMiddleware, validateCreateProduit, createProduit);

module.exports = router;
