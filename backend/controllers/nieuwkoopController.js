const fs = require('fs');
const nieuwkoopApi = require('../services/nieuwkoopApi');
const NieuwkoopItem = require('../models/nieuwkoopItemModel');

exports.getItems = async (req, res, next) => {
  try {
    const data = await nieuwkoopApi.fetchItems();
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.getItem = async (req, res, next) => {
  try {
    const data = await nieuwkoopApi.fetchItem(req.params.productId);
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.getItemImage = async (req, res, next) => {
  try {
    const buffer = await nieuwkoopApi.fetchItemImage(req.params.productId);
    if (!buffer) {
      return res.status(404).send("Image not found");
    }

    const filePath = `./test_${req.params.productId}.jpg`;
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Image sauvegardée localement : ${filePath}`);

    res.set('Content-Type', 'image/jpeg');
    res.send(buffer);
  } catch (err) {
    console.error("❌ Erreur getItemImage:", err);
    res.status(500).send("Erreur image Nieuwkoop");
  }
};

exports.getItemDetails = async (req, res, next) => {
  try {
    const item = await nieuwkoopApi.fetchItem(req.params.productId);
    res.json({ item });
  } catch (err) {
    console.error("❌ Erreur getItemDetails:", err.message);
    res.status(500).json({ error: "Erreur lors de la récupération du produit." });
  }
};

exports.getItemPrice = async (req, res, next) => {
  try {
    const price = await nieuwkoopApi.fetchItemPrice(req.params.productId);
    res.json({ price });
  } catch (err) {
    console.error("❌ Erreur getItemPrice:", err.message);
    res.status(500).json({ error: "Erreur lors de la récupération du prix." });
  }
};

// ✅ Ajouter un produit au stock local
exports.createNieuwkoopItem = async (req, res) => {
  try {
    const { reference, name, height, diameter, price } = req.body;
    const image = `/api/nieuwkoop/items/${reference}/image`;

    const exists = await NieuwkoopItem.findOne({ reference });
    if (exists) {
      return res.status(400).json({ message: 'Ce produit est déjà dans le stock local.' });
    }

    const item = await NieuwkoopItem.create({ reference, name, height, diameter, price, image });
    res.status(201).json(item);
  } catch (err) {
    console.error("❌ Erreur ajout Nieuwkoop item:", err.message);
    res.status(500).json({ error: "Erreur serveur lors de l'ajout." });
  }
};

// ✅ Récupérer tous les produits stockés localement
exports.getNieuwkoopItems = async (req, res) => {
  try {
    const items = await NieuwkoopItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("❌ Erreur récupération des items Nieuwkoop:", err.message);
    res.status(500).json({ error: "Erreur lors de la récupération." });
  }
};

exports.getCatalog = async (req, res, next) => {
  try {
    const data = await nieuwkoopApi.fetchCatalog();
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.getCatalogById = async (req, res, next) => {
  try {
    const data = await nieuwkoopApi.fetchCatalogById(req.params.catalogId);
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.getStocks = async (req, res, next) => {
  try {
    const data = await nieuwkoopApi.fetchStock();
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.getStockById = async (req, res, next) => {
  try {
    const data = await nieuwkoopApi.fetchStockById(req.params.productId);
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.getHealth = async (req, res, next) => {
  try {
    const data = await nieuwkoopApi.fetchHealth();
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};
