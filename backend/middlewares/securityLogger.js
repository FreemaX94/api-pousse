const logger = require('../utils/logger');

const securityLogger = (req, res, next) => {
  const originalSend = res.send;
  const originalJson = res.json;

  res.send = function(data) {
    if (res.statusCode >= 400) {
      logger.warn(`Security event: ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
    }
    return originalSend.call(this, data);
  };

  res.json = function(data) {
    if (res.statusCode >= 400) {
      logger.warn(`Security event: ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
    }
    return originalJson.call(this, data);
  };

  next();
};

const suspiciousActivityLogger = (req, res, next) => {
  const suspiciousPatterns = [
    /\.\.\//,
    /<script/i,
    /javascript:/i,
    /onload=/i,
    /onerror=/i,
    /eval\(/i,
    /union.*select/i,
    /drop.*table/i
  ];

  const checkSuspicious = (obj, path = '') => {
    if (typeof obj === 'string') {
      if (suspiciousPatterns.some(pattern => pattern.test(obj))) {
        logger.error(`Suspicious activity detected at ${path}: ${obj} - IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
      }
    } else if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        checkSuspicious(obj[key], `${path}.${key}`);
      });
    }
  };

  checkSuspicious(req.body, 'body');
  checkSuspicious(req.query, 'query');
  checkSuspicious(req.params, 'params');

  next();
};

module.exports = {
  securityLogger,
  suspiciousActivityLogger
};