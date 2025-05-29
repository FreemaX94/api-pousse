const express = require('express');
const { getProduits, createProduit, validateGetProduits, validateCreateProduit } = require('../controllers/produitsController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const adminMiddleware = require('../middlewares/adminMiddleware.js');

const router = express.Router();

router.get('/', validateGetProduits, getProduits);
router.post('/', authMiddleware, adminMiddleware, validateCreateProduit, createProduit);

module.exports = router;