// Frontend Express Server pour DigitalOcean
// Sert les fichiers statiques ET gère le proxy vers le backend

const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;

// Proxy middleware pour rediriger /api/* vers le composant backend
app.use('/api', createProxyMiddleware({
  target: 'https://api-pousse-app-5y2wo.ondigitalocean.app',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api' // Keep /api prefix
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(502).json({ error: 'Backend unavailable' });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying: ${req.method} ${req.url} -> backend/api${req.url}`);
  }
}));

// Servir les fichiers statiques (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'dist')));

// Route catch-all pour React Router - sert index.html
app.get('*', (req, res) => {
  // Ne pas servir index.html pour les requêtes API (au cas où le proxy rate)
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Frontend server running on port ${port}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'dist')}`);
  console.log(`🔀 Proxying /api/* to backend component`);
});