# Problèmes à Corriger Suite au Nettoyage des Routes

**Date:** 27 Juillet 2025  
**Mise à jour:** 27 Juillet 2025

## 1. ✅ RÉSOLU - Route Manquante : `/api/admin/users`

### Problème (RÉSOLU)
Le composant `AdminPage.jsx` (présent dans 2 endroits) faisait un appel à `/api/admin/users` qui n'existait plus après la suppression de `adminRoutes.js`.

### Solution Appliquée
1. **Ajout de la fonction `getAllUsers`** dans `backend/controllers/authController.js`
   - Récupère tous les utilisateurs sans les champs sensibles
   - Ajoute un log pour tracer les accès admin
   - Retourne un objet `{ success, count, users }`

2. **Ajout de la route** dans `backend/routes/authRoutes.js`
   ```javascript
   router.get('/users', authMiddleware('admin'), getAllUsers);
   ```

3. **Mise à jour du frontend** :
   - `frontend/src/pages/AdminPage.jsx` : `/api/admin/users` → `/api/auth/users`
   - `frontend/src/shared/components/AdminPage.jsx` : idem
   - Gestion du format de réponse : `data.users || data`

## 2. ✅ RÉSOLU - Double Middleware dans invoices.js

### Problème (RÉSOLU)
Le fichier `invoices.js` avait un double middleware d'authentification :
- Ligne 16 : `router.use(authMiddleware('admin'))` - middleware global pour toutes les routes
- Lignes 21 et 29 : `authMiddleware()` - redondant sur chaque route individuelle

### Solution Appliquée
Suppression des middlewares redondants aux lignes 21 et 29. Le middleware global à la ligne 16 suffit pour protéger toutes les routes du routeur avec le rôle admin.

### Vérification Effectuée
J'ai vérifié les autres fichiers de routes et n'ai pas trouvé d'autres cas de double middleware.

## 3. Routes Similaires à Consolider

### Événements
- `/api/events` (eventsRoutes.js) 
- `/api/evenements` (evenements.js)

Ces deux routes semblent faire la même chose. Il faudrait :
1. Vérifier leur utilisation respective
2. Consolider en une seule route
3. Mettre à jour les références

## 3. Documentation Manquante

Les endpoints suivants n'ont pas de documentation claire :
- `/api/rbac` - Gestion des rôles et permissions
- `/api/security` - Fonctionnalités de sécurité
- `/api/sync` - Synchronisation de données

## Actions Prioritaires

1. **Corriger la route admin manquante** (URGENT)
2. **Vérifier que tous les tests passent**
3. **Documenter les routes actives avec Swagger**
4. **Créer des tests d'intégration pour vérifier les routes**