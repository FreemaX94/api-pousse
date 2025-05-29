const Delivery = require('../models/Delivery');

/**
 * Crée une livraison
 */
async function createDelivery(data) {
  return Delivery.create(data);
}

/**
 * Récupère les livraisons filtrées et triées
 */
async function getDeliveries(filter) {
  return Delivery.find(filter).sort({ date: -1 }).exec();
}

/**
 * Met à jour une livraison par ID
 */
async function updateDelivery(id, data) {
  const updated = await Delivery.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw new Error('Delivery not found');
  return updated;
}

/**
 * Supprime une livraison par ID
 */
async function deleteDelivery(id) {
  const deleted = await Delivery.findByIdAndDelete(id);
  if (!deleted) throw new Error('Delivery not found');
  return deleted;
}

module.exports = { createDelivery, getDeliveries, updateDelivery, deleteDelivery };
