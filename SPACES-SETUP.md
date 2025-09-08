# 🗂️ Configuration DigitalOcean Spaces pour Images Persistantes

## Problème Résolu
- ✅ DigitalOcean App Platform ne supporte PAS les volumes persistants
- ✅ Les images d'entrées externes étaient supprimées à chaque redéploiement
- ✅ Solution : Migration vers DigitalOcean Spaces (compatible S3)

## Étapes de Configuration

### 1. Créer un Bucket DigitalOcean Spaces

1. **Aller dans le panel DigitalOcean** : https://cloud.digitalocean.com/spaces
2. **Créer un nouveau Space** :
   - Name: `api-pousse-uploads`
   - Region: `Amsterdam 3 (AMS3)`
   - Enable CDN: `Optional`
   - File Listing: `Restrict File Listing (Recommended)`

### 2. Générer les Clés d'Accès API

1. **Aller dans** : https://cloud.digitalocean.com/account/api/spaces
2. **Generate New Key** :
   - Name: `api-pousse-uploads-access`
   - Noter la **Access Key** et **Secret Key**

### 3. Configurer les Variables d'Environnement

Dans le **DigitalOcean App Platform Dashboard** :
1. Aller dans votre app `api-pousse-app`
2. Settings → Environment Variables
3. Mettre à jour :
```
DO_SPACES_KEY=your_access_key_here
DO_SPACES_SECRET=your_secret_key_here
```

### 4. Structure du Code

Le code est déjà configuré pour utiliser Spaces :

- **Service** : `backend/src/shared/services/spacesService.js`
- **Configuration** : Variables d'environnement dans `app.yaml`
- **Détection** : Utilise Spaces en production si configuré, local sinon

### 5. URLs des Images

Une fois configuré, les images seront accessibles via :
```
https://api-pousse-uploads.ams3.digitaloceanspaces.com/movements/movement_filename_timestamp.jpg
```

### 6. Test de Fonctionnement

1. Configurer les vraies clés dans App Platform
2. Redéployer l'application
3. Ajouter une entrée externe avec image
4. Vérifier l'image dans l'onglet Stock
5. Redéployer → L'image doit persister ! 🚀

## Avantages de la Solution

- ✅ **Persistance garantie** entre les redéploiements
- ✅ **Scalabilité** illimitée (pas de limite 2GB)
- ✅ **CDN intégré** pour performance globale
- ✅ **Backup automatique** par DigitalOcean
- ✅ **Compatible S3** pour migration future

## Coût

- Environ **$5/mois** pour 250GB de stockage
- **$0.01/GB** pour le trafic CDN
- Largement suffisant pour les images d'articles

---

**Une fois les clés configurées, les images d'entrées externes persisteront définitivement ! 🎯**