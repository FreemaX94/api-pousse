const createError = require('http-errors');

module.exports = function adminMiddleware(req, res, next) {
  if (!req.user) {
    return next(createError(401, 'Utilisateur non authentifié'));
  }
  if (req.user.role !== 'admin') {
    return next(createError(403, 'Accès interdit : administrateur requis'));
  }
  next();
}