const createError = require('http-errors');

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(createError(403, 'Accès réservé aux administrateurs'));
  }
  next();
};

module.exports = requireAdmin;
