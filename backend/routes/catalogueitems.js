// backend/routes/catalogueitems.js
const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const CatalogueItem = require('../models/CatalogueItem');

const router = express.Router();
router.use(authMiddleware());

router.get('/', async (req, res) => {
  const items = await CatalogueItem.find();
  res.status(200).json(items);
});

router.post('/', async (req, res) => {
  const newItem = new CatalogueItem(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

router.put('/:id', async (req, res) => {
  const updated = await CatalogueItem.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updated);
});

router.delete('/:id', async (req, res) => {
  await CatalogueItem.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;
