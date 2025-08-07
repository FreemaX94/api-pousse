const createError = require('http-errors');
const Contract = require('../models/contractModel.js');
const mongoose = require('mongoose');

exports.createContract = async function (data) {
  const { clientId, startDate, endDate, contractType, isB2B = false } = data;
  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    throw createError(400, 'Invalid clientId');
  }
  const contract = new Contract({ client: clientId, startDate, endDate, contractType, isB2B });
  await contract.save();
  return contract.toObject();
};

exports.countContracts = function (filter = {}) {
  return Contract.countDocuments(filter);
};

exports.listContracts = async function ({ isB2B, contractType, page = 1, limit = 50 } = {}) {
  const filter = {};
  if (typeof isB2B === 'boolean') filter.isB2B = isB2B;
  if (contractType) filter.contractType = contractType;

  const skip = (page - 1) * limit;
  const [total, data] = await Promise.all([
    exports.countContracts(filter),
    Contract.find(filter).sort({ startDate: -1 }).skip(skip).limit(limit).lean()
  ]);
  const meta = { total, page, limit };
  return { data, meta };
};

exports.getContractById = async function (id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'Invalid contract id');
  }
  const contract = await Contract.findById(id).lean();
  if (!contract) {
    throw createError(404, 'Contract not found');
  }
  return contract;
};

exports.updateContract = async function (id, update) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'Invalid contract id');
  }
  const contract = await Contract.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
  if (!contract) {
    throw createError(404, 'Contract not found');
  }
  return contract;
};

exports.deleteContract = async function (id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'Invalid contract id');
  }
  const result = await Contract.findByIdAndDelete(id).lean();
  if (!result) {
    throw createError(404, 'Contract not found');
  }
  return result;
};
