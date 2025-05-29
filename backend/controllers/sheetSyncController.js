const * as service = require('../services/sheetSyncService.js');
const { celebrate, Joi, Segments } = require('celebrate');

exports.syncSheet = async (req, res, next) =>{
    try{
        const report = await service.syncSheet();
        res.status(200).json({status:'success',data:report});
    }catch(err){
        next(err);
    }
};