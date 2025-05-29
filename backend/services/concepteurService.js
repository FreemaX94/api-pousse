(async () => {
// backend/services/concepteurService.js
const createError = require('http-errors');
const mongoose = require('mongoose');
const Concepteur = require('../models/Concepteur.js');

/**
 * Récupère la liste de tous les concepteurs, triés par nom.
 * @returns {Promise<Object[]>} tableau de concepteurs
 */
exports.listConcepteurs() {
  const data = await Concepteur.find()
    .sort({ nom: 1 })
    .lean()
  return data
}

/**
 * Crée un nouveau concepteur.
 * @param {{ nom: string }} payload
 * @returns {Promise<Object>} le concepteur créé
 */
exports.createConcepteur({ nom }) {
  // Prévenir la création en double
  const exists = await Concepteur.findOne({ nom })
  if (exists) {
    throw createError(409, `Un concepteur nommé « ${nom} » existe déjà`)
  }
  const newC = await Concepteur.create({ nom })
  return newC.toObject()
}

/**
 * Met à jour un concepteur existant.
 * @param {string} id L'ID Mongo du concepteur
 * @param {{ nom?: string }} updatePayload
 * @returns {Promise<Object>} le concepteur mis à jour
 */
exports.updateConcepteur(id, updatePayload) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de concepteur invalide')
  }
  const updated = await Concepteur.findByIdAndUpdate(
    id,
    { $set: updatePayload },
    { new: true, runValidators: true }
  ).lean()
  if (!updated) {
    throw createError(404, 'Concepteur non trouvé')
  }
  return updated
}

/**
 * Supprime un concepteur.
 * @param {string} id L'ID Mongo du concepteur
 * @returns {Promise<Object>} le concepteur supprimé
 */
exports.deleteConcepteur(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de concepteur invalide')
  }
  const deleted = await Concepteur.findByIdAndDelete(id).lean()
  if (!deleted) {
    throw createError(404, 'Concepteur non trouvé')
  }
  return deleted
}
})();