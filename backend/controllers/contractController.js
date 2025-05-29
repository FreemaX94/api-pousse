const * as service = require('../services/contractService.js');
const { celebrate, Joi, Segments } = require('celebrate');

exports.validatePostContract = celebrate({
  [Segments.BODY]: Joi.object({
    clientId: Joi.string().hex().length(24).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().min(Joi.ref('startDate')).required(),
    isB2B: Joi.boolean().default(false),
    contractType: Joi.string().required()
  })
});
exports.postContract = async (req, res, next) => {
  try {
    const contract = await service.createContract(req.body);
    res.status(201).json({ status: 'success', data: contract });
  } catch (err) {
    next(err);
  }
};

exports.validateGetContracts = celebrate({
  [Segments.QUERY]: Joi.object({
    isB2B: Joi.boolean().optional(),
    contractType: Joi.string().optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(200).optional()
  })
});
exports.getContracts = async (req, res, next) => {
  try {
    const { data, meta } = await service.listContracts(req.query);
    res.json({ status: 'success', data, meta });
  } catch (err) {
    next(err);
  }
};

exports.validateGetContract = celebrate({
  [Segments.PARAMS]: Joi.object({ id: Joi.string().hex().length(24).required() })
});
exports.getContract = async (req, res, next) => {
  try {
    const c = await service.getContractById(req.params.id);
    if (!c) throw new Error('Contract not found');
    res.json({ status: 'success', data: c });
  } catch (err) {
    next(err);
  }
};