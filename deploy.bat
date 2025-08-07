@echo off
echo 🚧 Build du frontend React...
cd frontend
if errorlevel 1 exit /b 1

call npm run build
if errorlevel 1 exit /b 1

echo 📦 Copie du build dans backend/public...
if exist ..\backend\public (
    rmdir /s /q ..\backend\public
)
mkdir ..\backend\public
xcopy /e /i dist\* ..\backend\public\

echo ✅ Build copié avec succès.

cd ..\backend
if errorlevel 1 exit /b 1

echo 📁 Git add + commit + push
git add .
git commit -m "🚀 Déploiement auto : frontend + backend"
git push

echo 🎉 Terminé. DigitalOcean va redéployer automatiquement.