const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const helmet = require('helmet');

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes
  message: 'Trop de requêtes, veuillez réessayer plus tard',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting strict pour auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 tentatives
  skipSuccessfulRequests: true,
  message: 'Trop de tentatives de connexion',
});

// Rate limiting pour opérations sensibles
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10,
  message: 'Limite atteinte pour cette opération',
});

// CSRF protection
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// Security headers middleware
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.removeHeader('X-Powered-By');
  next();
};

module.exports = {
  globalLimiter,
  authLimiter,
  strictLimiter,
  csrfProtection,
  securityHeaders,
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ['\'self\''],
        imgSrc: ['\'self\'', 'data:', 'https:'],
        scriptSrc: ['\'self\''],
        styleSrc: ['\'self\'', '\'unsafe-inline\''],
        connectSrc: ['\'self\''],
        fontSrc: ['\'self\''],
        objectSrc: ['\'none\''],
        mediaSrc: ['\'self\''],
        frameSrc: ['\'none\'']
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  })
};
