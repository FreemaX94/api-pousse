// SERVEUR MINIMAL D'URGENCE - Pour diagnostiquer DigitalOcean
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS simple
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes de test d'urgence
app.get('/test-route', (req, res) => {
  res.json({ 
    message: 'SERVEUR MINIMAL FONCTIONNE !', 
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

app.get('/debug/minimal', (req, res) => {
  res.json({
    status: 'MINIMAL SERVER WORKING',
    environment: process.env.NODE_ENV,
    mongodb: process.env.MONGODB_URI ? 'configuré' : 'non configuré',
    timestamp: new Date().toISOString()
  });
});

// Route auth minimale pour test
app.post('/api/auth/login', (req, res) => {
  res.json({
    message: 'Route auth/login accessible !',
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    message: 'Route auth/me accessible !',
    timestamp: new Date().toISOString()
  });
});

// Catch all
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ 
      error: 'Frontend non disponible',
      path: req.path,
      indexPath
    });
  }
});

// Démarrage sans MongoDB pour test rapide
console.log('🚨 DÉMARRAGE SERVEUR MINIMAL...');
app.listen(PORT, () => {
  console.log(`🚨 SERVEUR MINIMAL RUNNING ON PORT ${PORT}`);
  console.log(`🔗 Test: http://localhost:${PORT}/test-route`);
});