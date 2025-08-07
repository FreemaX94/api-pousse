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
    status: Joi.string().valid('pending', 'paid', 'late', 'draft', 'sent', 'partial', 'overdue', 'cancelled').optional(),
    client: Joi.string().optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(1000).optional(),
    from: Joi.date().optional(),
    to: Joi.date().optional(),
    search: Joi.string().optional(),
    sortBy: Joi.string().valid('client', 'amount', 'dueDate', 'status', 'createdAt', 'date', 'invoiceNumber', 'client.name', 'amounts.totalTTC', 'dates.issueDate', 'dates.dueDate').optional(),
    sortOrder: Joi.string().valid('asc', 'desc').optional(),
    pole: Joi.string().valid('Création', 'Entretien', 'Événements', 'Vente', 'Conseil').optional(),
    employee: Joi.string().hex().length(24).optional(),
    dateFrom: Joi.date().iso().optional(),
    dateTo: Joi.date().iso().optional(),
    dueDateFrom: Joi.date().iso().optional(),
    dueDateTo: Joi.date().iso().optional(),
    minAmount: Joi.number().min(0).optional(),
    maxAmount: Joi.number().optional(),
    overdue: Joi.boolean().optional()
  }),
};

module.exports = {
  validateCreateInvoice,
  validateGetInvoices,
};
