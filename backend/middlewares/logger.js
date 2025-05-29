const mongoose = require('mongoose');

module.exports = function logger(req, res, next) {
  console.log('➡️', req.method, req.originalUrl);
  console.log('🧩 DB:', mongoose.connection.name);
  if (req.headers.authorization) {
    console.log('🔑 Auth header:', req.headers.authorization);
  }
  next();
}
