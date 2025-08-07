// Inventory Domain - Domain Driven Design
const express = require('express');
const router = express.Router();

// Routes principales du domaine Inventory
router.use('/stocks', require('./routes/stocks'));
router.use('/movements', require('./routes/movementRoutes'));
router.use('/livraisons', require('./routes/livraisons'));
router.use('/deliveries', require('./routes/deliveries'));
router.use('/items', require('./routes/items'));
router.use('/produits', require('./routes/produits'));
router.use('/prices', require('./routes/prices'));
router.use('/depots', require('./routes/depots'));

// Exports du domaine
module.exports = {
  routes: router,
  controllers: {
    stockController: require('./controllers/stockController'),
    movementController: require('./controllers/movementController'),
    livraisonController: require('./controllers/livraisonController'),
    deliveryController: require('./controllers/deliveryController'),
    itemsController: require('./controllers/itemsController'),
    produitsController: require('./controllers/produitsController'),
    pricesController: require('./controllers/pricesController')
  },
  services: {
    stockService: require('./services/stockService'),
    movementService: require('./services/movementService'),
    deliveryService: require('./services/deliveryService'),
    itemsService: require('./services/itemsService'),
    produitsService: require('./services/produitsService'),
    pricesService: require('./services/pricesService')
  },
  models: {
    StockEntry: require('./models/StockEntry'),
    Movement: require('./models/movementModel'),
    Livraison: require('./models/livraisonModel'),
    Delivery: require('./models/Delivery'),
    Item: require('./models/Item'),
    Produit: require('./models/Produit'),
    Price: require('./models/Price')
  },
  validators: {
    deliveryValidator: require('./validators/deliveryValidator')
  }
};