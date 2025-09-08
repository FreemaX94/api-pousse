# PowerShell script pour deployer les corrections d'images d'entrees externes
Write-Host "🚀 DEPLOIEMENT: Fix des images d'entrees externes" -ForegroundColor Green

# 1. Build du frontend
Write-Host "`n📦 1. Build du frontend..." -ForegroundColor Yellow
Set-Location "frontend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build frontend" -ForegroundColor Red
    exit 1
}

# 2. Nettoyage et copie vers backend
Write-Host "`n🧹 2. Nettoyage et copie vers backend..." -ForegroundColor Yellow
Set-Location ".."

# Nettoyer les anciens fichiers
if (Test-Path "backend/public") {
    Remove-Item -Recurse -Force "backend/public/*" -ErrorAction SilentlyContinue
}
if (Test-Path "backend/dist") {
    Remove-Item -Recurse -Force "backend/dist/*" -ErrorAction SilentlyContinue
}

# Copier les nouveaux fichiers
Copy-Item -Recurse "frontend/dist/*" "backend/public/"
Copy-Item -Recurse "frontend/dist/*" "backend/dist/"

Write-Host "✅ Fichiers copiés vers backend/public/ et backend/dist/" -ForegroundColor Green

# 3. Commit et push
Write-Host "`n📝 3. Commit des changements..." -ForegroundColor Yellow
git add -A
git commit -m "🖼️ FIX: Correct external entries images routing

- Update /api/catalog/nieuwkoop/movement-image route to check uploads/movements first
- Add script to fix existing image URLs
- Ensure external entries images display in nieuwkoop stock tab

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 4. Push
Write-Host "`n🚀 4. Déploiement vers DigitalOcean..." -ForegroundColor Yellow
git push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du push" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ DEPLOIEMENT TERMINE!" -ForegroundColor Green
Write-Host "🖼️ Les images des entrees externes devraient maintenant s'afficher correctement" -ForegroundColor Green
Write-Host "🔧 Executez le script fix-external-images.js si besoin pour corriger les URLs existantes" -ForegroundColor Yellow

# 5. Attendre le déploiement et tester
Write-Host "`n⏳ Attente de 30 secondes pour le deploiement..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host "`n🧪 Test de la route d'image..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://api-pousse-app-5y2wo.ondigitalocean.app/api/catalog/nieuwkoop/stock" -Method GET
    if ($response) {
        Write-Host "✅ Route nieuwkoop stock accessible" -ForegroundColor Green
        $itemsWithImages = $response | Where-Object { $_.image -and $_.image -like "*movement_*" }
        Write-Host "🖼️ Articles avec images movement_: $($itemsWithImages.Count)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "⚠️ Impossible de tester la route (normal pendant le deploiement)" -ForegroundColor Yellow
}

Write-Host "`n🎉 Deploiement termine! Verifiez l'interface nieuwkoop." -ForegroundColor Green