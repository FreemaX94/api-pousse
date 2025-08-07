const deliveryService = require('../services/deliveryService');

const create = async (req, res, next) => {
  try {
    const delivery = await deliveryService.createDelivery(req.body);
    res.status(201).json(delivery);
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const deliveries = await deliveryService.getDeliveries();
    res.status(200).json(deliveries);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const updated = await deliveryService.updateDelivery(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteDelivery = async (req, res, next) => {
  try {
    await deliveryService.deleteDelivery(req.params.id);
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  getAll,
  update,
  delete: deleteDelivery,
};
