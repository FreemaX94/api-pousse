// Fleet Domain - Domain Driven Design
const express = require('express');
const router = express.Router();

// Routes principales du domaine Fleet
router.use('/vehicles', require('./routes/vehicles'));

// Exports du domaine
module.exports = {
  routes: router,
  controllers: {
    vehicleController: require('./controllers/vehicleController')
  },
  services: {
    vehicleService: require('./services/vehicleService')
  },
  models: {
    Vehicle: require('./models/vehicleModel')
  }
};