// backend/src/app.js - Application principale avec architecture DDD
// UPLOAD FIX DEPLOY - Version da993de avec corrections uploads - 2025-09-07 12:30

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
  if (req.url.includes('mouvement') || req.url.includes('movement')) {
    console.log('🎯 [MOVEMENT REQUEST DETECTED] Method:', req.method, 'URL:', req.url);
  }
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

// SUPPRIMÉ - Route conflictuelle

// UPLOADS sera configuré dans setupDomains() après les routes API

// 🚨 SOLUTION ULTIME: Servir assets depuis le code source
app.use('/assets', express.static(path.join(__dirname, 'assets')));
console.log('✅ Assets served from:', path.join(__dirname, 'assets'));

// 🚨 Route pour servir les images movement_ directement à la racine - REDIRECT TO SPACES
app.get('/movement_*', (req, res) => {
  const filename = req.path.substring(1); // Enlever le / du début
  
  console.log('🖼️ MOVEMENT IMAGE REQUEST:', filename);
  console.log('🌐 REDIRECTING TO SPACES:', `https://api-pousse-uploads.ams3.digitaloceanspaces.com/movements/${filename}`);
  
  // Rediriger vers DigitalOcean Spaces
  const spacesUrl = `https://api-pousse-uploads.ams3.digitaloceanspaces.com/movements/${filename}`;
  res.redirect(302, spacesUrl);
});

// 🚨 SOLUTION API FINALE: Route API pour images movement - REDIRECT TO SPACES
app.get('/api/catalog/nieuwkoop/movement-image/:filename', (req, res) => {
  const filename = req.params.filename;
  
  console.log('🎯 API MOVEMENT IMAGE REQUEST:', filename);
  console.log('🌐 REDIRECTING TO SPACES:', `https://api-pousse-uploads.ams3.digitaloceanspaces.com/movements/${filename}`);
  
  // Rediriger vers DigitalOcean Spaces
  const spacesUrl = `https://api-pousse-uploads.ams3.digitaloceanspaces.com/movements/${filename}`;
  res.redirect(302, spacesUrl);
});

// 🚨 SOLUTION FINALE: Servir movement_ depuis n'importe quel chemin - REDIRECT TO SPACES (EXCLUT /api/uploads/movements/)
app.use('*/movement_*', (req, res, next) => {
  // Skip /api/uploads/movements/ - handled by specific route in setupDomains()
  if (req.path.startsWith('/api/uploads/movements/')) {
    console.log('🔀 WILDCARD: Skipping /api/uploads/movements/, letting specific route handle:', req.path);
    return next();
  }
  
  const filename = req.path.split('/').pop(); // Récupérer juste le nom du fichier
  
  console.log('🎯 WILDCARD MOVEMENT REQUEST:', req.path, '->', filename);
  console.log('🌐 REDIRECTING TO SPACES:', `https://api-pousse-uploads.ams3.digitaloceanspaces.com/movements/${filename}`);
  
  // Rediriger vers DigitalOcean Spaces
  const spacesUrl = `https://api-pousse-uploads.ams3.digitaloceanspaces.com/movements/${filename}`;
  res.redirect(302, spacesUrl);
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
    
    // Declare paths used throughout this function
    const uploadsPath = path.join(__dirname, '../uploads');
    const publicPath = path.join(__dirname, '../public');
    
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
    
    // 🚨 ROUTES PUBLIQUES NIEUWKOOP - AVANT DOMAINE CATALOG POUR ÉVITER AUTH
    const nieuwkoopController = require('./domains/catalog/controllers/nieuwkoopController');
    app.get('/api/catalog/nieuwkoop/prices/:productId', nieuwkoopController.getItemPrice);
    app.get('/api/catalog/nieuwkoop/stock', (req, res, next) => {
      console.log('🔍 Route GET /api/catalog/nieuwkoop/stock appelée (PUBLIC - BYPASS AUTH)');
      nieuwkoopController.getNieuwkoopItems(req, res, next);
    });
    app.get('/api/catalog/nieuwkoop/items/:productId/image', nieuwkoopController.getItemImage);
    // 🖼️ Route publique pour les images des articles (utilisée par le frontend)
    app.get('/api/catalog/nieuwkoop/items/:reference/image', (req, res, next) => {
      console.log('🖼️ Route GET /api/catalog/nieuwkoop/items/${req.params.reference}/image appelée (PUBLIC - BYPASS AUTH)');
      nieuwkoopController.getItemImage(req, res, next);
    });
    console.log('✅ Routes publiques nieuwkoop montées AVANT domaine catalog');

    // Routes de debug temporaires supprimées - remplacées par solutions permanentes
    
    console.log('✅ Route uploads configurée:', uploadsPath, '+ public:', publicPath);

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
    
    // 🚨 ROUTE CRITQUE POUR SPA REFRESH - DANS LES APIs
    app.get('/api/app/nieuwkoop', (req, res) => {
      console.log('🎯 API Route /api/app/nieuwkoop HIT');
      const indexPath = path.join(__dirname, '../public', 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(500).json({ error: 'Frontend not found' });
      }
    });
    
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
      console.log('🔍 [ROUTING] /api/movements appelé:', req.method, req.originalUrl);
      req.url = '/movements' + req.url;
      inventoryDomain.routes(req, res, next);
    });
    
    // Rediriger /api/mouvements vers le domaine inventory
    app.use('/api/mouvements', (req, res, next) => {
      console.log('🔍 [ROUTING] /api/mouvements appelé:', req.method, req.originalUrl);
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
    console.log('📁 Mounting static files AFTER API routes...');
    // Use publicPath already declared earlier in this function
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
    
    // 🚨 SOLUTION 1: UPLOADS - Configuration statique simple et robuste
    // Use uploadsPath already declared earlier in setupDomains function
    console.log('🔍 UPLOADS PATH:', uploadsPath);
    console.log('🔍 __dirname:', __dirname);
    console.log('🔍 process.cwd():', process.cwd());
    
    // Créer le dossier uploads s'il n'existe pas - VERSION ROBUSTE
    try {
      if (!fs.existsSync(uploadsPath)) {
        console.log('⚠️ Création dossier uploads:', uploadsPath);
        fs.mkdirSync(uploadsPath, { recursive: true });
      }
      
      // Créer sous-dossiers si nécessaires
      const subDirs = ['movements', 'backup_uploads'];
      subDirs.forEach(dir => {
        const subPath = path.join(uploadsPath, dir);
        if (!fs.existsSync(subPath)) {
          fs.mkdirSync(subPath, { recursive: true });
        }
      });
      
      console.log('✅ Dossier uploads exists:', fs.existsSync(uploadsPath));
      console.log('✅ Dossier contents:', fs.readdirSync(uploadsPath).length, 'files');
    } catch (error) {
      console.error('❌ Erreur uploads setup:', error.message);
    }
    
    // SUPPRIMÉ - Route conflictuelle, on garde seulement /api/catalog/nieuwkoop/movement-image/
    
    // SOLUTION BACKUP: Upload depuis public/ aussi (au cas où uploads/ ne serait pas déployé)
    const publicUploadsPath = path.join(publicPath, 'uploads');
    if (fs.existsSync(publicUploadsPath)) {
      app.use('/public-uploads', express.static(publicUploadsPath));
      console.log('✅ Route /public-uploads backup configurée vers:', publicUploadsPath);
    }

    // 📁 ROUTE SPÉCIFIQUE POUR LES FICHIERS PDF AVEC HEADERS OPTIMISÉS (EXCLUT MOVEMENTS)
    app.get('/api/uploads/:filename', (req, res, next) => {
      const filename = req.params.filename;
      
      // Skip movement files - they have their own route
      if (filename.includes('movements/') || filename.startsWith('movement_')) {
        console.log('🔀 Skipping movement file (contains movements/ or starts with movement_):', filename);
        return next();
      }
      
      const filePath = path.join(uploadsPath, filename);
      
      if (fs.existsSync(filePath)) {
        // Détecter le type de fichier
        const fileBuffer = fs.readFileSync(filePath);
        const isPDF = fileBuffer.subarray(0, 4).toString() === '%PDF';
        
        if (isPDF) {
          // Headers spéciaux pour PDF pour bypasser les restrictions
          res.removeHeader('Content-Security-Policy');
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.setHeader('X-Frame-Options', 'ALLOWALL');
          console.log('📄 Serving PDF with relaxed headers:', filename);
        } else {
          // Autres types de fichiers
          const ext = path.extname(filename).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
            res.setHeader('Content-Type', 'image/' + ext.slice(1));
          }
        }
        
        res.sendFile(filePath);
      } else {
        // Continuer vers la route statique si pas trouvé
        next();
      }
    });

    // 📁 ROUTE STATIQUE POUR LES AUTRES UPLOADS (EXCLUT MOVEMENTS)
    if (fs.existsSync(uploadsPath)) {
      app.use('/api/uploads', (req, res, next) => {
        // Skip movements directory - handled by specific routes
        if (req.path.startsWith('/movements/')) {
          console.log('🔀 Static route skipping movements:', req.path);
          return next();
        }
        express.static(uploadsPath)(req, res, next);
      });
      console.log('✅ Route /api/uploads configurée vers:', uploadsPath, '(exclut movements)');
    } else {
      console.log('⚠️ Dossier uploads non trouvé:', uploadsPath);
    }
    
    console.log('✅ Static files mounted AFTER API routes');
    
    // 🚨 ROUTE SPÉCIFIQUE POUR /app/nieuwkoop - REDIRECT TO ROOT
    app.get('/app/nieuwkoop', (req, res) => {
      console.log('🎯 ROUTE /app/nieuwkoop HIT - Redirecting to preserve assets');
      // Redirection vers la racine pour que les assets JS/CSS soient correctement chargés
      // React Router gérera ensuite le routing vers /app/nieuwkoop
      res.redirect('/#/app/nieuwkoop');
    });
    
    // 🚨 ROUTES DIAGNOSTIC - FORCE DEPLOY VERSION 3
    app.get('/api/DIAGNOSTIC-UPLOAD-V3', (req, res) => {
      try {
        const exists = fs.existsSync(uploadsPath);
        const files = exists ? fs.readdirSync(uploadsPath) : [];
        res.json({ 
          success: true,
          timestamp: new Date().toISOString(),
          uploadsPath,
          exists,
          files: files.slice(0, 5), // Premiers 5 fichiers
          totalFiles: files.length,
          deployVersion: 'V3-2025-09-07-12h00',
          paths: {
            __dirname,
            cwd: process.cwd(),
            uploadsRelative: '../uploads'
          }
        });
      } catch (error) {
        res.json({
          success: false,
          error: error.message,
          uploadsPath,
          deployVersion: 'V3-2025-09-07-12h00'
        });
      }
    });
    
    // Route test simple
    app.get('/api/test-upload-route', (req, res) => {
      res.send('UPLOAD ROUTE TEST OK - V3');
    });
    
    // 🚨 SOLUTION DÉFINITIVE: Route API pour servir les uploads (EXCLUT MOVEMENTS)
    app.get('/api/uploads/:filename', (req, res) => {
      try {
        const filename = req.params.filename;
        
        // Skip movement files - they have their own route
        if (filename.includes('movements/') || filename.startsWith('movement_')) {
          console.log('🔀 SOLUTION DÉFINITIVE: Skipping movement file (contains movements/ or starts with movement_):', filename);
          return res.status(404).json({ error: 'Movement files are handled by specific route' });
        }
        
        console.log(`🔥 ROUTE /api/uploads/${filename} APPELÉE DIRECTEMENT`);
        console.log(`🔍 Headers:`, req.headers);
        console.log(`🔍 User-Agent:`, req.get('User-Agent'));
        console.log(`🔍 Origin:`, req.get('Origin'));
        console.log(`🔍 Referer:`, req.get('Referer'));
        
        const filePath = path.join(uploadsPath, filename);
        
        console.log(`📁 Cherche fichier:`, filePath);
        console.log(`📁 Existe:`, fs.existsSync(filePath));
        
        // Vérifier que le fichier existe et est dans le dossier uploads (sécurité)
        if (!fs.existsSync(filePath) || !filePath.startsWith(uploadsPath)) {
          console.log(`❌ Fichier non trouvé ou hors du dossier uploads`);
          return res.status(404).json({ error: 'Fichier non trouvé', filename, path: filePath });
        }
        
        console.log(`✅ Serving fichier:`, filePath);
        
        // Déterminer le Content-Type selon l'extension
        const ext = path.extname(filename).toLowerCase();
        const mimeTypes = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg', 
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.webp': 'image/webp',
          '.svg': 'image/svg+xml',
          '.pdf': 'application/pdf',
          '.txt': 'text/plain'
        };
        
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        console.log(`📄 Content-Type déterminé: ${contentType} pour extension: ${ext}`);
        
        res.setHeader('Content-Type', contentType);
        
        // Pour les images, ajouter des headers pour l'affichage inline
        if (contentType.startsWith('image/')) {
          res.setHeader('Content-Disposition', 'inline');
          console.log(`🖼️ Image servie pour affichage inline`);
        }
        
        // Servir le fichier
        res.sendFile(filePath);
      } catch (error) {
        console.error('❌ Erreur serving upload:', error);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
      }
    });
    
    // 🚨 DIAGNOSTIC: Route pour inspecter les projets et leurs fichiers
    app.get('/api/debug/projects', async (req, res) => {
      try {
        const mongoose = require('mongoose');
        const Projet = mongoose.models.Projet || require('../domains/projects/models/Projet');
        const projects = await Projet.find().sort({ createdAt: -1 }).limit(5);
        
        res.json({
          success: true,
          totalProjects: projects.length,
          projects: projects.map(p => ({
            _id: p._id,
            client: p.client,
            description: p.description,
            files: p.files || [],
            documents: p.documents || [],
            materials: p.materials || {},
            createdAt: p.createdAt,
            updatedAt: p.updatedAt
          }))
        });
      } catch (error) {
        console.error('Erreur debug projects:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // 🧪 ROUTE DE TEST: Créer un projet sans authentification
    app.post('/api/projects/test-create', async (req, res) => {
      try {
        console.log('🧪 Test création projet via /api/projects/test-create:', req.body);
        
        const mongoose = require('mongoose');
        const Projet = mongoose.models.Projet || require('../domains/projects/models/Projet');
        
        const projectData = {
          title: req.body.title || req.body.client || 'Projet Test API',
          client: {
            type: 'individual',
            name: req.body.client || 'Client Test',
            contact: {
              address: {
                street: req.body.address || 'Test Address',
                city: 'Test City',
                postalCode: '12345',
                country: 'France'
              }
            }
          },
          type: 'Installation',
          dates: {
            start: req.body.dateDebut ? new Date(req.body.dateDebut) : new Date(),
            end: req.body.dateFin ? new Date(req.body.dateFin) : new Date(Date.now() + 7*24*60*60*1000)
          },
          location: {
            address: req.body.address || 'Test Location'
          },
          description: req.body.description || 'Projet test créé via API publique',
          status: 'active',
          materials: [],
          documents: []
        };

        const projet = await Projet.create(projectData);
        
        console.log('✅ Projet test créé via API:', projet._id);
        res.status(201).json({
          success: true,
          message: 'Projet test créé avec succès',
          project: projet
        });
      } catch (error) {
        console.error('❌ Erreur création projet test:', error);
        res.status(500).json({ 
          success: false,
          error: 'Erreur création projet test', 
          details: error.message
        });
      }
    });
    
    // 🚨 ROUTE DEBUG POUR TESTER - FORCE DEPLOY v2
    app.get('/api/debug/test', (req, res) => {
      res.json({ 
        message: 'Route debug fonctionne - Deploy forced V3!', 
        timestamp: new Date().toISOString(),
        path: req.path,
        deployVersion: '2025-09-07-12h00' // Force new deployment
      });
    });
    
    console.log('✅ Routes de debug ajoutées');
    
    // 🚨 ROUTE CATCH-ALL UNIVERSELLE - GÈRE TOUTES LES ROUTES SPA
    app.use('*', (req, res) => {
      console.log(`🔍 CATCH-ALL HIT: ${req.method} ${req.path} - User-Agent: ${req.get('User-Agent')?.substring(0, 50)}`);
      
      // Ne pas intercepter les requêtes vers les API - elles sont déjà montées AVANT
      if (req.path.startsWith('/api/')) {
        console.log(`❌ Route API non trouvée (catch-all): ${req.path}`);
        return res.status(404).json({ error: 'Route API non trouvée', path: req.path });
      }
      
      // Ne pas intercepter les uploads - ils sont déjà montés AVANT
      if (req.path.startsWith('/uploads/')) {
        console.log(`❌ Upload non trouvé (catch-all): ${req.path}`);
        return res.status(404).json({ error: 'Fichier upload non trouvé' });
      }
      
      // Ne pas intercepter les fichiers statiques avec extensions
      if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json|txt|xml)$/)) {
        console.log(`❌ Fichier statique non trouvé: ${req.path}`);
        return res.status(404).json({ error: 'Fichier statique non trouvé' });
      }
      
      // 🚨 TOUTES LES AUTRES ROUTES = REACT SPA
      const indexPath = path.join(__dirname, '../public', 'index.html');
      
      if (!fs.existsSync(indexPath)) {
        console.error(`❌ Index.html non trouvé: ${indexPath}`);
        return res.status(500).json({ error: 'Frontend non disponible', indexPath });
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

// 🖼️ ROUTE CRITIQUE MOVEMENTS - MONTÉE AVANT DOMAINES POUR ÉVITER ÉCHEC
console.log('🔄 Montage route critique movements AVANT domaines...');
app.get('/api/uploads/movements/:filename', (req, res) => {
  const filename = req.params.filename;
  
  console.log('🖼️ ROUTE MOVEMENT IMAGE HIT (CRITIQUE):', filename);
  console.log('🔍 Full path:', req.path);
  console.log('🔍 Params:', req.params);
  
  // Construire l'URL DigitalOcean Spaces correcte
  const spacesUrl = `https://api-pousse-uploads.ams3.digitaloceanspaces.com/movements/${filename}`;
  console.log('🌐 REDIRECTING TO SPACES:', spacesUrl);
  
  // Rediriger vers DigitalOcean Spaces
  res.redirect(302, spacesUrl);
});
console.log('✅ Route critique movements montée AVANT domaines');

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