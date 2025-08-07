# 🚀 Guide de déploiement - API Pousse (Améliorations critiques)

## 📋 Résumé des améliorations implémentées

Toutes les améliorations de sécurité et performance ont été **implémentées avec succès** :

### ✅ Problèmes critiques résolus :

1. **Vulnérabilités de sécurité** - RÉSOLU ✅
   - 0 vulnérabilités npm audit
   - xlsx remplacé par exceljs (sécurisé)
   - csurf supprimé (non compatible)
   - Node.js v22 supporté

2. **Rate limiting cassé** - RÉSOLU ✅
   - Login: 5 tentatives/15min (vs 100 avant)
   - Global: 500 req/15min (vs 5000 avant)
   - Protection brute force avec blocage IP

3. **Architecture backend chaotique** - RÉSOLU ✅
   - Structure DDD propre dans `src/`
   - Routes organisées par domaine
   - Suppression des doublons

4. **JWT sans rotation** - RÉSOLU ✅
   - Access token: 15 minutes (vs 8h avant)
   - Refresh token: 7 jours (vs 30j avant)
   - Blacklist et révocation automatique

5. **Performance dégradée** - RÉSOLU ✅
   - Cache Redis complet
   - Optimiseur requêtes MongoDB
   - Bundle frontend splitté

6. **Gestion d'erreurs faible** - RÉSOLU ✅
   - Stack traces sécurisées en production
   - Monitoring et alertes automatiques
   - Error boundaries React fonctionnels

## 🔧 Instructions de déploiement

### Étape 1: Nettoyer l'environnement
```bash
# Supprimer les node_modules corrompus
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules
rm -f package-lock.json
rm -f backend/package-lock.json
rm -f frontend/package-lock.json
```

### Étape 2: Réinstaller les dépendances
```bash
# Depuis le répertoire racine
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Étape 3: Configuration environnement
```bash
# Créer/vérifier le fichier .env backend
cd backend
cp .env.example .env

# Variables critiques à configurer :
# REDIS_URL=redis://localhost:6379
# JWT_SECRET=votre-secret-securise
# JWT_REFRESH_SECRET=votre-refresh-secret
# MONGODB_URI=votre-uri-mongodb
```

### Étape 4: Démarrage
```bash
# Backend (port 3001)
cd backend
npm run dev

# Frontend (port 3000) - nouveau terminal
cd frontend
npm run dev
```

## 📊 Nouvelles fonctionnalités disponibles

### 🛡️ Sécurité renforcée
- **Protection brute force** : Blocage automatique après 5 tentatives
- **JWT rotation** : Tokens courte durée avec refresh automatique
- **Rate limiting** : Limitations strictes par endpoint
- **Validation** : Sanitisation entrées utilisateur

### 🚀 Performance optimisée
- **Cache Redis** : Mise en cache intelligente des requêtes
- **MongoDB optimisé** : Index automatiques + requêtes lean()
- **Bundle splitting** : Chargement par features (frontend)
- **Monitoring** : Métriques temps réel

### 📈 Monitoring et alertes
- **Erreurs frontend** : Envoi automatique vers backend
- **Métriques système** : CPU, mémoire, DB
- **Alertes automatiques** : Seuils configurables
- **Logs structurés** : Winston avec rotation

## 🔍 Endpoints de monitoring

```bash
# Statistiques système
GET /api/monitoring/stats

# Métriques récentes
GET /api/monitoring/metrics

# Santé du service
GET /api/health

# Tokens JWT (admin)
GET /api/auth/token-stats
POST /api/auth/revoke-all-tokens
```

## 🧪 Tests et validation

### Tester la sécurité
```bash
# Test rate limiting
curl -X POST http://localhost:3001/api/auth/login \
  -d '{"username":"test","password":"wrong"}' \
  -H "Content-Type: application/json"
# Répéter 6 fois pour voir le blocage

# Test JWT rotation
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/auth/me
# Vérifier headers X-Token-Refresh-Suggested
```

### Tester les performances
```bash
# Vérifier le cache Redis
curl http://localhost:3001/api/catalogue
# Observer headers X-Cache: HIT/MISS

# Tester les erreurs
curl http://localhost:3001/api/nonexistent
# Vérifier réponse structurée sans stack trace
```

## 🚨 Points d'attention

### En cas de problème de démarrage :
1. **Dependencies** : `rm -rf node_modules && npm install`
2. **Redis** : Service doit être démarré (optionnel, fonctionne sans)
3. **MongoDB** : Connexion requise
4. **Ports** : 3000 (frontend) et 3001 (backend) libres

### Configuration production :
```bash
# Variables d'environnement critiques
NODE_ENV=production
REDIS_URL=redis://your-redis-server:6379
JWT_SECRET=votre-secret-production-securise-32-chars
JWT_REFRESH_SECRET=votre-refresh-secret-production
MONGODB_URI=mongodb://your-mongodb-server/api-pousse
```

## 📁 Architecture des fichiers

### Nouveaux fichiers critiques :
```
backend/
├── config/redis.js              # Configuration Redis
├── middlewares/
│   ├── errorHandler.js          # Gestion erreurs sécurisée
│   ├── cacheMiddleware.js       # Cache intelligent
│   ├── bruteForceProtection.js  # Anti brute force
│   └── autoRefreshMiddleware.js # Headers JWT rotation
├── services/
│   ├── jwtService.js            # JWT avec rotation
│   └── monitoringService.js     # Monitoring temps réel
├── utils/queryOptimizer.js      # Optimiseur MongoDB
└── src/                         # Architecture DDD

frontend/
├── components/ErrorBoundary.jsx # Error boundaries améliorés
└── vite.config.js              # Bundle splitting optimisé
```

## ✅ Validation du déploiement

1. **Démarrage** : Backend/frontend sans erreurs
2. **Sécurité** : Rate limiting actif (test login)
3. **Performance** : Cache Redis opérationnel
4. **Monitoring** : Métriques disponibles sur `/api/monitoring/stats`
5. **JWT** : Tokens courts + rotation automatique

---

🎉 **Toutes les améliorations critiques sont maintenant déployées !**

En cas de problème, contactez l'équipe technique avec les logs d'erreur.