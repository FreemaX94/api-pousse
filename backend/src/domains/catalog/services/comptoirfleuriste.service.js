// File: backend/services/comptoirfleuriste.service.js
const ComptoirFleuristeItem = require('../models/comptoirfleuriste.model');

/**
 * Crée un nouvel item ComptoirFleuriste en base de données.
 * @param {{ photo: string, name: string, price: string|number, diameter?: string, height?: string }} data
 * @returns {Promise<Object>} L'objet créé en base.
 */
async function createItem(data) {
  const { photo, name, price, diameter, height } = data;
  // Si le prix est une chaîne (ex. "17,95 €"), on nettoie et convertit en nombre
  const priceNumber = typeof price === 'string'
    ? parseFloat(price.replace(/[^0-9.,]/g, '').replace(',', '.'))
    : price;

  const item = new ComptoirFleuristeItem({
    photo,
    name,
    price: priceNumber,
    diameter,
    height
  });
  return item.save();
}

module.exports = {
  createItem
};
