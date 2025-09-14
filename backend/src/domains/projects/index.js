// Projects Domain - Domain Driven Design
const express = require('express');
const router = express.Router();

// Routes principales du domaine Projects
router.use('/projets', require('./routes/projets'));
// Route racine pour /api/projects - rediriger vers /projets
router.use('/', require('./routes/projets'));
router.use('/concepteurs', require('./routes/concepteurs'));
router.use('/entretien', require('./routes/entretien'));
router.use('/creation', require('./routes/creation'));
router.use('/parametres', require('./routes/parametres'));
router.use('/test', require('./routes/test-projet')); // Route de test temporaire

// Nouvelles routes pour les fonctionnalités avancées
try {
  router.use('/history', require('./routes/historyRoutes'));
  console.log('✅ Routes history chargées');
} catch (error) {
  console.warn('⚠️ Routes history non disponibles:', error.message);
}

try {
  router.use('/templates', require('./routes/templateRoutes'));
  console.log('✅ Routes templates chargées');
} catch (error) {
  console.warn('⚠️ Routes templates non disponibles:', error.message);
}

try {
  router.use('/exports', require('./routes/exportRoutes'));
  console.log('✅ Routes exports chargées');
} catch (error) {
  console.warn('⚠️ Routes exports non disponibles:', error.message);
}

try {
  router.use('/comments', require('./routes/commentRoutes'));
  console.log('✅ Routes comments chargées');
} catch (error) {
  console.warn('⚠️ Routes comments non disponibles:', error.message);
}

// Exports du domaine
module.exports = {
  routes: router,
  controllers: {
    projetController: require('./controllers/projetController'),
    concepteurController: require('./controllers/concepteurController'),
    entretienController: require('./controllers/entretienController'),
    // Nouveaux contrôleurs
    historyController: (() => {
      try { return require('./controllers/historyController'); }
      catch (e) { console.warn('⚠️ historyController non disponible:', e.message); return null; }
    })(),
    templateController: (() => {
      try { return require('./controllers/templateController'); }
      catch (e) { console.warn('⚠️ templateController non disponible:', e.message); return null; }
    })(),
    exportController: (() => {
      try { return require('./controllers/exportController'); }
      catch (e) { console.warn('⚠️ exportController non disponible:', e.message); return null; }
    })(),
    commentController: (() => {
      try { return require('./controllers/commentController'); }
      catch (e) { console.warn('⚠️ commentController non disponible:', e.message); return null; }
    })()
  },
  services: {
    concepteurService: require('./services/concepteurService'),
    // Nouveaux services
    historyService: (() => {
      try { return require('./services/historyService'); }
      catch (e) { console.warn('⚠️ historyService non disponible:', e.message); return null; }
    })(),
    exportService: (() => {
      try { return require('./services/exportService'); }
      catch (e) { console.warn('⚠️ exportService non disponible:', e.message); return null; }
    })(),
    notificationService: (() => {
      try { return require('./services/notificationService'); }
      catch (e) { console.warn('⚠️ notificationService non disponible:', e.message); return null; }
    })()
  },
  models: {
    Projet: require('./models/Projet'),
    Concepteur: require('./models/Concepteur'),
    Entretien: require('./models/Entretien'),
    // Nouveaux modèles
    ProjectHistory: (() => {
      try { return require('./models/ProjectHistory'); }
      catch (e) { console.warn('⚠️ ProjectHistory non disponible:', e.message); return null; }
    })(),
    ProjectTemplate: (() => {
      try { return require('./models/ProjectTemplate'); }
      catch (e) { console.warn('⚠️ ProjectTemplate non disponible:', e.message); return null; }
    })(),
    Comment: (() => {
      try { return require('./models/Comment'); }
      catch (e) { console.warn('⚠️ Comment non disponible:', e.message); return null; }
    })(),
    Notification: (() => {
      try { return require('./models/Notification'); }
      catch (e) { console.warn('⚠️ Notification non disponible:', e.message); return null; }
    })()
  },
  validators: {
    projetValidator: require('./validators/projetValidator'),
    evenementValidator: require('./validators/evenementValidator')
  }
};