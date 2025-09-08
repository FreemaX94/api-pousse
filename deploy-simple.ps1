# Script de déploiement des corrections d'images

Write-Host "Deploiement des corrections d'images" -ForegroundColor Green

# Arreter les processus existants
taskkill /F /IM node.exe 2>$null
taskkill /F /IM nodemon.exe 2>$null

# Créer le dossier uploads/movements
New-Item -ItemType Directory -Force -Path "backend\uploads\movements"

# Copier les images
Copy-Item -Path "backend\public\movement_*.*" -Destination "backend\uploads\movements\" -Force -ErrorAction SilentlyContinue
Copy-Item -Path "backend\assets\movement_*.*" -Destination "backend\uploads\movements\" -Force -ErrorAction SilentlyContinue

Write-Host "Images copiees vers uploads/movements" -ForegroundColor Green

# Compter les fichiers
$files = Get-ChildItem -Path "backend\uploads\movements\movement_*" -ErrorAction SilentlyContinue
Write-Host "Total: $($files.Count) fichiers movement" -ForegroundColor Green

Write-Host "Deploiement termine. Redemarrez le serveur pour appliquer les changements." -ForegroundColor Cyan