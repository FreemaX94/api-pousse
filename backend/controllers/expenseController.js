const service = require('../services/expenseService.js');
const { celebrate, Joi, Segments } = require('celebrate');

exports.validateCreateExpense = celebrate({
  [Segments.BODY]: Joi.object({
    amount: Joi.number().positive().required(),
    description: Joi.string().required(),
    date: Joi.date().required(),
    currency: Joi.string().length(3).required()
  })
});
exports.createExpense = async (req, res, next) => {
  try {
    const e = await service.createExpense(req.body);
    res.status(201).json({ status: 'success', data: e });
  } catch (err) {
    next(err);
  }
};

exports.validateGetExpenses = celebrate({
  [Segments.QUERY]: Joi.object({
    from: Joi.date().optional(),
    to: Joi.date().optional(),
    page: Joi.number().min(1).optional(),
    limit: Joi.number().max(200).optional()
  })
});
exports.getExpenses = async (req, res, next) =>{
    try{
        const{data,meta}=await service.listExpenses(req.query);
        res.json({status:'success',data,meta});
    } catch(err){
        next(err);
    }
};