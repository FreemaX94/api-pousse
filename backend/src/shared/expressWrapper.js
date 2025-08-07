// Wrapper pour Express pour éviter les conflits avec New Relic
const express = require('express');

// Créer une fonction qui retarde la création du router
function createDelayedRouter() {
  let router = null;
  
  // Proxy pour intercepter les appels
  const handler = {
    get(target, prop) {
      // Initialiser le router au premier accès
      if (!router) {
        router = express.Router();
      }
      
      // Si c'est une méthode du router, la retourner
      if (typeof router[prop] === 'function') {
        return (...args) => {
          try {
            return router[prop](...args);
          } catch (error) {
            console.warn(`⚠️ Erreur router.${prop}:`, error.message);
            // Continuer même en cas d'erreur
            return router;
          }
        };
      }
      
      return router[prop];
    }
  };
  
  return new Proxy({}, handler);
}

// Wrapper pour express() aussi
function createApp() {
  const app = express();
  
  // Override de use() pour gérer les erreurs
  const originalUse = app.use.bind(app);
  app.use = function(...args) {
    try {
      return originalUse(...args);
    } catch (error) {
      console.warn('⚠️ Erreur app.use:', error.message);
      return app;
    }
  };
  
  return app;
}

module.exports = {
  express,
  Router: createDelayedRouter,
  createApp
};