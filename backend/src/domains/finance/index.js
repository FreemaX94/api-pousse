// Finance Domain - Domain Driven Design
const express = require('express');
const router = express.Router();

// Routes principales du domaine Finance
router.use('/invoices', require('./routes/invoices'));
router.use('/expenses', require('./routes/expenses'));
router.use('/sales-orders', require('./routes/salesOrders'));
router.use('/contracts', require('./routes/contracts'));
router.use('/comptabilite', require('./routes/comptabilite'));
router.use('/statistiques', require('./routes/statistiques'));

// Exports du domaine
module.exports = {
  routes: router,
  controllers: {
    invoiceController: require('./controllers/invoiceController'),
    expenseController: require('./controllers/expenseController'),
    salesOrdersController: require('./controllers/salesOrdersController'),
    contractController: require('./controllers/contractController')
  },
  services: {
    invoiceService: require('./services/invoiceService'),
    expenseService: require('./services/expenseService'),
    salesOrdersService: require('./services/salesOrdersService'),
    contractService: require('./services/contractService')
  },
  models: {
    Invoice: require('./models/Invoice'),
    Expense: require('./models/Expense'),
    SalesOrder: require('./models/salesOrdersModel'),
    Contract: require('./models/contractModel')
  },
  validators: {
    invoiceValidation: require('./validators/invoiceValidation')
  }
};