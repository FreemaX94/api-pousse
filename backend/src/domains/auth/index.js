// Auth Domain - Domain Driven Design
const express = require('express');
const router = express.Router();

// Routes principales du domaine Auth
router.use('/', require('./routes/authRoutes'));
router.use('/users', require('./routes/userRoutes'));
router.use('/admin', require('./routes/adminRoutes'));

// Exports du domaine
module.exports = {
  routes: router,
  controllers: {
    authController: require('./controllers/authController'),
    userController: require('./controllers/userController')
  },
  services: {
    authService: require('./services/authService'),
    userService: require('./services/userService')
  },
  models: {
    User: require('./models/userModel')
  },
  validators: {
    authValidator: require('./validators/authValidator')
  }
};