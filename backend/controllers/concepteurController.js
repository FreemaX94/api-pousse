const * as service = require('../services/concepteurService.js');
const { celebrate, Joi, Segments } = require('celebrate');

exports.getAllConcepteurs = async (req, res, next) => {
  try {
    const list = await service.listConcepteurs();
    res.json({ status: 'success', data: list });
  } catch (err) {
    next(err);
  }
};

exports.validateCreateConcepteur = celebrate({
  [Segments.BODY]: Joi.object({ nom: Joi.string().required() })
});
exports.createConcepteur = async (req, res, next) => {
  try {
    const c = await service.createConcepteur(req.body);
    res.status(201).json({ status: 'success', data: c });
  } catch (err) {
    next(err);
  }
};