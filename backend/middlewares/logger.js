const mongoose = require('mongoose');
const { log } = require('../utils/logger');

module.exports = function logger(req, res, next) {
  log('➡️', req.method, req.originalUrl);
  log('🧩 DB:', mongoose.connection.name);
  if (req.headers.authorization) {
    log('🔑 Auth header:', req.headers.authorization);
  }
  next();
}
