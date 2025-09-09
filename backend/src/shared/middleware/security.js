const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const helmet = require('helmet');

// Rate limiting global - Optimisé pour équipes multiples utilisateurs
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // 5000 requêtes (adapté pour plusieurs utilisateurs simultanés)
  message: 'Trop de requêtes, veuillez réessayer plus tard',
  standardHeaders: true,
  legacyHeaders: false,
  // Clé personnalisée : par utilisateur si connecté, sinon par IP
  keyGenerator: (req) => {
    // Si utilisateur connecté, rate limit par utilisateur
    if (req.user && req.user.id) {
      return `user:${req.user.id}`;
    }
    // Sinon par IP (pour les non-connectés)
    return `ip:${req.ip}`;
  },
  // Skip pour les environnements de développement
  skip: (req) => {
    return process.env.NODE_ENV === 'development';
  }
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
  // Permettre les frames pour les PDF
  if (req.path.includes('/api/uploads/') && req.get('Accept')?.includes('application/pdf')) {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  } else {
    res.setHeader('X-Frame-Options', 'DENY');
  }
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
        objectSrc: ['\'self\''], // Permettre les objets pour PDF
        mediaSrc: ['\'self\''],
        frameSrc: ['\'self\'', 'https://www.google.com'] // Permettre les frames pour PDF
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  })
};
