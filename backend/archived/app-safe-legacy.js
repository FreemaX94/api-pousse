const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const logger = require('./utils/logger');

const app = express();

// Configuration CORS
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

// Middlewares de base
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes de base seulement (sans les routes problématiques)
// Route de health check déplacée vers /api/status pour éviter le conflit avec le frontend
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'API Pousse Backend Running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    features: ['Health Checks', 'Security', 'RBAC']
  });
});

// Routes essentielles seulement
try {
  app.use('/api/health', require('./routes/health'));
  logger.info('✅ Health routes chargées');
} catch (error) {
  logger.warn('⚠️ Impossible de charger les health routes:', error.message);
}

try {
  app.use('/api/auth', require('./routes/authRoutes'));
  logger.info('✅ Auth routes chargées');
} catch (error) {
  logger.warn('⚠️ Impossible de charger les auth routes:', error.message);
}

try {
  app.use('/api/nieuwkoop', require('./routes/nieuwkoop'));
  logger.info('✅ Nieuwkoop routes chargées');
} catch (error) {
  logger.warn('⚠️ Impossible de charger les Nieuwkoop routes:', error.message);
}

try {
  app.use('/api/projets', require('./routes/projets'));
  logger.info('✅ Projets routes chargées');
} catch (error) {
  logger.warn('⚠️ Impossible de charger les Projets routes:', error.message);
}

try {
  app.use('/api/movements', require('./routes/movementRoutes'));
  logger.info('✅ Movements routes chargées');
} catch (error) {
  logger.warn('⚠️ Impossible de charger les Movements routes:', error.message);
}

try {
  app.use('/api/vehicles', require('./routes/vehicles'));
  logger.info('✅ Vehicles routes chargées');
} catch (error) {
  logger.warn('⚠️ Impossible de charger les Vehicles routes:', error.message);
}

try {
  app.use('/api/expenses', require('./routes/expenses'));
  logger.info('✅ Expenses routes chargées');
} catch (error) {
  logger.warn('⚠️ Impossible de charger les Expenses routes:', error.message);
}

try {
  app.use('/api/invoices', require('./routes/invoices'));
  logger.info('✅ Invoices routes chargées');
} catch (error) {
  logger.warn('⚠️ Impossible de charger les Invoices routes:', error.message);
}

try {
  app.use('/api/stocks', require('./routes/stocks'));
  logger.info('✅ Stocks routes chargées');
} catch (error) {
  logger.warn('⚠️ Impossible de charger les Stocks routes:', error.message);
}

try {
  app.use('/api/concepteurs', require('./routes/concepteurs'));
  logger.info('✅ Concepteurs routes chargées');
} catch (error) {
  logger.warn('⚠️ Impossible de charger les Concepteurs routes:', error.message);
}

try {
  app.use('/api/events', require('./routes/eventsRoutes'));
  logger.info('✅ Events routes chargées');
} catch (error) {
  logger.warn('⚠️ Impossible de charger les Events routes:', error.message);
}

try {
  app.use('/api/rbac', require('./routes/rbac'));
  logger.info('✅ RBAC routes chargées');
} catch (error) {
  logger.warn('⚠️ Impossible de charger les RBAC routes:', error.message);
}

try {
  app.use('/api/security', require('./routes/security'));
  logger.info('✅ Security routes chargées');
} catch (error) {
  logger.warn('⚠️ Impossible de charger les Security routes:', error.message);
}

try {
  app.use('/api/sync', require('./routes/sync'));
  logger.info('✅ Sync routes chargées');
} catch (error) {
  logger.warn('⚠️ Impossible de charger les Sync routes:', error.message);
}

try {
  app.use('/api/livraisons', require('./routes/livraisons'));
  logger.info('✅ Livraisons routes chargées');
} catch (error) {
  logger.warn('⚠️ Impossible de charger les Livraisons routes:', error.message);
}

try {
  app.use('/api/catalogue', require('./routes/catalogue'));
  logger.info('✅ Catalogue routes chargées');
} catch (error) {
  logger.warn('⚠️ Impossible de charger les Catalogue routes:', error.message);
}

// Debug: endpoint pour tester la structure des fichiers
app.get('/debug/files', (req, res) => {
  const publicPath = path.join(__dirname, 'public');
  const distPath = path.join(__dirname, 'dist');
  const assetsPath = path.join(__dirname, 'dist', 'assets');
  const indexPath = path.join(__dirname, 'public', 'index.html');
  const distIndexPath = path.join(__dirname, 'dist', 'index.html');
  
  const debug = {
    __dirname,
    publicPath,
    distPath,
    assetsPath,
    indexPath,
    distIndexPath,
    publicExists: fs.existsSync(publicPath),
    distExists: fs.existsSync(distPath),
    assetsExists: fs.existsSync(assetsPath),
    indexExists: fs.existsSync(indexPath),
    distIndexExists: fs.existsSync(distIndexPath),
    files: []
  };
  
  try {
    if (fs.existsSync(publicPath)) {
      debug.publicFiles = fs.readdirSync(publicPath);
    }
    if (fs.existsSync(distPath)) {
      debug.distFiles = fs.readdirSync(distPath);
    }
    if (fs.existsSync(assetsPath)) {
      debug.assetsFiles = fs.readdirSync(assetsPath).slice(0, 10); // Limit to first 10
    }
  } catch (e) {
    debug.error = e.message;
  }
  
  res.json(debug);
});

// Gestion d'erreur globale
app.use((err, req, res, next) => {
  logger.error('Erreur non gérée:', err);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erreur serveur'
  });
});

// Debug middleware pour les fichiers statiques
app.use((req, res, next) => {
  if (req.path.startsWith('/assets/')) {
    const filePath = path.join(__dirname, 'dist', req.path);
    logger.info(`📁 Requête fichier statique: ${req.path} → ${filePath}`);
    logger.info(`📂 Fichier existe: ${fs.existsSync(filePath)}`);
  }
  next();
});

// Servir les fichiers statiques du frontend avec les bons MIME types
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    logger.info(`📤 Serving static file: ${filePath}`);
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json');
    }
  }
}));

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Redirections explicites pour les anciennes routes auth
app.get('/login', (req, res) => {
  res.redirect(301, '/app/login');
});

app.get('/signup', (req, res) => {
  res.redirect(301, '/app/signup');
});

app.get('/forgot-password', (req, res) => {
  res.redirect(301, '/app/forgot-password');
});

app.get('/reset-password', (req, res) => {
  res.redirect(301, '/app/reset-password');
});

app.get('/activate/:token', (req, res) => {
  res.redirect(301, `/app/activate/${req.params.token}`);
});

// Route 404 pour toutes les autres routes - Servir l'app React
app.get('*', (req, res) => {
  // Pour les routes API non trouvées
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ 
      error: 'Route API non trouvée',
      availableRoutes: ['/api/status', '/api/health', '/api/auth', '/api/stocks', '/api/vehicles']
    });
  }
  
  // Ne pas intercepter les fichiers statiques (JS, CSS, images, etc.)
  if (req.path.includes('.')) {
    return res.status(404).send('File not found');
  }
  
  // Pour toutes les autres routes, servir l'app React
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  const publicIndexPath = path.join(__dirname, 'public', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else if (fs.existsSync(publicIndexPath)) {
    res.sendFile(publicIndexPath);
  } else {
    // Si pas de frontend, afficher un message
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pousse - Application</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .container { max-width: 600px; margin: 0 auto; }
          h1 { color: #333; }
          p { color: #666; }
          a { color: #007bff; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Application Pousse</h1>
          <p>Le frontend est en cours de déploiement...</p>
          <p>API Backend: <a href="/api/status">/api/status</a></p>
        </div>
      </body>
      </html>
    `);
  }
});

module.exports = { app };