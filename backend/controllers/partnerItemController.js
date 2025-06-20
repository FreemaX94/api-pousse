const PartnerItem = require("../models/partnerItemModel");

// 📥 Créer un article partenaire
exports.createPartnerItem = async (req, res) => {
  try {
    const { reference, name, quantity, price, image, note } = req.body;

    if (!reference || !name) {
      return res.status(400).json({ error: "Nom et référence requis" });
    }

    const newItem = new PartnerItem({
      reference,
      name,
      quantity: quantity || 1,
      price: price || 0,
      image,
      note: note || "",
    });

    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Erreur création partenaire:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 📄 Obtenir tous les articles partenaires
exports.getAllPartnerItems = async (req, res) => {
  try {
    const items = await PartnerItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Erreur chargement articles" });
  }
};
