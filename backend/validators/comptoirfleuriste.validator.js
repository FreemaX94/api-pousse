// File: backend/validators/comptoirfleuriste.validator.js
const { celebrate, Joi, Segments } = require('celebrate');

/**
 * Validateur pour l'import via l'extension Chrome ComptoirFleuriste
 */
const createComptoirFleuristeValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    photo: Joi.string().uri().required(),
    name: Joi.string().max(200).required(),
    price: Joi.alternatives()
      .try(Joi.number(), Joi.string().pattern(/^[0-9]+(?:[.,][0-9]+)?(?:\s*€)?$/))
      .required(),
    diameter: Joi.string().optional().allow(null, ''),
    height: Joi.string().optional().allow(null, '')
  })
});

module.exports = {
  createComptoirFleuristeValidator
};
