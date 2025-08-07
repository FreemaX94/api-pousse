// Calendar Domain - Domain Driven Design
const express = require('express');
const router = express.Router();

// Routes principales du domaine Calendar
router.use('/events', require('./routes/events'));
router.use('/evenements', require('./routes/evenements'));

// Exports du domaine
module.exports = {
  routes: router,
  controllers: {
    calendarController: require('./controllers/calendarController'),
    evenementController: require('./controllers/evenementController')
  },
  services: {
    calendarService: require('./services/calendarService')
  },
  models: {
    Evenement: require('./models/Evenement')
  }
};