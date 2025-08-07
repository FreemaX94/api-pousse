// backend/src/routeMapping.js
// Mapping des anciennes routes vers la nouvelle architecture DDD

/**
 * MIGRATION GUIDE - Ancien système vers DDD
 * 
 * AVANT (routes chaotiques):
 * /api/auth -> /routes/authRoutes.js
 * /api/stocks -> /routes/stocks.js  
 * /api/invoices -> /routes/invoices.js
 * /api/catalogue -> /routes/catalogue.js
 * /api/nieuwkoop -> /routes/nieuwkoop.js
 * + doublons dans /src/domains/
 * 
 * MAINTENANT (architecture DDD):
 * /api/auth -> src/domains/auth/
 * /api/inventory/stocks -> src/domains/inventory/
 * /api/finance/invoices -> src/domains/finance/
 * /api/catalog/catalogue -> src/domains/catalog/
 * /api/catalog/nieuwkoop -> src/domains/catalog/
 */

const routeMapping = {
  // Authentication domain
  '/api/auth': 'src/domains/auth',
  
  // Inventory domain (ex-stocks)
  '/api/inventory/stocks': 'src/domains/inventory',
  '/api/inventory/movements': 'src/domains/inventory',
  '/api/inventory/livraisons': 'src/domains/inventory',
  '/api/inventory/deliveries': 'src/domains/inventory',
  '/api/inventory/items': 'src/domains/inventory',
  '/api/inventory/produits': 'src/domains/inventory',
  '/api/inventory/prices': 'src/domains/inventory',
  '/api/inventory/depots': 'src/domains/inventory',
  
  // Finance domain
  '/api/finance/invoices': 'src/domains/finance',
  '/api/finance/expenses': 'src/domains/finance',
  '/api/finance/sales-orders': 'src/domains/finance',
  '/api/finance/contracts': 'src/domains/finance',
  '/api/finance/comptabilite': 'src/domains/finance',
  '/api/finance/statistiques': 'src/domains/finance',
  
  // Catalog domain
  '/api/catalog': 'src/domains/catalog',
  '/api/catalog/items': 'src/domains/catalog',
  '/api/catalog/nieuwkoop': 'src/domains/catalog',
  '/api/catalog/nieuwkoop-health': 'src/domains/catalog',
  '/api/catalog/nieuwkoop-proxy': 'src/domains/catalog',
  '/api/catalog/comptoirfleuriste': 'src/domains/catalog',
  '/api/catalog/partners': 'src/domains/catalog',
  
  // Fleet domain
  '/api/fleet/vehicles': 'src/domains/fleet',
  
  // Projects domain
  '/api/projects/projets': 'src/domains/projects',
  '/api/projects/concepteurs': 'src/domains/projects',
  '/api/projects/entretien': 'src/domains/projects',
  '/api/projects/creation': 'src/domains/projects',
  '/api/projects/parametres': 'src/domains/projects',
  
  // Calendar domain
  '/api/calendar/events': 'src/domains/calendar',
  '/api/calendar/evenements': 'src/domains/calendar'
};

// Routes obsolètes à supprimer
const deprecatedRoutes = [
  '/routes/authRoutes.js',
  '/routes/stocks.js',
  '/routes/invoices.js',
  '/routes/expenses.js',
  '/routes/vehicles.js',
  '/routes/concepteurs.js',
  '/routes/catalogue.js',
  '/routes/catalogueitems.js',
  '/routes/nieuwkoop.js',
  '/routes/nieuwkoopProxy.js',
  '/routes/partnerItems.js',
  '/routes/comptoirfleuriste.js',
  '/routes/livraisons.js',
  '/routes/movementRoutes.js',
  '/routes/evenements.js',
  '/routes/eventsRoutes.js',
  '/routes/projets.js'
];

module.exports = {
  routeMapping,
  deprecatedRoutes
};