// backend/routes/items.js
const express = require('express');
const { createItem, getItems, validateCreateItem, validateGetItems } = require('../controllers/itemsController.js');
const { authMiddleware } = require('../../../shared/middleware/authMiddleware');
const adminMiddleware = require('../../../shared/middleware/adminMiddleware.js');

const router = express.Router();
router.use(authMiddleware());

router.post('/', adminMiddleware, validateCreateItem, createItem);
router.get('/', validateGetItems, getItems);

module.exports = router;
