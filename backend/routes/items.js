const express = require('express');
const { createItem, getItems, validateCreateItem, validateGetItems } = require('../controllers/itemsController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const adminMiddleware = require('../middlewares/adminMiddleware.js');

const router = express.Router();
router.use(authMiddleware());

router.post('/', authMiddleware, adminMiddleware, validateCreateItem, createItem);
router.get('/', validateGetItems, getItems);

module.exports = router;