const Movement = require("../models/movementModel");
const NieuwkoopItem = require("../models/nieuwkoopItemModel");

// 🔄 Réserver du stock lors d’une sortie
async function reserveStock(reference, quantity) {
  const item = await NieuwkoopItem.findOne({ reference });
  if (!item) throw new Error("Article introuvable");

  const stockDispo = item.quantity - (item.reservedQuantity || 0);
  if (stockDispo < quantity) throw new Error("Stock insuffisant");

  item.reservedQuantity = (item.reservedQuantity || 0) + quantity;
  await item.save();
}

// ♻️ Libérer du stock lors d’un retour
async function releaseStock(reference, quantity) {
  const item = await NieuwkoopItem.findOne({ reference });
  if (!item) return;

  item.reservedQuantity = Math.max(0, (item.reservedQuantity || 0) - quantity);
  await item.save();
}

module.exports = {
  reserveStock,
  releaseStock,
};
