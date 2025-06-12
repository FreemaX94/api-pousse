const service = require('../services/itemsService.js');
const { celebrate, Joi, Segments } = require('celebrate');

exports.validateCreateItem = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    data: Joi.object().optional()
  })
});
exports.createItem = async (req, res, next) =>{
    try{
        const it=await service.createItem(req.body);
        res.status(201).json({status:'success',data:it});
    }catch(err){
        next(err);
    }
};

exports.validateGetItems = celebrate({
  [Segments.QUERY]: Joi.object({
    type: Joi.string().optional(),
    page: Joi.number().min(1).optional(),
    limit: Joi.number().max(200).optional()
  })
});
exports.getItems = async (req, res, next) =>{
    try{
        const{data,meta}=await service.listItems(req.query);
        res.json({status:'success',data,meta});
    }catch(err){
        next(err);
    }
};
