const createError = require('http-errors');
const mongoose = require('mongoose');
const Invoice = require('../models/Invoice.js');

exports.createInvoice = async ({ client, employee, pole, details, amount, dueDate }) => {
  if (!client || !employee || !pole || amount == null || !dueDate) {
    throw createError(400, 'Champs requis manquants');
  }

  const inv = await Invoice.create({
    client,
    employee,
    pole,
    details,
    amount,
    dueDate: new Date(dueDate)
  });
  return inv.toObject();
};

exports.countInvoices = async ({ status } = {}) => {
  const q = {};
  if (status) q.status = status;
  return Invoice.countDocuments(q);
};

exports.listInvoices = async ({ status, page = 1, limit = 50 } = {}) => {
  const q = {};
  if (status) q.status = status;
  const skip = (Math.max(page, 1) - 1) * limit;

  const [total, data] = await Promise.all([
    exports.countInvoices({ status }),
    Invoice.find(q)
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(limit)
      .lean()
  ]);

  return { data, meta: { total, page, limit } };
};

exports.getInvoiceById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de facture invalide');
  }
  const inv = await Invoice.findById(id).lean();
  if (!inv) {
    throw createError(404, 'Facture non trouvée');
  }
  return inv;
};

exports.updateInvoice = async (id, update) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de facture invalide');
  }
  const payload = {};
  if (update.client) payload.client = update.client;
  if (update.employee) payload.employee = update.employee;
  if (update.pole) payload.pole = update.pole;
  if (update.details !== undefined) payload.details = update.details;
  if (update.amount != null) payload.amount = update.amount;
  if (update.dueDate) payload.dueDate = new Date(update.dueDate);
  if (update.status) payload.status = update.status;

  const updated = await Invoice.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true }
  ).lean();

  if (!updated) {
    throw createError(404, 'Facture non trouvée');
  }
  return updated;
};

exports.deleteInvoice = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de facture invalide');
  }
  const deleted = await Invoice.findByIdAndDelete(id).lean();
  if (!deleted) {
    throw createError(404, 'Facture non trouvée');
  }
  return deleted;
};
