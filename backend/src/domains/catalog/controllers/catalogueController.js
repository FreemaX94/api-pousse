const service = require('../services/catalogueService.js');
const { celebrate, Joi, Segments } = require('celebrate');

// ✅ Validation pour récupérer un catalogue par catégorie
exports.validateGetByCategorie = celebrate({
  [Segments.PARAMS]: Joi.object({ 
    categorie: Joi.string().required() 
  })
});

// 🔍 Récupération des éléments par catégorie
exports.getByCategorie = async (req, res, next) => {
  try {
    const items = await service.findByCategorie(req.params.categorie);
    res.json({ status: 'success', data: items });
  } catch (err) {
    next(err);
  }
};

// ✅ Validation pour création d’un élément
exports.validateCreateItem = celebrate({
  [Segments.BODY]: Joi.object({
    categorie: Joi.string().required(),
    nom: Joi.string().required(),
    infos: Joi.object().optional()
  })
});

// ➕ Création d’un nouvel élément dans le catalogue
exports.createItem = async (req, res, next) => {
  try {
    const item = await service.createItem(req.body);
    res.status(201).json({ status: 'success', data: item });
  } catch (err) {
    next(err);
  }
};

// 🧾 Récupérer tous les éléments du catalogue
exports.getAllItems = async (req, res, next) => {
  try {
    const items = await service.findAllItems();
    res.json({ status: 'success', data: items });
  } catch (err) {
    next(err);
  }
};

// ✏️ Validation et mise à jour d'un élément
exports.validateUpdateItem = celebrate({
  [Segments.PARAMS]: Joi.object({ id: Joi.string().required() }),
  [Segments.BODY]: Joi.object({
    categorie: Joi.string().optional(),
    nom: Joi.string().optional(),
    infos: Joi.object().optional()
  })
});

exports.updateItem = async (req, res, next) => {
  try {
    const updated = await service.updateItem(req.params.id, req.body);
    res.json({ status: 'success', data: updated });
  } catch (err) {
    next(err);
  }
};

// 🗑️ Validation et suppression d’un élément
exports.validateDeleteItem = celebrate({
  [Segments.PARAMS]: Joi.object({ id: Joi.string().required() })
});

exports.deleteItem = async (req, res, next) => {
  try {
    await service.deleteItem(req.params.id);
    res.status(204).send(); // No Content
  } catch (err) {
    next(err);
  }
};

// 📊 Compter les éléments par catégorie
exports.countItemsByCategory = async (req, res, next) => {
  try {
    const counts = await service.countByCategory();
    res.json({ status: 'success', data: counts });
  } catch (err) {
    next(err);
  }
};
