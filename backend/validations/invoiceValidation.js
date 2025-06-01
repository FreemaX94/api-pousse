const { Joi, Segments } = require('celebrate');

// 🎯 Validation lors de la création d'une facture
const validateCreateInvoice = {
  [Segments.BODY]: Joi.object().keys({
    client: Joi.string().required().messages({
      'any.required': 'Le nom du client est requis',
      'string.base': 'Le client doit être une chaîne de caractères',
    }),
    amount: Joi.number().positive().required().messages({
      'any.required': 'Le montant est requis',
      'number.base': 'Le montant doit être un nombre',
      'number.positive': 'Le montant doit être positif',
    }),
    dueDate: Joi.date().iso().required().messages({
      'any.required': 'La date d’échéance est requise',
      'date.base': 'La date doit être une date valide',
      'date.format': 'La date doit être au format ISO',
    }),
    status: Joi.string().valid('pending', 'paid', 'late').optional(),
  }),
};

// 📄 Validation pour la récupération de factures
const validateGetInvoices = {
  [Segments.QUERY]: Joi.object().keys({
    status: Joi.string().valid('pending', 'paid', 'late').optional(),
    client: Joi.string().optional(),
  }),
};

module.exports = {
  validateCreateInvoice,
  validateGetInvoices,
};
