const { celebrate, Joi, Segments } = require('celebrate');
const asyncHandler = require('express-async-handler');
const invoiceService = require('../services/invoiceService');

exports.validateCreateInvoice = celebrate({
  [Segments.BODY]: Joi.object({
    client: Joi.string().required(),
    employee: Joi.string().required(),
    pole: Joi.string().required(),
    details: Joi.string().allow('').optional(),
    amount: Joi.number().required(),
    dueDate: Joi.date().required(),
    date: Joi.date().required() // <-- Toujours requis pour ton dashboard
  })
});

exports.validateGetInvoices = celebrate({
  [Segments.QUERY]: Joi.object({
    status: Joi.string().valid('paid', 'unpaid').optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional()
  })
});

exports.createInvoice = asyncHandler(async (req, res) => {

  const invoice = await invoiceService.createInvoice(req.body);
  res.status(201).json({ status: 'success', data: invoice });
});

exports.getInvoices = asyncHandler(async (req, res) => {
  const list = await invoiceService.listInvoices(req.query);
  res.status(200).json({ status: 'success', ...list });
});
