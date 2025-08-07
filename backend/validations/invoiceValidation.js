const { Joi, Segments } = require('celebrate');

// Schéma de validation pour les éléments de facture
const invoiceItemSchema = Joi.object({
  catalogueItem: Joi.string().hex().length(24).required(),
  description: Joi.string().min(1).max(500).required(),
  quantity: Joi.number().integer().min(1).required(),
  unitPrice: Joi.number().min(0).precision(2).required(),
  discount: Joi.number().min(0).max(100).default(0),
  taxRate: Joi.number().min(0).max(100).default(20)
});

// Schéma de validation pour les informations client
const clientSchema = Joi.object({
  type: Joi.string().valid('individual', 'company').default('individual'),
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().optional().allow(''),
  phone: Joi.string().pattern(/^[+]?[0-9\s\-()]+$/).optional().allow(''),
  address: Joi.object({
    street: Joi.string().max(200).optional().allow(''),
    city: Joi.string().max(100).optional().allow(''),
    postalCode: Joi.string().max(20).optional().allow(''),
    country: Joi.string().max(100).default('France')
  }).optional(),
  siret: Joi.string().pattern(/^[0-9]{14}$/).optional().allow(''),
  vatNumber: Joi.string().optional().allow('')
});

// 🎯 Validation lors de la création d'une facture
const validateCreateInvoice = {
  [Segments.BODY]: Joi.object().keys({
    client: clientSchema.required(),
    employee: Joi.string().hex().length(24).required(),
    pole: Joi.string().valid('Création', 'Entretien', 'Événements', 'Vente', 'Conseil').required(),
    project: Joi.string().hex().length(24).optional().allow(''),
    items: Joi.array().items(invoiceItemSchema).min(1).required(),
    paymentTerms: Joi.string().valid('immediate', '15_days', '30_days', '45_days', '60_days').default('30_days'),
    paymentMethod: Joi.string().valid('cash', 'check', 'transfer', 'card', 'paypal').default('transfer'),
    notes: Joi.object({
      internal: Joi.string().max(1000).optional().allow(''),
      customer: Joi.string().max(1000).optional().allow('')
    }).optional(),
    status: Joi.string().valid('draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled').optional(),
    // Rétrocompatibilité avec l'ancienne API
    amount: Joi.number().positive().optional(),
    dueDate: Joi.date().iso().optional()
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
