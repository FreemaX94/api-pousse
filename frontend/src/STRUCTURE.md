# Frontend Structure Organization

## Vue d'ensemble

Le frontend est maintenant organisé selon une architecture **Feature-Based** pour une meilleure maintenabilité et évolutivité.

## Structure des dossiers

```
src/
├── features/                   # Fonctionnalités métier
│   ├── auth/                  # Authentification
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   └── index.js
│   ├── catalog/               # Catalogue produits
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   └── index.js
│   ├── inventory/             # Gestion stocks
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   └── index.js
│   ├── finance/               # Finance & comptabilité
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   └── index.js
│   ├── fleet/                 # Gestion véhicules
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   └── index.js
│   ├── projects/              # Projets & entretiens
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   └── index.js
│   ├── calendar/              # Calendrier & événements
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   └── index.js
│   ├── dashboard/             # Tableau de bord
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   └── index.js
│   └── index.js              # Barrel export
├── shared/                    # Composants partagés
│   ├── components/           # UI components réutilisables
│   ├── hooks/                # Hooks personnalisés partagés
│   ├── utils/                # Utilitaires communs
│   ├── api/                  # Configuration API globale
│   │   ├── domains/          # APIs organisées par domaine
│   │   └── config.js
│   ├── types/                # Types TypeScript partagés
│   ├── providers/            # Context providers
│   └── index.js              # Exports
├── layouts/                   # Layouts de page
│   ├── MainLayout.jsx        # Layout principal avec navigation
│   └── AuthLayout.jsx        # Layout pour pages d'authentification
├── routes/                    # Configuration des routes
│   └── index.jsx             # Router principal
├── assets/                    # Ressources statiques
├── __tests__/                 # Tests globaux
├── App.jsx                    # Composant racine
├── main.jsx                   # Point d'entrée
└── index.css                  # Styles globaux
```

## Fonctionnalités (Features)

### 🔐 Auth Feature
- **Responsabilité** : Authentification, autorisation, gestion de session
- **Pages** : Login, Signup, ForgotPassword, ResetPassword, Activation
- **Components** : PrivateRoute, LogoutButton
- **Routes** : `/auth/*`

### 📦 Catalog Feature
- **Responsabilité** : Catalogue produits, intégrations fournisseurs
- **Pages** : Nieuwkoop, CatalogueAdmin
- **Components** : CatalogueAdminPanel, PlantSearchBar
- **Routes** : `/nieuwkoop`, `/catalogue-admin`

### 📊 Inventory Feature
- **Responsabilité** : Gestion stocks, mouvements, livraisons
- **Pages** : Mouvements, LivraisonList, Depot
- **Components** : StockViewer, MouvementForm, EntryForm, ExitForm
- **Routes** : `/mouvements`, `/livraisons`, `/depot`

### 💰 Finance Feature
- **Responsabilité** : Facturation, dépenses, comptabilité
- **Pages** : Comptabilite, AddContract, Statistiques
- **Components** : InvoiceForm, ExpenseForm, AccountingStats
- **Hooks** : useExpenses
- **Routes** : `/comptabilite`, `/add-contract`, `/statistiques`

### 🚗 Fleet Feature
- **Responsabilité** : Gestion des véhicules
- **Pages** : Vehicules
- **Components** : VehicleForm, VehicleCard, VehicleStats
- **Hooks** : useVehicles
- **Routes** : `/vehicules`

### 🏗️ Projects Feature
- **Responsabilité** : Projets, concepteurs, entretiens
- **Pages** : Creation, Parametres, Entretien, EntretienModern
- **Components** : ProjetForm, ProjetList, EntretienCard
- **Hooks** : useEntretiens
- **Routes** : `/creation`, `/parametres`, `/entretien`

### 📅 Calendar Feature
- **Responsabilité** : Événements, calendrier
- **Pages** : Evenements
- **Routes** : `/evenements`

### 📈 Dashboard Feature
- **Responsabilité** : Tableau de bord, vues d'ensemble
- **Components** : Dashboard, ProcessInfo, SuiviClientsTab
- **Routes** : `/dashboard`

## Composants partagés

### Components
- **Navigation** : NavBar, SidebarFilters
- **UI** : Modal, ExcelUploader, FormulaireMain
- **Admin** : AdminPage
- **Errors** : NotFound

### Hooks
- Hooks personnalisés réutilisables entre features

### Utils
- **logger** : Système de logs
- **sanitizeHtml** : Sanitisation HTML
- **securityHeaders** : Headers de sécurité

### API
- **config** : Configuration globale API
- **domains** : APIs organisées par domaine métier

### Providers
- **QueryProvider** : React Query configuration

## Layouts

### MainLayout
- Layout principal avec navigation
- Utilisé pour toutes les pages authentifiées
- Contient la NavBar et le contenu principal

### AuthLayout
- Layout spécialisé pour l'authentification
- Design centré et minimal
- Pas de navigation

## Routing

### Structure hiérarchique
- **Routes publiques** : `/auth/*`
- **Routes protégées** : `/` (avec PrivateRoute)
- **Layouts automatiques** : Selon le type de route

### Avantages
- Routes organisées par domaine
- Protection automatique via PrivateRoute
- Layouts intelligents selon le contexte

## Avantages de cette structure

### ✅ Séparation des responsabilités
- Chaque feature est autonome
- Logique métier isolée par domaine
- Composants partagés centralisés

### ✅ Évolutivité
- Ajout facile de nouvelles features
- Isolation des changements
- Architecture modulaire

### ✅ Maintenabilité
- Structure prévisible et cohérente
- Imports organisés via barrel exports
- Tests co-localisés avec les features

### ✅ Performance
- Code splitting naturel par feature
- Lazy loading possible par route
- Bundle optimization automatique

### ✅ Développement en équipe
- Features indépendantes
- Conflits Git réduits
- Spécialisation par domaine métier

## Usage des barrel exports

Chaque feature expose ses composants via un fichier `index.js` :

```javascript
// Import depuis une feature
import { LoginPage, PrivateRoute } from '../features/auth';

// Import depuis shared
import { NavBar, Modal } from '../shared';

// Import global depuis features
import { LoginPage } from '../features';
```

## Migration

La migration a préservé :
- ✅ Toutes les fonctionnalités existantes
- ✅ Les noms de composants originaux
- ✅ La logique métier
- ✅ Les styles CSS existants

## Recommandations

1. **Nouveaux développements** : Créer dans la feature appropriée
2. **Composants réutilisables** : Placer dans `shared/components`
3. **Logique métier** : Garder isolée dans chaque feature
4. **Tests** : Co-localiser avec les composants
5. **Types** : Définir au niveau feature ou shared selon l'usage

## Performance

### Code Splitting
- Chaque feature peut être lazy-loadée
- Routes organisées pour optimiser les bundles
- Composants partagés dans un bundle commun

### Bundle Analysis
```bash
npm run build
npm run preview
```

Cette structure moderne et optimisée facilite le développement, la maintenance et l'évolution de l'application !