function errorHandler(err, req, res, next) {
  // Erreurs issues de celebrate (Joi)
  if (err.isCelebrate) {
    const message = err.details.message || 'Validation failed';
    return res.status(err.statusCode || 400).json({
      status: err.statusCode || 400,
      message,
      name: 'ValidationError'
    });
  }

  const status = err.status || 500;

  // Si l'erreur a une méthode toJSON, on l’utilise
  if (typeof err.toJSON === 'function') {
    return res.status(status).json(err.toJSON());
  }

  // Sinon, format par défaut
  return res.status(status).json({
    status,
    message: err.message || 'Internal Server Error',
    name: err.name || 'InternalError'
  });
}

module.exports = errorHandler;
