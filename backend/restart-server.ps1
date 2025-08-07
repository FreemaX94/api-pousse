# Script pour redémarrer le serveur backend
Write-Host "🔄 Arrêt des processus Node.js utilisant le port 3001..." -ForegroundColor Yellow

# Tuer tous les processus node.exe qui utilisent le port 3001
try {
    Stop-Process -Id 3700 -Force -ErrorAction SilentlyContinue
    Stop-Process -Id 6728 -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Processus arrêtés" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Certains processus étaient déjà arrêtés" -ForegroundColor Yellow
}

# Attendre que les ports se libèrent
Start-Sleep -Seconds 3

# Vérifier que le port est libre
$portCheck = netstat -ano | findstr :3001
if ($portCheck) {
    Write-Host "⚠️ Le port 3001 est encore occupé, forçage..." -ForegroundColor Yellow
    # Forcer l'arrêt de tous les processus node.exe
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 2
}

Write-Host "🚀 Démarrage du serveur..." -ForegroundColor Green
# Redémarrer le serveur
cd "C:\Users\FreemaX94\Desktop\api-pousse - Copie (2) - Copie - Copie - Copie - Copie\backend"
node index.js