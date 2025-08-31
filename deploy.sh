#!/bin/bash

# Vérifier qu'on est dans le bon répertoire
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Erreur: Lancez ce script depuis la racine du projet"
    exit 1
fi

echo "🚧 Build du frontend React..."
cd frontend || exit

# Nettoyer le cache et rebuilder
echo "🧹 Nettoyage du cache..."
rm -rf node_modules/.cache
rm -rf dist
npm run build || exit

echo "📦 Copie du build dans backend/public et backend/dist..."
cd .. || exit

# Sauvegarder les images d'articles externes si le dossier existe
if [ -d "backend/uploads" ]; then
    echo "💾 Sauvegarde des images d'articles externes..."
    cp -r backend/uploads /tmp/backup_uploads 2>/dev/null || echo "ℹ️ Aucune image à sauvegarder"
fi

# Supprimer les anciens builds (mais pas le dossier uploads)
rm -rf backend/public/*
rm -rf backend/dist/*

# Copier le nouveau build
cp -r frontend/dist/* backend/public/
cp -r frontend/dist/* backend/dist/

# Restaurer les images d'articles externes si elles avaient été sauvegardées
if [ -d "/tmp/backup_uploads" ]; then
    echo "♻️ Restauration des images d'articles externes..."
    cp -r /tmp/backup_uploads backend/uploads
    rm -rf /tmp/backup_uploads
    echo "✅ Images restaurées"
fi

echo "✅ Build copié avec succès."

# Vérifier s'il y a des changements
if [ -n "$(git status --porcelain)" ]; then
    echo "📁 Git add + commit + push"
    git add .
    git commit -m "🚀 Déploiement auto : frontend + backend - $(date '+%Y-%m-%d %H:%M:%S')"
    git push
    echo "🎉 Terminé. DigitalOcean va redéployer automatiquement."
else
    echo "ℹ️  Aucun changement détecté, pas de commit nécessaire."
fi

echo "🔄 Pour éviter le cache navigateur, utilisez Ctrl+Shift+R ou Ctrl+F5"
