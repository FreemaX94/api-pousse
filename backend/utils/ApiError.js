// backend/utils/ApiError.js

class ApiError extends Error {
  constructor(status, message, isOperational = true) {
    super(message);
    this.status = status;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
