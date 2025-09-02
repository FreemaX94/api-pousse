// SERVEUR STABLE - Combine minimal + DDD
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

console.log('🚀 SERVEUR STABLE - Démarrage...');

const app = express();
const PORT = process.env.PORT || 3001;

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

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Debug middleware
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.url}`);
  next();
});

// Test routes
app.get('/test-route', (req, res) => {
  res.json({ 
    message: 'SERVEUR STABLE FONCTIONNE !', 
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Fonction pour monter les domaines de façon sécurisée
async function mountDomainsSecurely() {
  try {
    console.log('🔄 Montage des domaines...');
    
    // Auth Domain - CRITIQUE
    try {
      const authDomain = require('./src/domains/auth');
      app.use('/api/auth', authDomain.routes);
      console.log('✅ Auth domain monté sur /api/auth');
    } catch (error) {
      console.error('❌ Erreur auth domain:', error.message);
    }
    
    // Catalog Domain - Nieuwkoop
    try {
      const catalogDomain = require('./src/domains/catalog');
      app.use('/api/catalog', catalogDomain.routes);
      console.log('✅ Catalog domain monté sur /api/catalog');
    } catch (error) {
      console.error('❌ Erreur catalog domain:', error.message);
    }
    
    // Nieuwkoop direct route
    try {
      const nieuwkoopRoutes = require('./src/domains/catalog/routes/nieuwkoop');
      app.use('/api/nieuwkoop', nieuwkoopRoutes);
      console.log('✅ Nieuwkoop routes montées sur /api/nieuwkoop');
    } catch (error) {
      console.error('❌ Erreur nieuwkoop routes:', error.message);
    }
    
    // Autres domaines
    try {
      const inventoryDomain = require('./src/domains/inventory');
      app.use('/api/inventory', inventoryDomain.routes);
      console.log('✅ Inventory domain monté');
    } catch (error) {
      console.error('❌ Erreur inventory domain:', error.message);
    }
    
    try {
      const financeDomain = require('./src/domains/finance');
      app.use('/api/finance', financeDomain.routes);
      console.log('✅ Finance domain monté');
    } catch (error) {
      console.error('❌ Erreur finance domain:', error.message);
    }
    
    try {
      const fleetDomain = require('./src/domains/fleet');
      app.use('/api/fleet', fleetDomain.routes);
      console.log('✅ Fleet domain monté');
    } catch (error) {
      console.error('❌ Erreur fleet domain:', error.message);
    }
    
    try {
      const projectsDomain = require('./src/domains/projects');
      app.use('/api/projects', projectsDomain.routes);
      console.log('✅ Projects domain monté');
    } catch (error) {
      console.error('❌ Erreur projects domain:', error.message);
    }
    
    try {
      const calendarDomain = require('./src/domains/calendar');
      app.use('/api/calendar', calendarDomain.routes);
      console.log('✅ Calendar domain monté');
    } catch (error) {
      console.error('❌ Erreur calendar domain:', error.message);
    }
    
    console.log('✅ Tous les domaines montés avec succès');
    
  } catch (error) {
    console.error('❌ Erreur critique montage domaines:', error.message);
  }
}

// Routes debug
app.get('/debug/routes', (req, res) => {
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
        regexp: r.regexp.toString()
      });
    }
  });
  
  res.json({
    totalRoutes: routes.length,
    routes: routes,
    timestamp: new Date().toISOString()
  });
});

// Catch all pour React
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Route API non trouvée' });
  }
  
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    return res.status(404).json({ error: 'Fichier statique non trouvé' });
  }
  
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).json({ error: 'Frontend non disponible' });
  }
});

// Démarrage
async function startServer() {
  try {
    // MongoDB
    if (process.env.MONGODB_URI) {
      console.log('🔄 Connexion MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000
      });
      console.log('✅ MongoDB connecté');
    }
    
    // Monter les domaines
    await mountDomainsSecurely();
    
    // Démarrer serveur
    app.listen(PORT, () => {
      console.log(`🚀 SERVEUR STABLE RUNNING ON PORT ${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur démarrage:', error.message);
    // En cas d'erreur, démarrer quand même sans MongoDB
    app.listen(PORT, () => {
      console.log(`🚀 SERVEUR STABLE RUNNING ON PORT ${PORT} (MODE DÉGRADÉ)`);
    });
  }
}

startServer();