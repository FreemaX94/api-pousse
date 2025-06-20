const Movement = require("../models/movementModel");
const NieuwkoopItem = require("../models/nieuwkoopItemModel"); // pour mettre à jour le stock si besoin

// ➕ Créer un mouvement (entrée ou sortie)
exports.createMovement = async (req, res) => {
  try {
    const { type, reference, name, quantity, eventDate, returnPlannedAt, projet, commentaire, createdBy } = req.body;

    if (!type || !reference || !name || !quantity || !eventDate || !projet || !createdBy) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    // Vérif quantité dispo si sortie
    if (type === "sortie") {
      const item = await NieuwkoopItem.findOne({ reference });
      if (!item) return res.status(404).json({ error: "Article introuvable" });
      const stockDispo = item.quantity - (item.reservedQuantity || 0);
      if (stockDispo < quantity) {
        return res.status(400).json({ error: "Stock insuffisant" });
      }

      // Réserver la quantité
      item.reservedQuantity = (item.reservedQuantity || 0) + quantity;
      await item.save();
    }

    const newMovement = await Movement.create({
      type,
      reference,
      name,
      quantity,
      eventDate,
      returnPlannedAt,
      projet,
      commentaire,
      createdBy,
    });

    res.status(201).json(newMovement);
  } catch (err) {
    console.error("Erreur création mouvement:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 📋 Obtenir tous les mouvements
exports.getAllMovements = async (req, res) => {
  try {
    const movements = await Movement.find().sort({ createdAt: -1 });
    res.json(movements);
  } catch (err) {
    res.status(500).json({ error: "Erreur chargement mouvements" });
  }
};

// ✅ Valider un mouvement
exports.validateMovement = async (req, res) => {
  try {
    const movement = await Movement.findById(req.params.id);
    if (!movement) return res.status(404).json({ error: "Mouvement introuvable" });

    movement.validated = true;
    await movement.save();

    res.json(movement);
  } catch (err) {
    res.status(500).json({ error: "Erreur validation" });
  }
};

// ♻️ Marquer comme retourné
exports.markAsReturned = async (req, res) => {
  try {
    const movement = await Movement.findById(req.params.id);
    if (!movement) return res.status(404).json({ error: "Mouvement introuvable" });

    if (movement.type !== "sortie") {
      return res.status(400).json({ error: "Seules les sorties peuvent être retournées" });
    }

    const item = await NieuwkoopItem.findOne({ reference: movement.reference });
    if (item) {
      item.reservedQuantity = Math.max(0, (item.reservedQuantity || 0) - movement.quantity);
      await item.save();
    }

    movement.returned = true;
    await movement.save();

    res.json(movement);
  } catch (err) {
    res.status(500).json({ error: "Erreur retour" });
  }
};
