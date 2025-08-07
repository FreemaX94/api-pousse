# Log de Nettoyage des Routes Backend

**Date:** 27 Juillet 2025  
**Action:** Suppression des fichiers de routes orphelins

## Résumé

- **Fichiers avant nettoyage:** 53
- **Fichiers après nettoyage:** 22
- **Fichiers supprimés:** 31

## Fichiers Supprimés

### Routes Admin/User (3 fichiers)
- `adminRoutes.js` - Routes de seed non utilisées
- `userRoutes.js` - Doublon
- `usersRoutes.js` - Doublon

### Routes Contrats (3 fichiers)
- `contractRoutes.js` - Doublon
- `contracts.js` - Doublon
- `contractsRoutes.js` - Doublon

### Routes Livraisons/Delivery (4 fichiers)
- `deliveries.js` - Doublon
- `deliveriesRoutes.js` - Doublon
- `deliveryRoutes.js` - Doublon  
- `livraisonsRoutes.js` - Doublon (livraisons.js est monté)

### Routes Création (2 fichiers)
- `creation.js` - Non utilisé
- `creationRoutes.js` - Non utilisé

### Routes Dépôts (2 fichiers)
- `depots.js` - Non utilisé
- `depotsRoutes.js` - Non utilisé

### Routes Entretien (1 fichier)
- `entretien.js` - Doublon (entretienRoutes.js est monté)

### Routes Events (1 fichier)
- `events.js` - Doublon (eventsRoutes.js est monté)

### Routes Paramètres (2 fichiers)
- `parametres.js` - Non utilisé
- `parametresRoutes.js` - Non utilisé

### Routes Sanitize (2 fichiers)
- `sanitizeTest.js` - Test non utilisé
- `sanitizetestRoutes.js` - Test non utilisé

### Routes Sheet (2 fichiers)
- `sheetRoutes.js` - Non utilisé
- `sheetSyncRoutes.js` - Non utilisé

### Routes Statistiques (2 fichiers)
- `statistiques.js` - Non utilisé
- `statistiquesRoutes.js` - Non utilisé

### Routes Comptabilité (2 fichiers)
- `comptabilite.js` - Non utilisé
- `comptabiliteRoutes.js` - Non utilisé

### Autres Routes (5 fichiers)
- `items.js` - Non utilisé
- `nieuwkoopHealth.js` - Non utilisé (health.js existe)
- `prices.js` - Non utilisé
- `produits.js` - Non utilisé
- `salesOrders.js` - Non utilisé

## Routes Actives (22 fichiers)

Les routes suivantes sont montées dans `app.js` et constituent l'API active :

| Route | Fichier | Endpoint |
|-------|---------|----------|
| Authentification | `authRoutes.js` | `/api/auth` |
| Stocks | `stocks.js` | `/api/stocks` |
| Factures | `invoices.js` | `/api/invoices` |
| Dépenses | `expenses.js` | `/api/expenses` |
| Véhicules | `vehicles.js` | `/api/vehicles` |
| Concepteurs | `concepteurs.js` | `/api/concepteurs` |
| Catalogue | `catalogue.js` | `/api/catalogue` |
| Articles Catalogue | `catalogueitems.js` | `/api/catalogueitems` |
| Nieuwkoop | `nieuwkoop.js` | `/api/nieuwkoop` |
| Événements | `eventsRoutes.js` | `/api/events` |
| Mouvements | `movementRoutes.js` | `/api/movements` |
| Articles Partenaires | `partnerItems.js` | `/api/partneritems` |
| Événements (FR) | `evenements.js` | `/api/evenements` |
| Comptoir Fleuriste | `comptoirfleuriste.js` | `/api/comptoirfleuriste` |
| Projets | `projets.js` | `/api/projets` |
| Proxy Nieuwkoop | `nieuwkoopProxy.js` | `/api/nieuwkoop-proxy` |
| Livraisons | `livraisons.js` | `/api/livraisons` |
| Entretiens | `entretienRoutes.js` | `/api/entretiens` |
| Synchronisation | `sync.js` | `/api/sync` |
| Santé | `health.js` | `/api/health` |
| Sécurité | `security.js` | `/api/security` |
| RBAC | `rbac.js` | `/api/rbac` |

## Actions Futures Recommandées

1. **Vérifier les références frontend** aux routes supprimées (notamment `/api/admin/users`)
2. **Consolider les routes similaires** (ex: events/evenements)
3. **Documenter chaque endpoint** avec Swagger/OpenAPI
4. **Ajouter des tests** pour vérifier que toutes les routes sont accessibles