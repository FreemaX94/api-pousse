// backend/src/validators/projetValidator.js
const { celebrate, Joi, Segments } = require('celebrate');

const objectId = Joi.string().length(24).hex();

const createProjetValidator = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      client: Joi.string().required(),
      description: Joi.string().allow('').optional(),
      dateDebut: Joi.date().iso().required(),
      dateFin: Joi.date().iso().min(Joi.ref('dateDebut')).required(),
      statut: Joi.string().valid('En cours', 'Terminé', 'Archivé').optional(),
      files: Joi.array().items(Joi.string()).optional()
    })
    .unknown(true) // laisse passer les champs multipart ou autres métadonnées
});

const idParamValidator = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: objectId.required()
  })
});

const updateProjetValidator = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: objectId.required()
  }),
  [Segments.BODY]: Joi.object()
    .keys({
      client: Joi.string(),
      description: Joi.string().allow(''),
      dateDebut: Joi.date().iso(),
      dateFin: Joi.date().iso(),
      statut: Joi.string().valid('En cours', 'Terminé', 'Archivé'),
      files: Joi.array().items(Joi.string())
    })
    .min(1)
    .unknown(true)
});

module.exports = {
  createProjetValidator,
  idParamValidator,
  updateProjetValidator
};