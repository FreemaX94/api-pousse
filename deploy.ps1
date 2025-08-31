# Script de deploiement PowerShell avec sauvegarde des images

# Verifier qu'on est dans le bon repertoire
if (-Not (Test-Path "frontend") -or -Not (Test-Path "backend")) {
    Write-Host "ERREUR: Lancez ce script depuis la racine du projet" -ForegroundColor Red
    exit 1
}

Write-Host "Build du frontend React..." -ForegroundColor Yellow
Set-Location frontend

# Nettoyer le cache et rebuilder
Write-Host "Nettoyage du cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
npm run build
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "Copie du build dans backend/public et backend/dist..." -ForegroundColor Yellow
Set-Location ..

# SAUVEGARDE DES IMAGES D'ARTICLES EXTERNES
if (Test-Path "backend\uploads") {
    Write-Host "Sauvegarde des images d'articles externes..." -ForegroundColor Green
    if (Test-Path "$env:TEMP\backup_uploads") {
        Remove-Item -Recurse -Force "$env:TEMP\backup_uploads" -ErrorAction SilentlyContinue
    }
    Copy-Item -Recurse backend\uploads "$env:TEMP\backup_uploads" -ErrorAction SilentlyContinue
}

# Vérifier que le build frontend existe
if (-Not (Test-Path "frontend\dist")) {
    Write-Host "ERREUR: Le build frontend n'existe pas" -ForegroundColor Red
    exit 1
}

# Supprimer les anciens builds (mais pas le dossier uploads)
Remove-Item -Recurse -Force backend\public\* -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force backend\dist\* -ErrorAction SilentlyContinue

# Copier le nouveau build
Copy-Item -Recurse frontend\dist\* backend\public\
Copy-Item -Recurse frontend\dist\* backend\dist\

# RESTAURATION DES IMAGES D'ARTICLES EXTERNES
if (Test-Path "$env:TEMP\backup_uploads") {
    Write-Host "Restauration des images d'articles externes..." -ForegroundColor Green
    # Supprimer le dossier uploads actuel et restaurer depuis la sauvegarde
    Remove-Item -Recurse -Force backend\uploads -ErrorAction SilentlyContinue
    Copy-Item -Recurse "$env:TEMP\backup_uploads" backend\uploads -Force
    Remove-Item -Recurse -Force "$env:TEMP\backup_uploads" -ErrorAction SilentlyContinue
    Write-Host "Images restaurees avec succes" -ForegroundColor Green
}

Write-Host "Build copie avec succes." -ForegroundColor Green

# Verifier s'il y a des changements
$changes = git status --porcelain
if ($changes) {
    Write-Host "Git add + commit + push..." -ForegroundColor Yellow
    git add .
    $date = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    git commit -m "Deploiement auto : frontend + backend - $date"
    git push
    Write-Host "Termine. DigitalOcean va redeployer automatiquement." -ForegroundColor Green
} else {
    Write-Host "Aucun changement detecte, pas de commit necessaire." -ForegroundColor Blue
}

Write-Host "Pour eviter le cache navigateur, utilisez Ctrl+Shift+R ou Ctrl+F5" -ForegroundColor Cyan
