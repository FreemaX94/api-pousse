// Catalog Domain - Domain Driven Design
const express = require('express');
const router = express.Router();

// Routes principales du domaine Catalog
router.use('/', require('./routes/catalogue'));
router.use('/items', require('./routes/catalogueitems'));
router.use('/nieuwkoop', require('./routes/nieuwkoop'));
router.use('/nieuwkoop-health', require('./routes/nieuwkoopHealth'));
router.use('/nieuwkoop-proxy', require('./routes/nieuwkoopProxy'));
router.use('/comptoirfleuriste', require('./routes/comptoirfleuriste'));
router.use('/partners', require('./routes/partnerItems'));

// Exports du domaine
module.exports = {
  routes: router,
  controllers: {
    catalogueController: require('./controllers/catalogueController'),
    nieuwkoopController: require('./controllers/nieuwkoopController'),
    partnerItemController: require('./controllers/partnerItemController'),
    comptoirfleuristeController: require('./controllers/comptoirfleuriste.controller')
  },
  services: {
    catalogueService: require('./services/catalogueService'),
    nieuwkoopApi: require('./services/nieuwkoopApi'),
    nieuwkoopAuth: require('./services/nieuwkoopAuth'),
    nieuwkoopCustomerApi: require('./services/nieuwkoopCustomerApi'),
    nieuwkoopProxy: require('./services/nieuwkoopProxy'),
    comptoirfleuristeService: require('./services/comptoirfleuriste.service')
  },
  models: {
    CatalogueItem: require('./models/CatalogueItem'),
    NieuwkoopItem: require('./models/nieuwkoopItemModel'),
    PartnerItem: require('./models/partnerItemModel'),
    ComptoirFleuriste: require('./models/comptoirfleuriste.model')
  },
  validators: {
    comptoirfleuristeValidator: require('./validators/comptoirfleuriste.validator')
  }
};