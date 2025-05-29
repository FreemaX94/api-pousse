const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express();

// 🔍 Logger de requêtes HTTP
app.use(morgan('dev'));

app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://api-pousse-app-5y2wo.ondigitalocean.app'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🧪 Routes factices pour tests simples
app.use('/api/users', (req, res) => res.status(200).send([]));
app.use('/api/sanitize-test', (req, res) => res.status(200).send([]));
app.use('/api/statistiques', (req, res) => res.status(200).send([]));
app.use('/api/comptabilite', (req, res) => res.status(200).send([]));
app.use('/api/parametres', (req, res) => res.status(200).send([]));
app.use('/api/creation', (req, res) => res.status(200).send([]));
app.use('/api/contracts', (req, res) => res.status(200).send([]));
app.use('/api/depots', (req, res) => res.status(200).send([]));
app.use('/api/events', (req, res) => res.status(200).send([]));
app.use('/api/livraisons', (req, res) => res.status(200).send([]));
app.use('/api/deliveries', (req, res) => res.status(200).send([]));
app.use('/api/entretien', (req, res) => res.status(200).send([]));
app.use('/api/vehicules', (req, res) => res.status(200).send([]));

// 🧪 Produits simulés
let fakeProducts = [];

app.get('/api/products', (req, res) => {
  res.status(200).json(fakeProducts);
});

app.post('/api/products', (req, res) => {
  fakeProducts = [req.body];
  res.status(201).json(req.body);
});

app.get('/api/products/:id', (req, res) => {
  const found = fakeProducts.find(p => p.id === req.params.id);
  if (!found) return res.status(404).send({ message: 'Not Found' });
  res.status(200).json(found);
});

// ✅ Brancher toutes les vraies routes dynamiques
function setupRoutes() {
  const authRoutes = require('./routes/authRoutes');
  const stockRoutes = require('./routes/stocks');
  const invoiceRoutes = require('./routes/invoices'); // ✅ ajouté
  const vehicleRoutes = require('./routes/vehicles'); // ✅ ajouté

  app.use('/api/auth', authRoutes);
  app.use('/stocks', stockRoutes);
  app.use('/api/invoices', invoiceRoutes); // ✅ activé
  app.use('/api/vehicles', vehicleRoutes); // ✅ activé
}

module.exports = { app, setupRoutes };
