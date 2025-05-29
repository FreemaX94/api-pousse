# deploy.ps1

Write-Host "🚧 Build du frontend React..."

# Aller dans frontend
Set-Location -Path "./frontend"

# Lancer le build
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Échec du build frontend."
    exit
}

# Revenir à la racine
Set-Location -Path ".."

Write-Host "📁 Copie du build dans backend/public..."

# Supprimer l’ancien dossier public
$publicPath = "backend/public"
if (Test-Path $publicPath) {
    Remove-Item -Recurse -Force $publicPath
}

# Créer le dossier
New-Item -ItemType Directory -Path $publicPath

# Copier le build
Copy-Item -Recurse -Force "frontend/dist/*" $publicPath

Write-Host "✅ Build copié avec succès."

# Aller dans backend
Set-Location -Path "./backend"

Write-Host "📁 Git add + commit + push"

# Vérifie si le dossier est un dépôt Git
if (-not (Test-Path ".git")) {
    Write-Host "🌀 Dépôt Git non initialisé. Initialisation automatique..."
    git init
    git remote add origin https://github.com/FreemaX94/api-pousse
    git branch -M main
}

git add .
git commit -m "🚀 Déploiement auto : frontend + backend"
git push -u origin main

Write-Host "🎉 Terminé. DigitalOcean va redéployer automatiquement."

taskkill /F /IM node.exe
