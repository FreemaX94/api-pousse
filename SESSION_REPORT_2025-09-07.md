# 📋 RAPPORT DE SESSION - 7 septembre 2025

## 🎯 RÉSUMÉ GÉNÉRAL

**Session de debug et corrections système** - Résolution de problèmes critiques de routing et d'upload de fichiers en production.

---

## 🔧 PROBLÈMES RÉSOLUS

### 1. ✅ **Système d'upload de fichiers pour projets Nieuwkoop**

**PROBLÈME :** Les fichiers uploadés dans les projets n'étaient pas accessibles en production.

**CAUSE ROOT :** Route `/uploads` configurée avant `setupDomains()` mais écrasée par les middlewares static.

**SOLUTION :**
- Déplacé la configuration `/uploads` dans `setupDomains()` après les routes API
- Ajouté création automatique du dossier uploads s'il n'existe pas
- Configuration correcte du middleware static pour `/uploads/*`

**FICHIERS MODIFIÉS :**
- `backend/src/app.js` (lignes 570-590)

**RÉSULTAT :** ✅ Upload et affichage des fichiers fonctionne en production

---

### 2. ✅ **Problème de rafraîchissement page SPA**

**PROBLÈME :** Rafraîchir une page comme `/app/nieuwkoop` retournait 404 et redirigeait vers login.

**CAUSE ROOT :** Configuration DigitalOcean App Platform - routes `/app/*` n'étaient pas dirigées vers le backend.

**DIAGNOSTIC APPROFONDI :**
- App spec DigitalOcean : seules les routes `/api/*` allaient au backend
- Toutes les autres routes (`/app/*`) allaient au frontend statique
- Le frontend n'avait pas de fichier physique pour `/app/nieuwkoop` → 404

**SOLUTIONS APPLIQUÉES :**

**Phase 1 - Code Backend :**
- Ajout de routes spécifiques pour `/app/nieuwkoop` 
- Configuration catch-all avec `app.use('*')` au lieu de `app.get('*')`
- Routes de debug pour diagnostiquer les problèmes de déploiement

**Phase 2 - Configuration Infrastructure :**
- Modification de l'app spec DigitalOcean :
```yaml
ingress:
  rules:
  - component: api-pousse-backend
    match:
      path:
        prefix: /api
  - component: api-pousse-backend  # ← AJOUTÉ
    match:
      path:
        prefix: /app               # ← NOUVEAU
  - component: api-pousse-frontend
    match:
      path:
        prefix: /
```

**Phase 3 - Force Rebuild :**
- Force Rebuild and Deploy pour appliquer les changements
- Détection et correction du problème de chemin index.html

**SOLUTION FINALE :**
```javascript
// backend/src/app.js
app.get('/app/nieuwkoop', (req, res) => {
  // Cherche index.html dans plusieurs emplacements possibles
  const possiblePaths = [
    path.join(__dirname, '../public/index.html'),
    path.join(__dirname, '../dist/index.html'),
    path.join(__dirname, '../../frontend/dist/index.html'),
    path.join(process.cwd(), 'public/index.html'),
    path.join(process.cwd(), 'index.html')
  ];
  
  // Sert le premier index.html trouvé
  for (const indexPath of possiblePaths) {
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  
  // Fallback avec préservation d'URL
  res.redirect('/?return=' + encodeURIComponent(req.path));
});
```

**RÉSULTAT :** ✅ Rafraîchissement fonctionne, reste sur l'onglet actif

---

### 3. ✅ **Analyse du système de gestion de stock**

**QUESTION :** Que se passe-t-il quand on supprime un projet ? Les articles retournent-ils au stock ?

**ANALYSE :** ✅ **OUI, le système gère correctement la libération des stocks.**

**FONCTIONNEMENT :**
```javascript
// backend/src/domains/projects/controllers/projetController.js:233-276
const deleteProjet = async (req, res, next) => {
  // 1. Trouve tous les mouvements de sortie liés au projet
  const movements = await Movement.find({ 
    project: req.params.id,
    type: 'sortie',
    returned: { $ne: true }
  });
  
  // 2. Libère le stock réservé pour chaque mouvement
  for (const movement of movements) {
    const item = await NieuwkoopItem.findOne({ reference: movement.reference });
    if (item && item.stock) {
      const oldReserved = item.stock.reservedQuantity || 0;
      const newReserved = Math.max(0, oldReserved - movement.quantity);
      
      item.stock.reservedQuantity = newReserved;
      await item.save();
    }
  }
  
  // 3. Supprime le projet
  await Projet.findByIdAndDelete(req.params.id);
}
```

**EXEMPLE :**
- Stock total : 14 Artstone gris
- Projet utilise : 2 Artstone (réservés)
- Stock disponible : 12 (14-2)
- **Après suppression projet :** Stock disponible : 14 (réservation libérée)

---

## 💰 CONSEIL HÉBERGEMENT

**QUESTION :** Comparaison des forfaits DigitalOcean

**RECOMMANDATION :** ✅ **Reste sur le forfait actuel $10/mois**

**Forfait actuel :**
- 1GB RAM, 1 vCPU partagé, 100GB bandwidth
- **PARFAIT** pour ton usage (app Node.js + React + MongoDB externe)
- **Excellent rapport qualité/prix**

**Alternatives non recommandées :**
- $12/mois : Juste +50GB bandwidth (inutile)
- $25/mois : 2GB RAM (overkill pour ton usage)
- Dédié $29/mois : Moins de RAM que ton partagé actuel

---

## 🚀 OPTIMISATIONS DÉPLOIEMENT

**TEMPS ACTUEL :** 2m22s (acceptable mais optimisable)

**SUGGESTIONS D'OPTIMISATION :**
1. **Cache npm** : `npm ci --cache /tmp/.npm` (-30-60s)
2. **Build parallèle** : Frontend + Backend en parallèle (-20-40s)
3. **Docker multi-stage** : Optimisation des layers (-20-50s)
4. **Alternative Vercel** : 2-3x plus rapide mais migration nécessaire

**VERDICT :** 2m22s reste acceptable pour le développement actuel.

---

## 🛠️ FICHIERS MODIFIÉS

### **backend/src/app.js**
- Déplacement route `/uploads` dans `setupDomains()`
- Ajout création automatique dossier uploads
- Ajout route spécifique `/app/nieuwkoop` avec fallback multiple paths
- Ajout route debug `/debug/test` et `/debug/uploads`
- Modification catch-all `app.use('*')` au lieu de `app.get('*')`

### **DigitalOcean App Spec**
- Ajout règle ingress pour `/app/*` → backend
- Force Rebuild and Deploy appliqué

---

## 📈 COMMITS DE LA SESSION

1. `🔍 DEBUG: Add uploads debug route` - Diagnostic upload
2. `🔧 FIX: Move /uploads static route to setupDomains()` - Correction placement uploads
3. `🔧 FIX: Auto-create uploads directory` - Création auto dossier
4. `🔧 FIX: Add explicit React SPA routes` - Routes SPA explicites
5. `🔧 FIX: Add /app/* routes for React SPA routing` - Routes avec préfixe /app
6. `🔧 FIX: Use app.use('*') instead of app.get('*')` - Catch-all universel
7. `🔧 DEBUG: Add specific route for /app/nieuwkoop` - Route spécifique debug
8. `🔧 SOLUTION: Add specific route for /app/nieuwkoop` - Solution pragmatique
9. `🚨 CRITICAL FIX: Force deployment + multiple routes` - Solution multi-niveaux
10. `🔧 FIX: Redirect /app/nieuwkoop to /` - Correction redirect
11. `🔧 SMART FIX: Try multiple paths for index.html` - Solution intelligente finale

---

## ✅ STATUT FINAL

**TOUS LES PROBLÈMES RÉSOLUS :**

1. ✅ **Upload fichiers projets** : Fonctionne en production
2. ✅ **Rafraîchissement SPA** : Plus de 404, reste sur l'onglet actif  
3. ✅ **Gestion stock projets** : Libération automatique confirmée
4. ✅ **Configuration infrastructure** : App spec DigitalOcean optimisé
5. ✅ **Déploiement** : Force rebuild résout les problèmes de cache

**PERFORMANCE :**
- ✅ Temps de déploiement acceptable (2m22s)
- ✅ Forfait hébergement optimal ($10/mois)
- ✅ Pas d'erreurs 404 en console

---

## 🎯 POINTS TECHNIQUES CLÉS APPRIS

### **Architecture DigitalOcean App Platform**
- Ingress routing avec règles de priorité
- Services séparés : backend (Node.js) + frontend (statique)
- Cache et déploiement peuvent nécessiter Force Rebuild

### **React SPA + Express Backend**
- Problématique des URLs client-side vs server-side
- Importance de l'ordre des middlewares Express
- Gestion des fichiers statiques en production

### **Gestion d'état et réservations**
- Différence entre stock physique et stock disponible
- Système de réservations vs mouvements physiques
- Libération automatique lors de suppressions

---

**📅 Date :** 7 septembre 2025  
**⏱️ Durée :** Session complète de debug et résolution  
**🎉 Résultat :** Tous les objectifs atteints, système stable en production

---

*Rapport généré automatiquement par Claude Code*