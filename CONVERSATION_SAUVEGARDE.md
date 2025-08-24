# Conversation Complète - Développement API Pousse

## Contexte
**Date :** Août 2023  
**Projet :** api-pousse - Application de gestion des stocks événementiels  
**Entreprise :** Pousse (Paysagisme & Événementiel)  
**Développeur :** FreemaX94 - Chargé d'entretien devenu développeur full-stack  

---

## Résumé du Projet

### L'Application api-pousse
- **Frontend :** React + Vite + Tailwind CSS
- **Backend :** Node.js + Express + MongoDB
- **Fonctionnalités :** Gestion complète des stocks pour événements

### Problématiques Résolues
1. **Images d'articles externes** → Système d'upload et affichage corrigé
2. **Gestion différenciée des sorties** → Définitive vs Locative
3. **Rate limiting excessif** → Optimisé pour équipes multiples
4. **Historique des projets** → Bouton avec affichage complet
5. **Stock management** → Logique réservation/décrémentation corrigée

---

## Développements Techniques Majeurs

### 1. Correction Système d'Images (Session 1)
**Problème :** Articles créés via "Entrée externe" sans images
**Solution :**
- Correction path multer : `../../../../../public/movements` → `../../../../public/movements`
- Amélioration sanitisation noms fichiers (caractères spéciaux)
- Configuration proxy Vite pour `/movements/`
- URLs relatives au lieu d'absolues

```javascript
// Multer configuration corrigée
filename: (req, file, cb) => {
  const ext = path.extname(file.originalname);
  const name = path.basename(file.originalname, ext)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\-_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  const timestamp = Date.now();
  cb(null, `movement_${name}_${timestamp}${ext}`);
}
```

### 2. Gestion Projets - Terminer/Supprimer (Session 2)
**Problème :** Actions projet ne géraient pas les stocks réservés
**Solutions :**
- Fonction `completeProjet` → Finalise sorties, libère réservations
- Fonction `deleteProjet` corrigée → Libère stocks réservés
- Route `/projets/:id/complete` ajoutée
- Frontend `completeProject()` implémenté

```javascript
// Logique de finalisation projet
for (const movement of movements) {
  const item = await NieuwkoopItem.findOne({ reference: movement.reference });
  if (item && item.stock) {
    // Libérer réservations + diminuer stock total (sortie définitive)
    const newReserved = Math.max(0, oldReserved - movement.quantity);
    const newTotal = Math.max(0, oldTotal - movement.quantity);
    
    item.stock.reservedQuantity = newReserved;
    item.stock.quantity = newTotal;
    await item.save();
  }
}
```

### 3. Bouton Historique Projets (Session 3)
**Fonctionnalité :** Afficher tous les projets créés (pas seulement actifs)
**Implémentation :**
- État `showHistory` dans Nieuwkoop.jsx
- Bouton toggle avec animations
- Filtrage conditionnel des projets
- Interface adaptative selon le mode

```jsx
// Logique d'affichage
<ProjetList 
  projects={showHistory ? projects : projects.filter(p => 
    p.status !== 'completed' && p.status !== 'archived'
  )} 
  onUpdate={handleUpdateProject} 
  onDelete={handleDeleteProject} 
  showHistory={showHistory}
/>
```

### 4. Correction Logique Stock Définitive/Locative (Session 3)
**Problème Critique :** Sorties définitives réservaient au lieu de décrémenter
**Solution :**

```javascript
// Gestion différenciée selon sous-type
if (subType === 'locative') {
  // Sortie locative : réserver le stock (les plantes reviendront)
  item.stock.reservedQuantity = stockReserve + parsedQuantity;
} else {
  // Sortie définitive : décrémenter définitivement le stock total
  item.stock.quantity = stockTotal - parsedQuantity;
}
```

### 5. Optimisation Rate Limiting (Session 3)
**Problème :** "Trop de requêtes" constant sur site web
**Cause :** 100 req/15min pour toute l'équipe sur même IP
**Solution :**

```javascript
// Rate limiting par utilisateur au lieu d'IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // 5000 requêtes par utilisateur
  keyGenerator: (req) => {
    if (req.user && req.user.id) {
      return `user:${req.user.id}`; // Par utilisateur connecté
    }
    return `ip:${req.ip}`; // Par IP pour non-connectés
  },
  skip: (req) => process.env.NODE_ENV === 'development'
});
```

**Limites augmentées :**
- API générale : 1000 → 5000 req/15min
- Nieuwkoop : 100 → 500 req/min
- Recherches : 200 → 1000 req/min
- Uploads : 20 → 100 req/min

---

## Architecture Technique

### Stack Technologique
```
Frontend:
├── React 18 + Vite
├── Tailwind CSS + Framer Motion
├── Lazy loading + Code splitting
└── API calls avec Axios

Backend:
├── Node.js + Express
├── MongoDB + Mongoose
├── Rate limiting + Security middlewares
├── Multer pour uploads
├── Architecture DDD (Domain Driven Design)

Déploiement:
├── DigitalOcean App Platform
├── Auto-deployment sur git push
└── Frontend build → backend/public/
```

### Fonctionnalités Clés
1. **Gestion Stock :**
   - Entrées (internes/externes)
   - Sorties (définitives/locatives)
   - Réservations automatiques
   - Calculs disponibilité temps réel

2. **Gestion Projets :**
   - Création avec matériaux
   - Historique complet
   - Finalisation avec libération stocks
   - Cartes détaillées avec progression

3. **Catalogue Nieuwkoop :**
   - Intégration API fournisseur
   - Recherche avancée
   - Images et spécifications
   - Ajout automatique nouveaux articles

4. **Sécurité & Performance :**
   - Rate limiting intelligent
   - Sanitisation inputs
   - Helmet + CORS
   - Optimisations multi-utilisateurs

---

## Contexte Professionnel chez Pousse

### Structure Équipe Événementiel
- **Responsable de projet** (1)
- **Vendeurs événementiel** (2)  
- **Conductrice de travaux événementielle** (1) - *Censée gérer le stock*
- **Chargé d'entretien** (FreemaX94) - *Entretient + Développe la plateforme*

### Problématique Organisationnelle
- Conductrice de travaux désorganisée → Stock mal géré
- FreemaX94 prend l'initiative → Développe solution complète
- Management critique "manque de motivation" → Alors que création d'outils !
- Politique interne → Conductrice "protégée" malgré défaillances

### Activité Pousse (Recherche Web)
**Entreprise :** Pousse - Paysagisme & Événementiel
- **Fondée :** 2013 par Arthur Delrieu + Sarah Delaval (2017)
- **Équipe :** ~30 employés (paysagistes, jardiniers, architectes, scénographes)
- **Villes :** Paris, Lyon, Bordeaux
- **Clients événementiels :** TikTok, Spotify, Off-White, Sol de Janeiro, Bacardi, Saint-Laurent

**Services Événementiels :**
- Location plantes 1 jour à 1+ an
- Scénographie végétale sur-mesure
- Service "clé en main" : conception → installation → récupération
- Événements corporate, lancements marque, activations

---

## Citations Marquantes de la Conversation

### Sur le Développement
> "C'est exactement ce type d'activité événementielle que ton application `api-pousse` semble gérer non ? Avec la gestion de stock, les projets, les mouvements... Tu travailles dans une entreprise similaire ?"

### Sur la Situation Professionnelle
> **FreemaX94 :** "exactement je travaille dedans et plus particulierement dans la branche évenementielle"

> **FreemaX94 :** "mais clairement c'est une satisfaction inouie et tu ma enormément aider a créer tout ca la on s'en sert pas encore mais on est dans la phase de rentrer tout l'inventaire du depot"

### Sur les Difficultés Managériales
> **FreemaX94 :** "en plus il mon dis que j'avais un manque de motivation générale et baisse de ma qualité de travail générale alors qu'a aucun momement il mon demandé de faire ca c'est culotté je trouve"

> **Claude :** "créer une app complète de A à Z pour améliorer la gestion des stocks événementiels de Pousse, c'est tout sauf du 'manque de motivation'. C'est de l'initiative pure !"

### Sur l'Évolution Professionnelle
> **Claude :** "Tu passes de 'chargé d'entretien' à 'développeur full-stack avec expertise métier événementiel'"

> **Claude :** "Cette expérience + cette app = arguments béton pour ton prochain poste"

---

## Évolution des Compétences

### Avant le Projet
- Chargé d'entretien des plantes
- Préparation des commandes
- Participation aux événements

### Après le Projet  
- **Full-Stack Developer :**
  - Frontend React avancé
  - Backend Node.js + Express
  - Base de données MongoDB
  - Architecture logicielle (DDD)
  
- **DevOps & Déploiement :**
  - Git workflow professionnel
  - Déploiement automatique
  - Configuration serveurs
  
- **Analyse Métier :**
  - Gestion des stocks événementiels
  - Workflow optimisation
  - UX/UI design

---

## Commits Principaux

### 1. Fix Images Externes
```
✅ FIX: Affichage complet des images d'articles externes
- 🔧 Correction path multer upload définitif  
- 📁 Résolution problème caractères spéciaux noms fichiers
- 🌐 Configuration proxy Vite pour /movements/
- 🎨 URLs relatives pour compatibilité dev/prod
```

### 2. Gestion Projets
```
🔧 AMÉLIORATION: Gestion stocks projets - Terminer/Supprimer
- ✨ Nouvelle fonction completeProjet pour finaliser projets
- 🔄 Correction deleteProjet libération stocks réservés
- 📡 Route PUT /projets/:id/complete ajoutée
- 🌐 Frontend: fonction completeProject ajoutée
```

### 3. Optimisation Finale
```
🚀 OPTIMISATION MAJEURE: Rate Limiting + Stock Management + Historique
✨ Nouvelles fonctionnalités:
- 📚 Bouton Historique projets avec affichage complet
- 🎯 Rate limiting intelligent par utilisateur (5000 req/15min)
- 🔄 Gestion différenciée sorties définitive/locative

🔧 Corrections critiques:
- 📦 Sortie définitive: décrémente stock total définitivement  
- 🔄 Sortie locative: réserve stock temporairement
- ⚡ Plus de blocage "Trop de requêtes" pour équipes
- 🎨 Interface projets enrichie (historique complet)

💼 Impact Pousse:
- Support multi-utilisateurs simultanés (10+ employés)
- Gestion stocks événementiels correcte
- Vision complète historique projets clients
```

---

## Conclusion

Ce projet représente une transformation complète :
- **Technique :** D'un simple chargé d'entretien à développeur full-stack
- **Organisationnelle :** Création d'outils pour pallier défaillances managériales  
- **Professionnelle :** Acquisition compétences transférables et portfolio solide

L'application `api-pousse` est maintenant une solution robuste, scalable, et adaptée aux besoins réels de l'équipe événementielle de Pousse.

**Malgré les difficultés politiques internes, cette expérience constitue un tremplin majeur pour l'évolution de carrière.**

---

*Sauvegarde créée le : Août 2023*  
*Dernière mise à jour : Après déploiement optimisations finales*