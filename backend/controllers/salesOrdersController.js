const * as service = require('../services/salesOrdersService.js');
const { celebrate, Joi, Segments } = require('celebrate');

exports.validateCreateOrder = celebrate({
  [Segments.BODY]: Joi.object({
    customerId: Joi.string().hex().length(24).required(),
    items: Joi.array().items(Joi.object({
        productId: Joi.string().hex().length(24).required(),
        quantity: Joi.number().integer().min(1).required()
    })).required()
  })
});
exports.createOrder = async (req, res, next) =>{
    try{
        const order=await service.createOrder(req.body);
        res.status(201).json({status:'success',data:order});
    }catch(err){
        next(err);
    }
};

exports.validateGetOrders = celebrate({
  [Segments.QUERY]: Joi.object({
    status: Joi.string().optional(),
    page: Joi.number().min(1).optional(),
    limit: Joi.number().max(200).optional()
  })
});
exports.getOrders = async (req, res, next) =>{
    try{
        const{data,meta}=await service.listOrders(req.query);
        res.json({status:'success',data,meta});
    }catch(err){
        next(err);
    }
};