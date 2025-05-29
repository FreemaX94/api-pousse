const * as service = require('../services/vehicleService.js');
const { celebrate, Joi, Segments } = require('celebrate');

exports.validateCreateVehicle = celebrate({
  [Segments.BODY]: Joi.object({
    licensePlate: Joi.string().required(),
    model: Joi.string().required(),
    capacity: Joi.number().required()
  })
});
exports.createVehicle = async (req, res, next) =>{
    try{
        const v = await service.createVehicle(req.body);
        res.status(201).json({status:'success',data:v});
    }catch(err){
        next(err);
    }
};

exports.validateGetVehicles = celebrate({
  [Segments.QUERY]: Joi.object({
    capacityMin: Joi.number().optional()
  })
});
exports.getVehicles = async (req, res, next) =>{
    try{
        const{data,meta} = await service.listVehicles(req.query);
        res.json({status:'success',data,meta});
    }catch(err){
        next(err);
    }
};