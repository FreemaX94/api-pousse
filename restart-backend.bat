@echo off
echo Arrêt du serveur backend...
taskkill /F /IM node.exe 2>nul
timeout /t 3 /nobreak >nul
echo Démarrage du serveur backend...
cd "C:\Users\FreemaX94\Desktop\api-pousse - Copie (2) - Copie - Copie - Copie - Copie\backend"
start /B node index.js
echo Serveur backend redémarré !
pause