// backend/app.js

const express = require('express');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const logger = require('./utils/logger');
const { globalLimiter, helmet, authLimiter, strictLimiter } = require('./middlewares/security');
const { sanitizeInput, mongoSanitize } = require('./middlewares/inputSanitization');
const { smartRateLimit, rateLimitMonitoring } = require('./middlewares/rateLimiting');
const { sanitizeData, validationErrorHandler } = require('./middlewares/validation');
const { BusinessMetrics } = require('./utils/metrics');

const app = express();

// Sécurité globale
app.use(helmet);
app.use(globalLimiter);

// CORS global et pré-vol
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://api-pousse-app-5y2wo.ondigitalocean.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Rate limiting granulaire intelligent
app.use(smartRateLimit);
app.use(rateLimitMonitoring);

// Parser JSON, URL-encoded, cookies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Input sanitization renforcée
app.use(mongoSanitize);
app.use(sanitizeInput);
app.use(sanitizeData);

// 📊 Business Metrics Tracking
app.use(BusinessMetrics.trackingMiddleware());

// 📊 New Relic APM Monitoring
try {
  const { apmMiddleware, databaseMetricsMiddleware } = require('./middlewares/monitoring');
  app.use(apmMiddleware);
  app.use(databaseMetricsMiddleware());
  console.log('✅ Middlewares monitoring activés');
} catch (error) {
  console.log('⚠️ Middlewares monitoring non disponibles:', error.message);
}

// Montage des routes
function setupRoutes() {
  app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
  app.use('/api/stocks', require('./routes/stocks'));
  app.use('/api/invoices', require('./routes/invoices'));
  app.use('/api/expenses', require('./routes/expenses'));
  app.use('/api/vehicles', require('./routes/vehicles'));
  app.use('/api/concepteurs', require('./routes/concepteurs'));
  app.use('/api/catalogue', require('./routes/catalogue'));
  app.use('/api/catalogueitems', require('./routes/catalogueitems'));
  app.use('/api/nieuwkoop', require('./routes/nieuwkoop'));
  // Correction: utiliser eventsRoutes.js et non events.js
  app.use('/api/events', require('./routes/eventsRoutes'));
  app.use('/api/movements', require('./routes/movementRoutes'));
  app.use('/api/partneritems', require('./routes/partnerItems'));
  app.use('/api/evenements', require('./routes/evenements'));
  app.use('/api/comptoirfleuriste', require('./routes/comptoirfleuriste'));
  app.use('/api/projets', require('./routes/projets'));
  app.use('/api/nieuwkoop-proxy', require('./routes/nieuwkoopProxy'));
  app.use('/api/livraisons', require('./routes/livraisons'));
  app.use('/api/entretiens', require('./routes/entretienRoutes'));
  app.use('/api/sync', require('./routes/sync'));
  app.use('/api/health', require('./routes/health'));
  app.use('/api/security', require('./routes/securityRoutes'));
  app.use('/api/monitoring', require('./routes/monitoringRoutes'));
  app.use('/api/rbac', require('./routes/rbac'));
  app.use('/api/security-monitoring', require('./routes/securityMonitoring'));
}

setupRoutes();

// Route de test pour vérifier le routage DigitalOcean
app.get('/test-route', (req, res) => {
  res.json({ message: 'Route de test fonctionne !', timestamp: new Date().toISOString() });
});

// Debug: endpoint pour tester la structure des fichiers
app.get('/debug/files', (req, res) => {
  const publicPath = path.join(__dirname, 'public');
  const indexPath = path.join(__dirname, 'public', 'index.html');
  
  const debug = {
    __dirname,
    publicPath,
    indexPath,
    publicExists: fs.existsSync(publicPath),
    indexExists: fs.existsSync(indexPath),
    files: []
  };
  
  try {
    if (fs.existsSync(publicPath)) {
      debug.files = fs.readdirSync(publicPath);
    }
  } catch (e) {
    debug.error = e.message;
  }
  
  res.json(debug);
});

// Servir les fichiers statiques du frontend React
// Priorité à dist/ (DigitalOcean), puis public/ (local)
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

// Validation des requêtes Celebrate + custom handler
app.use(errors());
app.use(validationErrorHandler);

// 🚨 New Relic Error Tracking
try {
  const { errorTrackingMiddleware } = require('./middlewares/monitoring');
  app.use(errorTrackingMiddleware);
} catch (error) {
  console.log('⚠️ Error tracking middleware non disponible');
}

// Handler global des erreurs
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';
  logger.error(`Erreur ${status} :`, message);
  res.status(status).json({ error: message });
});

// Fallback pour les routes React (SPA) - doit être EN DERNIER
app.get('*', (req, res) => {
  // Ne pas intercepter les routes API
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Route API non trouvée' });
  }
  
  // Chercher index.html dans dist/ puis public/
  let indexPath = path.join(__dirname, 'dist', 'index.html');
  if (!fs.existsSync(indexPath)) {
    indexPath = path.join(__dirname, 'public', 'index.html');
  }
  
  logger.log(`Tentative d'accès à: ${req.path}, redirection vers: ${indexPath}`);
  
  // Vérifier si le fichier existe
  if (!fs.existsSync(indexPath)) {
    logger.error(`Fichier index.html non trouvé: ${indexPath}`);
    return res.status(404).json({ error: 'Frontend non trouvé' });
  }
  
  res.sendFile(indexPath);
});

module.exports = { app, setupRoutes };
// Force deploy
