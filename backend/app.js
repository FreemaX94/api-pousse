// backend/app.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { errors } = require('celebrate');
const logger = require('./utils/logger');

const app = express();

// 🔍 Logger de requêtes HTTP
app.use(morgan('dev'));

// ✅ Origines autorisées en lecture depuis la variable d’env
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🧪 Routes factices de test (temporairement conservées)
app.use('/api/users',               (req, res) => res.status(200).send([]));
app.use('/api/sanitize-test',       (req, res) => res.status(200).send([]));
app.use('/api/statistiques',        (req, res) => res.status(200).send([]));
app.use('/api/comptabilite',        (req, res) => res.status(200).send([]));
app.use('/api/parametres',          (req, res) => res.status(200).send([]));
app.use('/api/creation',            (req, res) => res.status(200).send([]));
app.use('/api/contracts',           (req, res) => res.status(200).send([]));
app.use('/api/depots',              (req, res) => res.status(200).send([]));
app.use('/api/livraisons',          (req, res) => res.status(200).send([]));
app.use('/api/deliveries',          (req, res) => res.status(200).send([]));
app.use('/api/entretien',           (req, res) => res.status(200).send([]));
app.use('/api/vehicules',           (req, res) => res.status(200).send([]));

// 🧪 Mock “products” pour tests rapides
let fakeProducts = [];
app.get('/api/products',            (req, res) => res.status(200).json(fakeProducts));
app.post('/api/products',           (req, res) => { fakeProducts = [req.body]; res.status(201).json(req.body); });
app.get('/api/products/:id',        (req, res) => {
  const found = fakeProducts.find(p => p.id === req.params.id);
  if (!found) return res.status(404).send({ message: 'Not Found' });
  res.status(200).json(found);
});

// ✅ Brancher toutes les vraies routes dynamiques
function setupRoutes() {
  const authRoutes         = require('./routes/authRoutes');
  const stockRoutes        = require('./routes/stocks');
  const invoiceRoutes      = require('./routes/invoices');
  const vehicleRoutes      = require('./routes/vehicles');
  const concepteurRoutes   = require('./routes/concepteurs');
  const catalogueRoutes    = require('./routes/catalogue');
  const catalogueItemRoutes= require('./routes/catalogueitems');
  const nieuwkoopRoutes    = require('./routes/nieuwkoop');
  const eventsRoutes       = require('./routes/events');

  app.use('/api/auth',             authRoutes);
  app.use('/api/stocks',           stockRoutes);
  app.use('/api/invoices',         invoiceRoutes);
  app.use('/api/vehicles',         vehicleRoutes);
  app.use('/api/concepteurs',      concepteurRoutes);
  app.use('/api/catalogue',        catalogueRoutes);
  app.use('/api/catalogueitems',   catalogueItemRoutes);
  app.use('/api/nieuwkoop',        nieuwkoopRoutes);
  app.use('/api/events',           eventsRoutes);
}

setupRoutes();

// 🎯 Gestion des erreurs Celebrate (validation Joi)
app.use(errors());

// 🛑 Middleware global de gestion des erreurs corrigé
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';
  logger.error(`Erreur ${status} :`, message);
  res.status(status).json({ error: message });
});

module.exports = { app, setupRoutes };
