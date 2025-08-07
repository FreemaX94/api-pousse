/**
 * Crée une erreur API enrichie avec status, message et nom
 * @param {number} status - Code HTTP (ex: 404, 500)
 * @param {string} message - Message lisible par l'utilisateur
 * @param {string} [name='ApiError'] - Type d'erreur
 * @returns {Error}
 */
function createError(status, message, name = 'ApiError') {
  const err = new Error(message);
  err.status = status;
  err.name = name;
  err.toJSON = function () {
    return {
      status: this.status,
      message: this.message,
      name: this.name
    };
  };
  return err;
}

module.exports = createError;
