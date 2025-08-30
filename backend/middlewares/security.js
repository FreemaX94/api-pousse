const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting désactivé pour permettre plusieurs connexions simultanées
const globalLimiter = (req, res, next) => next(); // Désactivé
const authLimiter = (req, res, next) => next(); // Désactivé  
const strictLimiter = (req, res, next) => next(); // Désactivé

// CSRF protection - Alternative implementation without csurf
const csrfProtection = (req, res, next) => {
  // Pour les API REST, utiliser Double Submit Cookie pattern
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
    const token = req.headers['x-csrf-token'] || req.body._csrf;
    if (!token || token !== req.session?.csrfToken) {
      return res.status(403).json({ error: 'Token CSRF invalide' });
    }
  }
  next();
};

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
        imgSrc: ['\'self\'', 'data:', 'https:', 'http://localhost:3001'],
        scriptSrc: ['\'self\'', 'https://www.google.com', 'https://www.gstatic.com'],
        styleSrc: ['\'self\'', '\'unsafe-inline\'', 'https://fonts.googleapis.com'],
        connectSrc: ['\'self\'', 'https://www.google.com'],
        fontSrc: ['\'self\'', 'https://fonts.gstatic.com'],
        objectSrc: ['\'none\''],
        mediaSrc: ['\'self\''],
        frameSrc: ['https://www.google.com']
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  })
};
