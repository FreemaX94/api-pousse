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
  res.setHeader('X-Served-By', 'api-pousse-backend');
  res.setHeader('X-Debug-Path', req.url);
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

// 🚨 ROUTE AUTH EN DUR POUR DEBUG DIGITALOCEAN
app.post('/api/auth/login', async (req, res, next) => {
  try {
    console.log('🔥 ROUTE LOGIN HARD-CODED HIT');
    
    const authController = require('../controllers/authController');
    const loginMiddlewares = authController.login;
    
    // Exécuter les middlewares séquentiellement
    let currentIndex = 0;
    
    const executeNext = (err) => {
      if (err) {
        console.error('❌ Auth middleware error:', err);
        return res.status(500).json({ error: 'Auth middleware error: ' + err.message });
      }
      
      if (currentIndex >= loginMiddlewares.length) {
        return;
      }
      
      const currentMiddleware = loginMiddlewares[currentIndex++];
      
      if (typeof currentMiddleware === 'function') {
        currentMiddleware(req, res, executeNext);
      } else {
        executeNext();
      }
    };
    
    executeNext();
    
  } catch (error) {
    console.error('❌ Auth controller error:', error);
    res.status(500).json({ error: 'Auth controller error: ' + error.message });
  }
});

// 🚨 ROUTE AUTH/ME EN DUR POUR DEBUG DIGITALOCEAN
app.get('/api/auth/me', async (req, res) => {
  try {
    console.log('🔥 ROUTE ME HARD-CODED HIT');
    
    const { me } = require('../controllers/authController');
    const { authMiddleware } = require('../middlewares/authMiddleware');
    
    // Apply auth middleware first
    authMiddleware()(req, res, async () => {
      await me(req, res);
    });
  } catch (error) {
    console.error('❌ Auth/me error:', error);
    res.status(500).json({ error: 'Auth/me error: ' + error.message });
  }
});

// Route de test DigitalOcean
app.get('/test-route', (req, res) => {
  res.json({ 
    message: 'Route de test fonctionne !', 
    timestamp: new Date().toISOString(),
    architecture: 'DDD'
  });
});

// Routes de test supprimées pour utiliser les vrais contrôleurs d'authentification

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
  const publicAssetsPath = path.join(__dirname, '../public/assets', filename);
  const assetsPath = path.join(__dirname, '../assets', filename);
  
  console.log('🔥 API ASSETS REQUEST:', filename);
  
  // Vérifier d'abord dans public/assets, puis dans assets/
  let filePath;
  if (fs.existsSync(publicAssetsPath)) {
    filePath = publicAssetsPath;
  } else if (fs.existsSync(assetsPath)) {
    filePath = assetsPath;
  }
  
  if (filePath) {
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

// UPLOADS sera configuré dans setupDomains() après les routes API

// 🚨 SOLUTION ULTIME: Servir assets depuis le code source
app.use('/assets', express.static(path.join(__dirname, 'assets')));
console.log('✅ Assets served from:', path.join(__dirname, 'assets'));

// 🚨 Route pour servir les images movement_ directement à la racine
app.get('/movement_*', (req, res) => {
  const filename = req.path.substring(1); // Enlever le / du début
  const publicPath = path.join(__dirname, '../public', filename);
  const assetsPath = path.join(__dirname, '../assets', filename);
  
  console.log('🖼️ MOVEMENT IMAGE REQUEST:', filename);
  console.log('🖼️ Public path:', publicPath);
  console.log('🖼️ Assets path:', assetsPath);
  
  // Essayer d'abord dans public, puis dans assets
  if (fs.existsSync(publicPath)) {
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(publicPath);
  } else if (fs.existsSync(assetsPath)) {
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(assetsPath);
  } else {
    res.status(404).json({ error: 'Movement image not found', path: filename, triedPaths: [publicPath, assetsPath] });
  }
});

// 🚨 SOLUTION API FINALE: Route API pour images movement
app.get('/api/catalog/nieuwkoop/movement-image/:filename', (req, res) => {
  const filename = req.params.filename;
  const publicPath = path.join(__dirname, '../public', filename);
  const assetsPath = path.join(__dirname, '../assets', filename);
  
  console.log('🎯 API MOVEMENT IMAGE REQUEST:', filename);
  
  if (fs.existsSync(publicPath)) {
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(publicPath);
  } else if (fs.existsSync(assetsPath)) {
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(assetsPath);
  } else {
    console.log('❌ Movement file not found:', filename);
    res.status(404).json({ error: 'Movement image not found', filename });
  }
});

// 🚨 SOLUTION FINALE: Servir movement_ depuis n'importe quel chemin
app.use('*/movement_*', (req, res) => {
  const filename = req.path.split('/').pop(); // Récupérer juste le nom du fichier
  const publicPath = path.join(__dirname, '../public', filename);
  const assetsPath = path.join(__dirname, '../assets', filename);
  
  console.log('🎯 WILDCARD MOVEMENT REQUEST:', req.path, '->', filename);
  
  if (fs.existsSync(publicPath)) {
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(publicPath);
  } else if (fs.existsSync(assetsPath)) {
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(assetsPath);
  } else {
    console.log('❌ Movement file not found:', filename);
    res.status(404).end();
  }
});

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

// 🚨 DEBUG ROUTE UPLOADS - Pour diagnostiquer problème upload
app.get('/debug/uploads', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const uploadsPath = path.join(__dirname, '../uploads');
    const uploadsExists = fs.existsSync(uploadsPath);
    
    let files = [];
    let stats = null;
    
    if (uploadsExists) {
      files = fs.readdirSync(uploadsPath);
      stats = fs.statSync(uploadsPath);
    }
    
    res.json({
      uploadsPath,
      uploadsExists,
      filesCount: files.length,
      files,
      permissions: stats ? stats.mode.toString(8) : 'N/A',
      cwd: process.cwd(),
      env: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      uploadsPath: path.join(__dirname, '../uploads'),
      timestamp: new Date().toISOString()
    });
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


// Route catch-all sera ajoutée APRÈS setupDomains() pour ne pas intercepter les API

// Fonction de fallback pour ajouter la route catch-all si setupDomains() échoue
function addCatchAllRoute() {
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Route API non trouvée' });
    }
    
    // Routes API sont sur /api/* maintenant
    
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
    console.log('🔄 [SETUP] Début chargement des domaines...');
    
    // Charger les domaines maintenant qu'Express est initialisé
    console.log('🔄 [SETUP] Chargement Auth domain...');
    authDomain = require('./domains/auth');
    console.log('✅ [SETUP] Auth domain chargé avec succès');
    
    console.log('🔄 [SETUP] Chargement Catalog domain...');
    catalogDomain = require('./domains/catalog');
    console.log('✅ [SETUP] Catalog domain chargé avec succès');
    
    console.log('🔄 [SETUP] Chargement Inventory domain...');
    inventoryDomain = require('./domains/inventory');
    console.log('✅ [SETUP] Inventory domain chargé avec succès');
    
    console.log('🔄 [SETUP] Chargement Finance domain...');
    financeDomain = require('./domains/finance');
    console.log('✅ [SETUP] Finance domain chargé avec succès');
    
    console.log('🔄 [SETUP] Chargement Fleet domain...');
    fleetDomain = require('./domains/fleet');
    console.log('✅ [SETUP] Fleet domain chargé avec succès');
    
    console.log('🔄 [SETUP] Chargement Projects domain...');
    projectsDomain = require('./domains/projects');
    console.log('✅ [SETUP] Projects domain chargé avec succès');
    
    console.log('🔄 [SETUP] Chargement Calendar domain...');
    calendarDomain = require('./domains/calendar');
    console.log('✅ [SETUP] Calendar domain chargé avec succès');
    
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
    try {
      app.use('/api/internal-operations', require('../routes/internalOperations'));
    } catch (error) {
      console.warn('⚠️ Internal operations route non disponible:', error.message);
    }
    
    // Routes legacy pour compatibilité avec l'ancien frontend
    // Rediriger /api/projets vers le domaine projects
    app.use('/api/projets', (req, res, next) => {
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
    
    // 🚨 STATIC FILES APRÈS LES API ROUTES
    const path = require('path');
    const fs = require('fs');
    
    console.log('📁 Mounting static files AFTER API routes...');
    const publicPath = path.join(__dirname, '../public');
    const distPath = path.join(__dirname, '../dist');
    const assetsPath = path.join(__dirname, '../public/assets');
    
    console.log('Public path:', publicPath, '- exists:', fs.existsSync(publicPath));
    console.log('Assets path:', assetsPath, '- exists:', fs.existsSync(assetsPath));
    
    // Static files APRÈS les routes API - EXCLUS seulement /api/*
    app.use((req, res, next) => {
      // Skip static files for /api/* routes - let them go to API handlers
      if (req.path.startsWith('/api/')) {
        return next();
      }
      express.static(publicPath)(req, res, next);
    });
    app.use((req, res, next) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      express.static(distPath)(req, res, next);
    });
    app.use('/assets', express.static(assetsPath));
    
    // 🚨 UPLOADS - Configuration APRÈS les routes API mais AVANT catch-all
    const uploadsPath = path.join(__dirname, '../uploads');
    
    // Créer le dossier uploads s'il n'existe pas
    if (!fs.existsSync(uploadsPath)) {
      console.log('⚠️ Dossier uploads inexistant, création...');
      try {
        fs.mkdirSync(uploadsPath, { recursive: true });
        console.log('✅ Dossier uploads créé:', uploadsPath);
      } catch (error) {
        console.error('❌ Erreur création dossier uploads:', error.message);
      }
    }
    
    app.use('/uploads', (req, res, next) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      express.static(uploadsPath)(req, res, next);
    });
    console.log('✅ Uploads served from:', uploadsPath, '- exists:', fs.existsSync(uploadsPath));
    
    console.log('✅ Static files mounted AFTER API routes');
    
    // 🚨 ROUTES REACT SPA SPÉCIFIQUES - AVANT CATCH-ALL
    const reactRoutes = [
      '/nieuwkoop', '/nieuwkoop/*',
      '/projets', '/projets/*', 
      '/dashboard', '/dashboard/*',
      '/mouvements', '/mouvements/*',
      '/vehicules', '/vehicules/*',
      '/finance', '/finance/*',
      '/admin', '/admin/*'
    ];
    
    reactRoutes.forEach(route => {
      app.get(route, (req, res) => {
        const indexPath = path.join(__dirname, '../public', 'index.html');
        console.log(`📱 REACT ROUTE: ${req.path} -> serving index.html`);
        
        if (!fs.existsSync(indexPath)) {
          console.error(`❌ Index.html non trouvé pour route React: ${indexPath}`);
          return res.status(500).json({ error: 'Frontend non disponible' });
        }
        
        res.sendFile(indexPath);
      });
    });
    
    console.log('✅ Routes React SPA configurées');
    
    // 🚨 ROUTE CATCH-ALL EN DERNIER - APRÈS TOUS LES DOMAINES ET STATIC FILES
    app.get('*', (req, res) => {
      console.log(`🔍 CATCH-ALL HIT: ${req.method} ${req.path} - User-Agent: ${req.get('User-Agent')?.substring(0, 50)}`);
      
      // Ne pas intercepter les requêtes vers les API - elles sont déjà montées AVANT
      if (req.path.startsWith('/api/')) {
        console.log(`❌ Route API non trouvée (catch-all): ${req.path}`);
        return res.status(404).json({ error: 'Route API non trouvée', path: req.path });
      }
      
      // Ne pas intercepter les fichiers statiques
      if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
        console.log(`❌ Fichier statique non trouvé: ${req.path}`);
        return res.status(404).json({ error: 'Fichier statique non trouvé' });
      }
      
      // 🚨 SERVIR LE VRAI INDEX.HTML DEPUIS PUBLIC
      const indexPath = path.join(__dirname, '../public', 'index.html');
      
      if (!fs.existsSync(indexPath)) {
        console.error(`❌ Index.html non trouvé: ${indexPath}`);
        return res.status(500).json({ error: 'Frontend non disponible' });
      }
      
      console.log(`📄 Serving index.html for SPA route: ${req.path} -> ${indexPath}`);
      res.sendFile(indexPath);
    });
    
    console.log('✅ Route catch-all React SPA configurée EN DERNIER');
    
  } catch (error) {
    console.error('❌ Erreur chargement domaines:', error.message);
    throw error;
  }
}

// Route catch-all sera ajoutée après l'initialisation des domaines

// Initialiser les domaines immédiatement mais avec gestion d'erreur
let domainsInitialized = false;

function initializeDomains() {
  if (domainsInitialized) {
    console.log('⚠️ Domaines déjà initialisés, ignoré');
    return;
  }
  
  console.log('🔄 Début initialisation des domaines...');
  
  try {
    setupDomains();
    domainsInitialized = true;
    console.log('✅ Domaines DDD configurés avec succès');
  } catch (error) {
    console.error('❌ ERREUR CRITIQUE lors de la configuration des domaines:');
    console.error('❌ Message:', error.message);
    console.error('❌ Stack:', error.stack);
    
    // En cas d'erreur, on ajoute au moins la route catch-all
    console.log('⚡ Ajout route catch-all de secours...');
    addCatchAllRoute();
    console.log('✅ Route catch-all de secours ajoutée');
  }
}

// 🚨 FORCE L'INITIALISATION IMMÉDIATE - Ne pas attendre MongoDB
console.log('🚀 INITIALISATION FORCÉE DES DOMAINES...');
initializeDomains();

// Fonction de fallback pour ajouter la route catch-all si setupDomains() échoue
function addCatchAllRoute() {
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Route API non trouvée' });
    }
    
    // Routes API sont sur /api/* maintenant
    
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