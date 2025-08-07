const { celebrate, Joi, Segments } = require('celebrate');

/**
 * Validator pour l'entité Événement
 * - nom       : chaîne de caractères, obligatoire, non vide
 * - dateDebut : date ISO, obligatoire
 * - dateFin   : date ISO, obligatoire, doit être >= dateDebut
 * - lieu      : chaîne, obligatoire
 * - client    : chaîne, optionnel
 */

const createEvenementValidator = celebrate({
  [Segments.BODY]: Joi.object({
    nom: Joi.string().trim().required(),
    dateDebut: Joi.date().iso().required(),
    dateFin: Joi.date().iso().min(Joi.ref('dateDebut')).required()
      .messages({ 'date.min': 'dateFin doit être postérieure ou égale à dateDebut' }),
    lieu: Joi.string().trim().required(),
    client: Joi.string().trim().optional(),
  })
});

const updateEvenementValidator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required()
      .messages({ 'string.length': 'L\'ID doit contenir 24 caractères hexadécimaux' }),
  }),
  [Segments.BODY]: Joi.object({
    nom: Joi.string().trim(),
    dateDebut: Joi.date().iso(),
    dateFin: Joi.date().iso().min(Joi.ref('dateDebut'))
      .messages({ 'date.min': 'dateFin doit être postérieure ou égale à dateDebut' }),
    lieu: Joi.string().trim(),
    client: Joi.string().trim(),
  }).min(1)
    .messages({ 'object.min': 'Au moins un champ doit être fourni pour la mise à jour' }),
});

const getEvenementValidator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
});

const deleteEvenementValidator = getEvenementValidator;

module.exports = {
  createEvenementValidator,
  updateEvenementValidator,
  getEvenementValidator,
  deleteEvenementValidator,
};