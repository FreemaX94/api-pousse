const Joi = require('joi');

const create = {
  address: Joi.string().required(),
  date: Joi.date().iso().required(),
  status: Joi.string().valid('pending', 'shipped', 'delivered').optional()
};

module.exports = { create };
