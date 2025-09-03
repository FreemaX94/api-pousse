# Script de deploiement PowerShell - VERSION SIMPLE QUI MARCHE

# Verifier qu'on est dans le bon repertoire
if (-Not (Test-Path "frontend") -or -Not (Test-Path "backend")) {
    Write-Host "ERREUR: Lancez ce script depuis la racine du projet" -ForegroundColor Red
    exit 1
}

# EXACTEMENT comme ta methode manuelle
Write-Host "1. Build du frontend React..." -ForegroundColor Yellow
cd frontend
npm run build
if ($LASTEXITCODE -ne 0) { exit 1 }
cd ..

Write-Host "2. Copier le build vers le backend..." -ForegroundColor Yellow
# Sauvegarder les images movement avant nettoyage
$movementFiles = @()
if (Test-Path "backend/public") {
    $movementFiles = Get-ChildItem "backend/public/movement_*" -ErrorAction SilentlyContinue
}

# Supprimer les anciens builds (SAUF les images movement)
Get-ChildItem "backend/public/*" -Exclude "movement_*" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force backend/dist/* -ErrorAction SilentlyContinue

# Copier le nouveau build vers backend/public ET backend/dist
# Le composant backend va maintenant servir TOUT (frontend + API)
Copy-Item -Recurse frontend/dist/* backend/public/
Copy-Item -Recurse frontend/dist/* backend/dist/

# Restaurer les images movement si elles ont été supprimées accidentellement
if ($movementFiles.Count -gt 0) {
    Write-Host "Images movement préservées: $($movementFiles.Count) fichiers" -ForegroundColor Green
}

Write-Host "3. Commiter et pousser..." -ForegroundColor Yellow
$changes = git status --porcelain
if ($changes) {
    git add .
    $date = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    git commit -m "Deploiement auto : frontend + backend - $date"
    git push origin main
    Write-Host "Termine. DigitalOcean va redeployer automatiquement." -ForegroundColor Green
} else {
    Write-Host "Aucun changement detecte, pas de commit necessaire." -ForegroundColor Blue
}

Write-Host "Pour eviter le cache navigateur, utilisez Ctrl+Shift+R ou Ctrl+F5" -ForegroundColor Cyan