const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const CatalogueItem = require('../models/CatalogueItem');

router.get('/', authMiddleware, async (req, res) => {
  const items = await CatalogueItem.find();
  res.status(200).json(items);
});

router.post('/', authMiddleware, async (req, res) => {
  const newItem = new CatalogueItem(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

router.put('/:id', authMiddleware, async (req, res) => {
  const updated = await CatalogueItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updated);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  await CatalogueItem.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;