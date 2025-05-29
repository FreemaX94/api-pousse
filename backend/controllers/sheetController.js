const * as service = require('../services/sheetService.js');
const { celebrate, Joi, Segments } = require('celebrate');

exports.validateImportSheet = celebrate({
  [Segments.BODY]: Joi.object({
    sheetData: Joi.array().items(Joi.object()).required()
  })
});
exports.importSheet = async (req, res, next) =>{
    try{
        const result = await service.importSheet(req.body.sheetData);
        res.status(200).json({status:'success',data:result});
    }catch(err){
        next(err);
    }
};

exports.validateExportSheet = celebrate({
  [Segments.QUERY]: Joi.object({
    format: Joi.string().valid('csv','xlsx').required()
  })
});
exports.exportSheet = async (req, res, next) =>{
    try{
        const file = await service.exportSheet(req.query.format);
        res.status(200).json({status:'success',data:file});
    }catch(err){
        next(err);
    }
};