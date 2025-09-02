// backend/src/app.js - Application principale avec architecture DDD
// FINAL DEPLOY - Configuration commit cbaab8d restaurée - 2025-09-02 23:25

const express = require('express');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

// Middlewares de sécurité
const { globalLimiter, helmet: helmetConfig, authLimiter } = require('../middlewares/security');
const { sanitizeInput, mongoSanitize } = require('../middlewares/inputSanitization');
const { sanitizeData, validationErrorHandler } = require('../middlewares/validation');

// Lazy load BusinessMetrics pour éviter les problèmes d'initialisation
let BusinessMetrics;
try {
  BusinessMetrics = require('../utils/metrics').BusinessMetrics;
} catch (error) {
  console.warn('⚠️ BusinessMetrics non disponible:', error.message);
  // Fallback simple
  BusinessMetrics = {
    trackingMiddleware: () => (req, res, next) => next()
  };
}

// Domains - Architecture DDD - On les chargera après l'initialisation d'Express
let authDomain, catalogDomain, inventoryDomain, financeDomain, fleetDomain, projectsDomain, calendarDomain;

const app = express();

// Sécurité globale
app.use(helmetConfig);
// app.use(globalLimiter); // Désactivé pour permettre plusieurs connexions simultanées

// CORS configuration
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

// Body parsing & cookies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Input sanitization
app.use(mongoSanitize);
app.use(sanitizeInput);
app.use(sanitizeData);

// Debug middleware pour toutes les requêtes
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.url} - User-Agent: ${req.get('User-Agent')?.substring(0, 50)}...`);
  next();
});

// Business Metrics (désactivé temporairement)
// app.use(BusinessMetrics.trackingMiddleware());

// Monitoring APM (désactivé temporairement)
try {
  // const { apmMiddleware, databaseMetricsMiddleware } = require('../middlewares/monitoring');
  // app.use(apmMiddleware);
  // app.use(databaseMetricsMiddleware());
  console.log('⚠️ Middlewares monitoring désactivés temporairement');
} catch (error) {
  console.log('⚠️ Middlewares monitoring non disponibles:', error.message);
}


/**
 * ARCHITECTURE DDD - Montage des domaines
 * Chaque domaine gère ses propres routes, contrôleurs, services et modèles
 */
function setupDomains() {
  try {
    console.log('🔄 Chargement des domaines...');
    
    // Charger les domaines maintenant qu'Express est initialisé
    authDomain = require('./domains/auth');
    console.log('✅ Auth domain chargé');
    catalogDomain = require('./domains/catalog');
    console.log('✅ Catalog domain chargé');
    inventoryDomain = require('./domains/inventory');
    console.log('✅ Inventory domain chargé');
    financeDomain = require('./domains/finance');
    console.log('✅ Finance domain chargé');
    fleetDomain = require('./domains/fleet');
    console.log('✅ Fleet domain chargé');
    projectsDomain = require('./domains/projects');
    console.log('✅ Projects domain chargé');
    calendarDomain = require('./domains/calendar');
    console.log('✅ Calendar domain chargé');
    
    console.log('🔄 Montage des routes...');
    
    // Authentification sans rate limiting pour les tests
    app.use('/api/auth', authDomain.routes);
    console.log('✅ Routes auth montées sur /api/auth (rate limiting désactivé)');
    
    // Domaines métier
    app.use('/api/catalog', catalogDomain.routes);
    app.use('/api/inventory', inventoryDomain.routes);
    app.use('/api/finance', financeDomain.routes);
    app.use('/api/fleet', fleetDomain.routes);
    app.use('/api/projects', projectsDomain.routes);
    app.use('/api/calendar', calendarDomain.routes);
    
    // Route Nieuwkoop legacy pour compatibilité avec l'ancien système
    app.use('/api/nieuwkoop', require('./domains/catalog/routes/nieuwkoop'));
    
    // Route Opérations diverses pour ventes inter-pôles
    app.use('/api/internal-operations', require('../routes/internalOperations'));
    
    // Routes legacy pour compatibilité avec l'ancien frontend
    // Rediriger /api/projets vers le domaine projects
    app.use('/api/projets', (req, res, next) => {
      req.url = '/projets' + req.url;
      projectsDomain.routes(req, res, next);
    });
    
    // Rediriger /api/projects vers le domaine projects/projets  
    app.use('/api/projects', (req, res, next) => {
      req.url = '/projets' + req.url;
      projectsDomain.routes(req, res, next);
    });
    
    // Rediriger /api/concepteurs vers le domaine projects
    app.use('/api/concepteurs', (req, res, next) => {
      req.url = '/concepteurs' + req.url;
      projectsDomain.routes(req, res, next);
    });
    
    // Rediriger /api/movements vers le domaine inventory
    app.use('/api/movements', (req, res, next) => {
      req.url = '/movements' + req.url;
      inventoryDomain.routes(req, res, next);
    });
    
    // Rediriger /api/mouvements vers le domaine inventory
    app.use('/api/mouvements', (req, res, next) => {
      req.url = '/movements' + req.url;
      inventoryDomain.routes(req, res, next);
    });
    
    // Rediriger /api/stock-items vers nieuwkoop/stock
    app.get('/api/stock-items', async (req, res, next) => {
      try {
        req.url = '/stock';
        const nieuwkoopRoute = require('./domains/catalog/routes/nieuwkoop');
        nieuwkoopRoute(req, res, next);
      } catch (error) {
        next(error);
      }
    });
    
    // Routes système et monitoring
    try {
      app.use('/api/health', require('../routes/health'));
      app.use('/api/security-monitoring', require('../routes/securityMonitoring'));
    } catch (error) {
      console.warn('⚠️ Routes système non disponibles:', error.message);
    }
    
    console.log('✅ Toutes les routes domaines montées');
    
    // 🚨 ROUTE CATCH-ALL EN DERNIER - APRÈS TOUS LES DOMAINES ET STATIC FILES
    app.get('*', (req, res) => {
      // Ne pas intercepter les requêtes vers les API
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Route API non trouvée' });
      }
      
      // Ne pas intercepter les fichiers statiques
      if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
        return res.status(404).json({ error: 'Fichier statique non trouvé' });
      }
      
      // Servir index.html pour toutes les autres routes (React Router)
      const indexPath = path.join(__dirname, '../public', 'index.html');
      
      if (!fs.existsSync(indexPath)) {
        console.error(`❌ Index.html non trouvé: ${indexPath}`);
        return res.status(500).json({ error: 'Frontend non disponible' });
      }
      
      console.log(`📄 Serving index.html for route: ${req.path}`);
      res.sendFile(indexPath);
    });
    
    console.log('✅ Route catch-all React SPA configurée EN DERNIER');
    
  } catch (error) {
    console.error('❌ Erreur chargement domaines:', error.message);
    throw error;
  }
}

// Ne pas appeler setupDomains immédiatement

// Route de test DigitalOcean
app.get('/test-route', (req, res) => {
  res.json({ 
    message: 'Route de test fonctionne !', 
    timestamp: new Date().toISOString(),
    architecture: 'DDD'
  });
});

// 🚨 ROUTE DEBUG ASSETS - FORCER LE SERVAGE VIA API
app.get('/debug/assets/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../public/assets', filename);
  
  console.log('🚨 DEBUG ASSETS REQUEST:', filename);
  console.log('🚨 File path:', filePath);
  console.log('🚨 File exists:', fs.existsSync(filePath));
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Asset not found', path: filePath });
  }
});

// 🚨 ROUTE ALTERNATIVE POUR SERVIR TOUS LES ASSETS VIA /api/assets
app.get('/api/assets/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../public/assets', filename);
  
  console.log('🔥 API ASSETS REQUEST:', filename);
  
  if (fs.existsSync(filePath)) {
    // Définir le bon Content-Type
    if (filename.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filename.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Asset not found' });
  }
});

// Static files sont maintenant configurés dans index.js AVANT setupDomains()
console.log('⚠️ Static files configuration moved to index.js for priority');

// Servir les images des articles externes depuis le dossier persistant
app.use('/movements', express.static(path.join(__dirname, 'public/movements')));

// Debug endpoint
app.get('/debug/architecture', (req, res) => {
  res.json({
    architecture: 'Domain Driven Design',
    domains: [
      'auth', 'catalog', 'inventory', 'finance', 
      'fleet', 'projects', 'calendar'
    ],
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint pour lister les fichiers public
app.get('/debug/public-files', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const publicPath = path.join(__dirname, '../public');
    const files = fs.readdirSync(publicPath);
    const movementFiles = files.filter(f => f.startsWith('movement_'));
    
    res.json({
      publicPath,
      totalFiles: files.length,
      movementFiles: movementFiles.length,
      sampleMovementFiles: movementFiles.slice(0, 5),
      allFiles: files.slice(0, 20),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🚨 DEBUG ROUTES - Pour diagnostiquer problème DigitalOcean
app.get('/debug/routes', (req, res) => {
  try {
    const routes = [];
    app._router.stack.forEach(function(r){
      if (r.route && r.route.path){
        routes.push({
          type: 'route',
          path: r.route.path,
          methods: Object.keys(r.route.methods)
        });
      }
      else if (r.name === 'router' && r.regexp){
        routes.push({
          type: 'router',
          regexp: r.regexp.toString(),
          keys: r.keys ? r.keys.map(k => k.name) : []
        });
      }
    });
    
    res.json({
      totalRoutes: routes.length,
      routes: routes,
      domainsInitialized: domainsInitialized,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'not set'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validation et gestion d'erreurs
app.use(errors());
app.use(validationErrorHandler);

// Error tracking New Relic (désactivé temporairement)
try {
  // const { errorTrackingMiddleware } = require('../middlewares/monitoring');
  // app.use(errorTrackingMiddleware);
  console.log('⚠️ Error tracking middleware désactivé temporairement');
} catch (error) {
  console.log('⚠️ Error tracking middleware non disponible');
}

// Gestionnaire global d'erreurs
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';
  logger.error(`Erreur ${status} :`, message);
  res.status(status).json({ error: message });
});

// 🔧 SOLUTION APP - Routes /app/* pour servir l'application
app.get('/app/login', (req, res) => {
  const indexPath = path.join(__dirname, '../public', 'index.html');
  console.log(`🔄 Serving app via /app/login: ${indexPath}`);
  res.sendFile(indexPath);
});

app.get('/app/*', (req, res) => {
  const indexPath = path.join(__dirname, '../public', 'index.html');
  console.log(`🔄 Serving app via /app route for: ${req.path}`);
  res.sendFile(indexPath);
});

// 🔧 REDIRECTION - /login vers /app/login
app.get('/login', (req, res) => {
  console.log(`🔄 Login redirect to /app/login`);
  res.redirect('/app/login');
});

// Route catch-all sera ajoutée après l'initialisation des domaines

// Fonction de fallback pour ajouter la route catch-all si setupDomains() échoue
function addCatchAllRoute() {
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Route API non trouvée' });
    }
    
    if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      return res.status(404).json({ error: 'Fichier statique non trouvé' });
    }
    
    const indexPath = path.join(__dirname, '../public', 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      console.error(`❌ Index.html non trouvé: ${indexPath}`);
      return res.status(500).json({ error: 'Frontend non disponible' });
    }
    
    console.log(`📄 Fallback serving index.html for route: ${req.path}`);
    res.sendFile(indexPath);
  });
  console.log('✅ Route catch-all fallback ajoutée');
}

// Routes API supprimées - seront montées dans setupDomains()

// 🚨 DEBUG - Lister toutes les routes montées
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log('📍 Route directe:', r.route.path);
  }
  else if (r.name === 'router' && r.regexp){
    console.log('📍 Router pattern:', r.regexp);
  }
});

/**
 * ARCHITECTURE DDD - Montage des domaines
 * Chaque domaine gère ses propres routes, contrôleurs, services et modèles
 */
function setupDomains() {
  try {
    console.log('🔄 Chargement des domaines...');
    
    // Charger les domaines maintenant qu'Express est initialisé
    authDomain = require('./domains/auth');
    console.log('✅ Auth domain chargé');
    catalogDomain = require('./domains/catalog');
    console.log('✅ Catalog domain chargé');
    inventoryDomain = require('./domains/inventory');
    console.log('✅ Inventory domain chargé');
    financeDomain = require('./domains/finance');
    console.log('✅ Finance domain chargé');
    fleetDomain = require('./domains/fleet');
    console.log('✅ Fleet domain chargé');
    projectsDomain = require('./domains/projects');
    console.log('✅ Projects domain chargé');
    calendarDomain = require('./domains/calendar');
    console.log('✅ Calendar domain chargé');
    
    console.log('🔄 Montage des routes...');
    
    // Authentification sans rate limiting pour les tests
    app.use('/api/auth', authDomain.routes);
    console.log('✅ Routes auth montées sur /api/auth (rate limiting désactivé)');
    
    // Domaines métier
    app.use('/api/catalog', catalogDomain.routes);
    app.use('/api/inventory', inventoryDomain.routes);
    app.use('/api/finance', financeDomain.routes);
    app.use('/api/fleet', fleetDomain.routes);
    app.use('/api/projects', projectsDomain.routes);
    app.use('/api/calendar', calendarDomain.routes);
    
    // Route Nieuwkoop legacy pour compatibilité avec l'ancien système
    app.use('/api/nieuwkoop', require('./domains/catalog/routes/nieuwkoop'));
    
    // Route Opérations diverses pour ventes inter-pôles
    app.use('/api/internal-operations', require('../routes/internalOperations'));
    
    // Routes legacy pour compatibilité avec l'ancien frontend
    // Rediriger /api/projets vers le domaine projects
    app.use('/api/projets', (req, res, next) => {
      req.url = '/projets' + req.url;
      projectsDomain.routes(req, res, next);
    });
    
    // Rediriger /api/projects vers le domaine projects/projets  
    app.use('/api/projects', (req, res, next) => {
      req.url = '/projets' + req.url;
      projectsDomain.routes(req, res, next);
    });
    
    // Rediriger /api/concepteurs vers le domaine projects
    app.use('/api/concepteurs', (req, res, next) => {
      req.url = '/concepteurs' + req.url;
      projectsDomain.routes(req, res, next);
    });
    
    // Rediriger /api/movements vers le domaine inventory
    app.use('/api/movements', (req, res, next) => {
      req.url = '/movements' + req.url;
      inventoryDomain.routes(req, res, next);
    });
    
    // Rediriger /api/mouvements vers le domaine inventory
    app.use('/api/mouvements', (req, res, next) => {
      req.url = '/movements' + req.url;
      inventoryDomain.routes(req, res, next);
    });
    
    // Rediriger /api/stock-items vers nieuwkoop/stock
    app.get('/api/stock-items', async (req, res, next) => {
      try {
        req.url = '/stock';
        const nieuwkoopRoute = require('./domains/catalog/routes/nieuwkoop');
        nieuwkoopRoute(req, res, next);
      } catch (error) {
        next(error);
      }
    });
    
    // Routes système et monitoring
    try {
      app.use('/api/health', require('../routes/health'));
      app.use('/api/security-monitoring', require('../routes/securityMonitoring'));
    } catch (error) {
      console.warn('⚠️ Routes système non disponibles:', error.message);
    }
    
    console.log('✅ Toutes les routes domaines montées');
    
  } catch (error) {
    console.error('❌ Erreur chargement domaines:', error.message);
    throw error;
  }
}

// Ne pas appeler setupDomains immédiatement

// Route catch-all sera ajoutée après l'initialisation des domaines

// Initialiser les domaines immédiatement mais avec gestion d'erreur
let domainsInitialized = false;

function initializeDomains() {
  if (domainsInitialized) return;
  
  try {
    setupDomains();
    domainsInitialized = true;
    console.log('✅ Domaines DDD configurés');
  } catch (error) {
    console.error('❌ Erreur configuration domaines:', error);
    // Même en cas d'erreur, on ajoute la route catch-all
    addCatchAllRoute();
  }
}

// Fonction de fallback pour ajouter la route catch-all si setupDomains() échoue
function addCatchAllRoute() {
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Route API non trouvée' });
    }
    
    if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      return res.status(404).json({ error: 'Fichier statique non trouvé' });
    }
    
    const indexPath = path.join(__dirname, '../public', 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      console.error(`❌ Index.html non trouvé: ${indexPath}`);
      return res.status(500).json({ error: 'Frontend non disponible' });
    }
    
    console.log(`📄 Fallback serving index.html for route: ${req.path}`);
    res.sendFile(indexPath);
  });
  console.log('✅ Route catch-all fallback ajoutée');
}

module.exports = { app, setupDomains, initializeDomains };