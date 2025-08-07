#!/bin/bash

echo "🚀 Script de build DigitalOcean - Construction frontend + backend"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Changement vers le répertoire racine."
    cd /workspace
fi

echo "📁 Répertoire de travail: $(pwd)"
echo "📁 Contenu du répertoire:"
ls -la

# Aller vers le frontend et construire
echo "🔨 Construction du frontend React..."
cd frontend
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: frontend/package.json non trouvé"
    exit 1
fi

echo "📦 Installation des dépendances frontend..."
npm install

echo "🏗️ Build du frontend..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Erreur: Build frontend échoué - dist/ non créé"
    exit 1
fi

echo "✅ Frontend build avec succès"

# Copier le build vers le backend
echo "📋 Copie des fichiers frontend vers backend..."
cd ..
mkdir -p backend/public backend/dist

# Copier vers public et dist (fallback)
cp -r frontend/dist/* backend/public/
cp -r frontend/dist/* backend/dist/

echo "✅ Fichiers copiés vers backend/public et backend/dist"

# Vérifier que index.html existe
if [ ! -f "backend/public/index.html" ]; then
    echo "❌ Erreur: index.html non trouvé dans backend/public"
    exit 1
fi

echo "✅ index.html trouvé: backend/public/index.html"

# Installation des dépendances backend (si nécessaire)
echo "📦 Installation des dépendances backend..."
cd backend
npm install

echo "🎉 Build terminé avec succès!"
echo "📄 Structure finale:"
ls -la public/