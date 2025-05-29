const * as service = require('../services/produitsService.js');
const { celebrate, Joi, Segments } = require('celebrate');

exports.validateCreateProduit = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.number().positive().required(),
    category: Joi.string().required()
  })
});
exports.createProduit = async (req, res, next) =>{
    try{
        const prod=await service.createProduit(req.body);
        res.status(201).json({status:'success',data:prod});
    }catch(err){
        next(err);
    }
};

exports.validateGetProduits = celebrate({
  [Segments.QUERY]: Joi.object({
    category: Joi.string().optional(),
    page: Joi.number().min(1).optional(),
    limit: Joi.number().max(200).optional()
  })
});
exports.getProduits = async (req, res, next) =>{
    try{
        const{data,meta}=await service.listProduits(req.query);
        res.json({status:'success',data,meta});
    }catch(err){
        next(err);
    }
};