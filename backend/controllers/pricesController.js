const service = require('../services/pricesService.js');
const { celebrate, Joi, Segments } = require('celebrate');

exports.validateGetPrices = celebrate({
  [Segments.QUERY]: Joi.object({
    productId: Joi.string().hex().length(24).optional(),
    page: Joi.number().min(1).optional(),
    limit: Joi.number().max(200).optional()
  })
});
exports.getPrices = async (req, res, next) =>{
    try{
        const{data,meta}=await service.listPrices(req.query);
        res.json({status:'success',data,meta});
    }catch(err){
        next(err);
    }
};

exports.validateCreatePrice = celebrate({
  [Segments.BODY]: Joi.object({
    productId: Joi.string().hex().length(24).required(),
    price: Joi.number().positive().required(),
    currency: Joi.string().length(3).required(),
    validFrom: Joi.date().optional()
  })
});
exports.createPrice = async (req, res, next) =>{
    try{
        const p=await service.createPrice(req.body);
        res.status(201).json({status:'success',data:p});
    }catch(err){
        next(err);
    }
};
