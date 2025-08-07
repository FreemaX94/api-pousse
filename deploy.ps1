Write-Host "Copie du build existant dans backend/public..."
if (Test-Path backend\public) {
    Remove-Item -Recurse -Force backend\public
}
New-Item -ItemType Directory -Path backend\public

# Copier le dernier build disponible
if (Test-Path frontend\dist) {
    Copy-Item -Recurse -Path frontend\dist\* -Destination backend\public\
    Write-Host "Build existant copie avec succes."
} else {
    Write-Host "Aucun build trouve dans frontend/dist"
    Write-Host "Vous devez d'abord faire le build manuellement avec: cd frontend && npm run build"
    exit 1
}

Set-Location backend
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "Git add + commit + push"
git add .
git commit -m "🚀 Déploiement auto : frontend + backend"
git push

Write-Host "Termine. DigitalOcean va redployer automatiquement."
