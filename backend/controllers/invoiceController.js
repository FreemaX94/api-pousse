const * as service = require('../services/invoiceService.js');
const { celebrate, Joi, Segments } = require('celebrate');

exports.validateCreateInvoice = celebrate({
  [Segments.BODY]: Joi.object({
    orderId: Joi.string().hex().length(24).required(),
    amount: Joi.number().positive().required(),
    dueDate: Joi.date().required()
  })
});
exports.createInvoice = async (req, res, next) =>{
    try{
        const inv=await service.createInvoice(req.body);
        res.status(201).json({status:'success',data:inv});
    }catch(err){
        next(err);
    }
};

exports.validateGetInvoices = celebrate({
  [Segments.QUERY]: Joi.object({
    status: Joi.string().valid('paid','unpaid','overdue').optional(),
    page: Joi.number().min(1).optional(),
    limit: Joi.number().max(200).optional()
  })
});
exports.getInvoices = async (req, res, next) =>{
    try{
        const {data,meta}=await service.listInvoices(req.query);
        res.json({status:'success',data,meta});
    }catch(err){
        next(err);
    }
};