@echo off
echo 🔧 Script de réparation des dépendances API-Pousse
echo ================================================

echo.
echo 📊 Diagnostic initial...
if exist node_modules (
    echo ❌ node_modules racine détecté (potentiellement corrompu)
) else (
    echo ✅ Pas de node_modules racine
)

if exist backend\node_modules (
    echo ❌ backend\node_modules détecté (potentiellement corrompu)
) else (
    echo ✅ Pas de backend\node_modules
)

if exist frontend\node_modules (
    echo ❌ frontend\node_modules détecté (potentiellement corrompu)
) else (
    echo ✅ Pas de frontend\node_modules
)

echo.
echo 🧹 Nettoyage complet...

echo Suppression node_modules racine...
if exist node_modules rmdir /s /q node_modules 2>nul

echo Suppression backend\node_modules...
if exist backend\node_modules rmdir /s /q backend\node_modules 2>nul

echo Suppression frontend\node_modules...
if exist frontend\node_modules rmdir /s /q frontend\node_modules 2>nul

echo Suppression package-lock.json...
if exist package-lock.json del package-lock.json 2>nul
if exist backend\package-lock.json del backend\package-lock.json 2>nul
if exist frontend\package-lock.json del frontend\package-lock.json 2>nul

echo.
echo 🧼 Nettoyage cache npm...
npm cache clean --force

echo.
echo 📦 Réinstallation des dépendances backend...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ❌ Erreur installation backend
    pause
    exit /b 1
)

echo.
echo ✅ Installation backend réussie !
echo.
echo 🚀 Test de démarrage du backend...
echo Appuyez sur Ctrl+C pour arrêter le serveur une fois qu'il démarre
node --enable-source-maps index.js

echo.
echo 📋 Instructions pour continuer :
echo 1. Si le serveur a démarré correctement, arrêtez-le avec Ctrl+C
echo 2. Pour le frontend, exécutez : cd frontend ^&^& npm install ^&^& npm run dev
echo 3. Le backend sera sur http://localhost:3001
echo 4. Le frontend sera sur http://localhost:3000

pause