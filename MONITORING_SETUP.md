# 🚀 Setup Monitoring APM - API Pousse

## ⚡ Installation Rapide (15 minutes)

### **Étape 1 : Créer un compte New Relic** (2 min)
```bash
# 1. Aller sur https://newrelic.com/signup
# 2. Choisir "Free" tier (100GB/mois)
# 3. Noter la LICENSE_KEY
```

### **Étape 2 : Backend Setup** (5 min)
```bash
# Dans /backend
cd backend
npm install newrelic

# Copier la configuration
cp newrelic.js.template newrelic.js

# Ajouter la clé dans .env
echo "NEW_RELIC_LICENSE_KEY=your_license_key_here" >> .env
```

### **Étape 3 : Activer APM Backend** (2 min)
```javascript
// Dans backend/index.js - PREMIÈRE LIGNE
require('newrelic');

// Puis vos imports habituels
const express = require('express');
// ... reste du code
```

### **Étape 4 : Middleware Integration** (3 min)
```javascript
// Dans backend/app.js
const { apmMiddleware, errorTrackingMiddleware } = require('./middlewares/monitoring');

// Ajouter le middleware APM
app.use(apmMiddleware);

// Ajouter le middleware d'erreurs (en dernier)
app.use(errorTrackingMiddleware);
```

### **Étape 5 : Frontend RUM** (3 min)
```html
<!-- Dans frontend/index.html - AVANT les autres scripts -->
<script type="text/javascript">
  window.NREUM||(NREUM={});NREUM.info = {
    "beacon":"bam.nr-data.net",
    "licenseKey":"YOUR_BROWSER_LICENSE_KEY",
    "applicationID":"YOUR_APP_ID",
    "transactionName":"",
    "queueTime":0,
    "applicationTime":0,
    "ttGuid":"",
    "user":"",
    "agent":""
  };
</script>
```

## 🎯 Métriques Critiques Activées

### **Backend (Automatique)**
✅ **Response Time** par endpoint  
✅ **Error Rate** et stack traces  
✅ **Database Performance** (MongoDB)  
✅ **Memory Usage** et garbage collection  
✅ **External APIs** (Nieuwkoop, Google Calendar)  

### **Frontend (Automatique)**  
✅ **Core Web Vitals** (LCP, FID, CLS)  
✅ **Bundle Load Time** par chunk  
✅ **Route Change Performance**  
✅ **API Call Latency** côté client  
✅ **JavaScript Errors** avec stack trace  

## 📊 Dashboards Pré-configurés

### **1. Executive Summary**
- **Uptime** : 99.9% target
- **User Satisfaction** : Apdex > 0.8
- **Business Impact** : Erreurs → Revenue
- **Growth** : Sessions, conversions

### **2. Performance Overview**
- **API Latency** : P95 < 500ms
- **Frontend Vitals** : LCP < 2.5s
- **Database** : Query time < 100ms
- **Errors** : Rate < 1%

### **3. Nieuwkoop Specific**
- **Catalog Search** : Performance + usage
- **Stock Operations** : Latency critique
- **Bundle Loading** : Code splitting efficacité

## 🔔 Alertes Configurées

### **🚨 Critical (Immédiat)**
```javascript
// Site Down
response_time > 10s OU error_rate > 10%
→ SMS + Email immédiat

// Database Critical
query_time > 5s OU connection_failed
→ PagerDuty escalation

// Memory Leak
heap_growth > 50MB/hour
→ Slack #dev-alerts
```

### **⚠️ Warning (5min delay)**
```javascript
// Performance Degradation  
response_time > 2s OU bundle_size > 1MB
→ Slack #monitoring

// High Error Rate
error_rate > 5% pendant 5min
→ Email team dev
```

## 🎛 Métriques Business Custom

### **Usage Nieuwkoop**
```javascript
// Dans vos composants React
import monitoring from './utils/monitoring';

// Search performance
monitoring.trackUserAction('nieuwkoop_search', {
  searchTerm: query,
  resultsCount: results.length,
  loadTime: duration
});

// Stock operations
monitoring.trackUserAction('stock_entry', {
  quantity: newQuantity,
  value: price * quantity,
  category: itemCategory
});
```

### **Endpoints Backend**
```javascript
// Dans vos routes
const { businessMetricsMiddleware } = require('../middlewares/monitoring');

// Route catalogue
app.get('/api/nieuwkoop/stock', 
  businessMetricsMiddleware('nieuwkoop_search'),
  nieuwkoopController.getStock
);

// Routes stock
app.post('/api/stocks', 
  businessMetricsMiddleware('stock_operation'),
  stockController.createEntry
);
```

## 📈 ROI Immédiat Attendu

### **Semaine 1**
- **Visibilité** : 100% des erreurs trackées
- **MTTR** : Réduction 50% temps résolution
- **Performance** : Identification goulots

### **Mois 1** 
- **Optimisations** : -30% temps réponse API
- **Stabilité** : +99.5% uptime
- **UX** : Core Web Vitals optimisés

### **Mois 3**
- **Business** : Corrélation performance ↔ conversions
- **Prédictif** : Alertes avant downtime
- **Coûts** : -20% infrastructure (scaling intelligent)

## 🔧 Troubleshooting Rapide

### **New Relic ne reçoit pas de données**
```bash
# Vérifier la configuration
node -e "console.log(require('./newrelic').config)"

# Tester la connexion
curl -H "Api-Key: YOUR_LICENSE_KEY" \
  https://api.newrelic.com/v2/applications.json
```

### **Frontend RUM non actif**
```javascript
// Dans la console browser
console.log(window.NREUM);
console.log(window.newrelic);

// Si undefined, vérifier le script browser agent
```

### **Métriques manquantes**
```javascript
// Forcer un événement test
const newrelic = require('newrelic');
newrelic.recordCustomEvent('TestEvent', { test: true });
```

## 🎯 Next Steps Avancés

### **Semaine 2 : Optimisations**
- **Bundle Analysis** : Recharts + MUI splitting
- **API Caching** : Redis integration  
- **CDN Setup** : Static assets optimization

### **Mois 1 : Intelligence**
- **Machine Learning** : Anomaly detection
- **Predictive Scaling** : Auto-scale droplets
- **Business Correlation** : Performance → Revenue

### **Mois 2 : Enterprise**
- **Multi-environment** : Staging + Prod monitoring
- **Team Dashboards** : Dev, Ops, Business views
- **SLA Tracking** : Customer-facing metrics

---

**🚀 Démarrage**: Suivre étapes 1-5, puis accéder aux dashboards sur https://one.newrelic.com

**💬 Support**: Documentation complète dans `MONITORING_STRATEGY.md`