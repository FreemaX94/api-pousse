const createError = require('http-errors');
const mongoose = require('mongoose');
const Concepteur = require('../models/Concepteur.js');

exports.listConcepteurs = async function () {
  const data = await Concepteur.find()
    .sort({ nom: 1 })
    .lean();
  return data;
};

exports.createConcepteur = async function ({ nom }) {
  const exists = await Concepteur.findOne({ nom });
  if (exists) {
    throw createError(409, `Un concepteur nommé « ${nom} » existe déjà`);
  }
  const newC = await Concepteur.create({ nom });
  return newC.toObject();
};

exports.updateConcepteur = async function (id, updatePayload) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de concepteur invalide');
  }
  const updated = await Concepteur.findByIdAndUpdate(
    id,
    { $set: updatePayload },
    { new: true, runValidators: true }
  ).lean();
  if (!updated) {
    throw createError(404, 'Concepteur non trouvé');
  }
  return updated;
};

exports.deleteConcepteur = async function (id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de concepteur invalide');
  }
  const deleted = await Concepteur.findByIdAndDelete(id).lean();
  if (!deleted) {
    throw createError(404, 'Concepteur non trouvé');
  }
  return deleted;
};
