// Projects Domain - Domain Driven Design
const express = require('express');
const router = express.Router();

// Routes principales du domaine Projects
router.use('/projets', require('./routes/projets'));
router.use('/concepteurs', require('./routes/concepteurs'));
router.use('/entretien', require('./routes/entretien'));
router.use('/creation', require('./routes/creation'));
router.use('/parametres', require('./routes/parametres'));
router.use('/test', require('./routes/test-projet')); // Route de test temporaire

// Exports du domaine
module.exports = {
  routes: router,
  controllers: {
    projetController: require('./controllers/projetController'),
    concepteurController: require('./controllers/concepteurController'),
    entretienController: require('./controllers/entretienController')
  },
  services: {
    concepteurService: require('./services/concepteurService')
  },
  models: {
    Projet: require('./models/Projet'),
    Concepteur: require('./models/Concepteur'),
    Entretien: require('./models/Entretien')
  },
  validators: {
    projetValidator: require('./validators/projetValidator'),
    evenementValidator: require('./validators/evenementValidator')
  }
};