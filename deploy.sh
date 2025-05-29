#!/bin/bash

echo "🚧 Build du frontend React..."
cd frontend || exit
npm run build || exit

echo "📦 Copie du build dans backend/public..."
rm -rf ../backend/public
mkdir ../backend/public
cp -r dist/* ../backend/public/

echo "✅ Build copié avec succès."

cd ../backend || exit

echo "📁 Git add + commit + push"
git add .
git commit -m "🚀 Déploiement auto : frontend + backend"
git push

echo "🎉 Terminé. DigitalOcean va redéployer automatiquement."
