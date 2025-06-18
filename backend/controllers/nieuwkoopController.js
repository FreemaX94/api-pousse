const fs = require('fs');
const nieuwkoopApi = require('../services/nieuwkoopApi');
const NieuwkoopItem = require('../models/nieuwkoopItemModel');

// 🔍 API Nieuwkoop - Infos produits
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

    const item = await NieuwkoopItem.create({
      reference,
      name,
      height,
      diameter,
      price,
      image,
      quantity: 1
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("❌ Erreur ajout Nieuwkoop item:", err.message);
    res.status(500).json({ error: "Erreur serveur lors de l'ajout." });
  }
};

// ✅ Récupérer les produits
exports.getNieuwkoopItems = async (req, res) => {
  try {
    const items = await NieuwkoopItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("❌ Erreur récupération des items Nieuwkoop:", err.message);
    res.status(500).json({ error: "Erreur lors de la récupération." });
  }
};

// ✅ Mettre à jour la quantité
exports.updateNieuwkoopQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantité invalide." });
    }

    const updated = await NieuwkoopItem.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Article introuvable." });
    }

    res.json(updated);
  } catch (err) {
    console.error("❌ Erreur mise à jour quantité:", err.message);
    res.status(500).json({ error: "Erreur serveur lors de la mise à jour." });
  }
};

// ✅ Supprimer un article
exports.deleteNieuwkoopItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await NieuwkoopItem.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Article introuvable." });
    }

    res.json({ message: "Article supprimé avec succès." });
  } catch (err) {
    console.error("❌ Erreur suppression article:", err.message);
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
};

// ✅ Supprimer tous les articles
exports.deleteAllNieuwkoopItems = async (req, res) => {
  try {
    await NieuwkoopItem.deleteMany();
    res.json({ message: "Tous les articles ont été supprimés." });
  } catch (err) {
    console.error("❌ Erreur suppression globale:", err);
    res.status(500).json({ error: "Erreur lors de la suppression globale." });
  }
};

// ✅ Mettre à jour une note
exports.updateNieuwkoopNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const updated = await NieuwkoopItem.findByIdAndUpdate(
      id,
      { note },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Article introuvable." });
    }

    res.json(updated);
  } catch (err) {
    console.error("❌ Erreur mise à jour note:", err.message);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// 📚 Catalogue (API externe)
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

// 🧾 Stock général
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

// Health check
exports.getHealth = async (req, res, next) => {
  try {
    const data = await nieuwkoopApi.fetchHealth();
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};
