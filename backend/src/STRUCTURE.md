# Backend Structure Organization

## Vue d'ensemble

Le backend est maintenant organisé selon une architecture **Domain-Driven Design (DDD)** pour une meilleure maintenabilité et évolutivité.

## Structure des dossiers

```
src/
├── domains/                    # Domaines métier
│   ├── auth/                  # Authentification et utilisateurs
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── validators/
│   │   └── index.js
│   ├── catalog/               # Catalogue produits et fournisseurs
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── validators/
│   │   └── index.js
│   ├── inventory/             # Gestion stocks et mouvements
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── validators/
│   │   └── index.js
│   ├── finance/               # Facturation et comptabilité
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── validators/
│   │   └── index.js
│   ├── fleet/                 # Gestion véhicules
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── projects/              # Projets et concepteurs
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── validators/
│   │   └── index.js
│   └── calendar/              # Calendrier et événements
│       ├── controllers/
│       ├── services/
│       ├── models/
│       ├── routes/
│       └── index.js
├── shared/                    # Composants partagés
│   ├── middleware/           # Middlewares réutilisables
│   ├── utils/                # Utilitaires communs
│   ├── models/               # Modèles partagés
│   ├── services/             # Services utilitaires
│   ├── controllers/          # Contrôleurs utilitaires
│   └── index.js
└── index.js                  # Point d'entrée principal
```

## Domaines métier

### 🔐 Auth Domain
- **Responsabilité** : Authentification, autorisation, gestion utilisateurs
- **Fichiers** : authController, userController, authService, userModel
- **Routes** : `/api/auth/*`, `/api/users/*`, `/api/admin/*`

### 📦 Catalog Domain
- **Responsabilité** : Catalogue produits, intégrations fournisseurs (Nieuwkoop, ComptoirFleuriste)
- **Fichiers** : catalogueController, nieuwkoopController, catalogueService
- **Routes** : `/api/catalogue/*`, `/api/nieuwkoop/*`, `/api/partneritems/*`

### 📊 Inventory Domain
- **Responsabilité** : Gestion stocks, mouvements, livraisons
- **Fichiers** : stockController, movementController, stockService
- **Routes** : `/api/stocks/*`, `/api/movements/*`, `/api/livraisons/*`

### 💰 Finance Domain
- **Responsabilité** : Facturation, dépenses, comptabilité, contrats
- **Fichiers** : invoiceController, expenseController, invoiceService
- **Routes** : `/api/invoices/*`, `/api/expenses/*`, `/api/contracts/*`

### 🚗 Fleet Domain
- **Responsabilité** : Gestion des véhicules
- **Fichiers** : vehicleController, vehicleService, vehicleModel
- **Routes** : `/api/vehicles/*`

### 🏗️ Projects Domain
- **Responsabilité** : Projets, concepteurs, entretiens
- **Fichiers** : projetController, concepteurController, entretienController
- **Routes** : `/api/projets/*`, `/api/concepteurs/*`, `/api/entretiens/*`

### 📅 Calendar Domain
- **Responsabilité** : Événements, calendrier, intégration Google Calendar
- **Fichiers** : calendarController, evenementController, calendarService
- **Routes** : `/api/events/*`, `/api/evenements/*`

## Composants partagés

### Middleware
- Sécurité (helmet, rate limiting)
- Authentification et autorisation
- Sanitisation des entrées
- Gestion des erreurs
- Upload de fichiers

### Utils
- Logger
- Gestion d'erreurs
- Sanitisation HTML
- Utilitaires API

### Services partagés
- Service mail
- Synchronisation Google Sheets
- Synchronisation Google Drive

## Avantages de cette structure

### ✅ Séparation des responsabilités
- Chaque domaine a une responsabilité claire
- Réduction du couplage entre modules
- Facilite la maintenance et les tests

### ✅ Évolutivité
- Ajout facile de nouveaux domaines
- Isolation des changements
- Architecture modulaire

### ✅ Navigation facilitée
- Structure logique et prévisible
- Index files pour les imports simplifiés
- Documentation claire des responsabilités

### ✅ Réutilisabilité
- Composants partagés centralisés
- Évite la duplication de code
- Middlewares réutilisables

## Usage des index files

Chaque domaine expose ses composants via un fichier `index.js` :

```javascript
// Exemple d'utilisation
const { auth } = require('./src/domains/auth');
const authController = auth.controllers.authController;

// Ou directement
const authController = require('./src/domains/auth/controllers/authController');
```

## Migration

La migration a été effectuée en préservant :
- ✅ Toutes les fonctionnalités existantes
- ✅ Les noms de fichiers originaux
- ✅ La compatibilité des imports
- ✅ La structure des routes API

## Recommandations

1. **Nouveaux développements** : Utiliser la structure par domaine
2. **Imports** : Privilégier les imports relatifs courts
3. **Tests** : Organiser les tests selon la même structure
4. **Documentation** : Maintenir à jour ce fichier lors des changements