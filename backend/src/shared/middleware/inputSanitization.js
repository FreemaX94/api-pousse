// Fonction de sanitization XSS simplifiée (autonome)
const simpleXssSanitize = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
};

// Fonction de sanitization MongoDB simplifiée (autonome)
const simpleMongoSanitize = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        console.warn(`MongoDB injection attempt detected: ${key} = ${obj[key]}`);
        obj[key.replace(/[$\.]/g, '_')] = obj[key];
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        simpleMongoSanitize(obj[key]);
      }
    }
  }
};

const sanitizeInput = (req, res, next) => {
  const sanitizeRecursive = (obj) => {
    if (obj && typeof obj === 'object') {
      simpleMongoSanitize(obj);
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = simpleXssSanitize(obj[key]);
        } else if (typeof obj[key] === 'object') {
          sanitizeRecursive(obj[key]);
        }
      }
    }
  };

  sanitizeRecursive(req.body);
  sanitizeRecursive(req.query);
  sanitizeRecursive(req.params);
  
  next();
};

// Middleware MongoDB autonome
const mongoSanitize = (req, res, next) => {
  simpleMongoSanitize(req.body);
  simpleMongoSanitize(req.query);
  simpleMongoSanitize(req.params);
  next();
};

module.exports = {
  sanitizeInput,
  mongoSanitize
};