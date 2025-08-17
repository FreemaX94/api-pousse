@echo off
echo ================================================
echo   TEST DES SOUS-ONGLETS DU COMPOSANT RAPPELS
echo ================================================
echo.

set BASE_URL=http://localhost:3003

echo Frontend detecte sur le port 3003
echo.

echo ========================================
echo 1. TEST ACCES PAGE PRINCIPALE
echo ========================================

echo Testing OrganipoussV2...
curl -s -o nul -w "OrganipoussV2: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/organipouss-v2"

echo Testing Rappels Ultra Premium...
curl -s -o nul -w "Rappels Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/rappels-ultra-premium"

echo.
echo ========================================
echo 2. TEST DES SOUS-ONGLETS (SIMULATION)
echo ========================================
echo.
echo Les sous-onglets sont geres cote client (React).
echo Test de chargement avec parametres d'URL:
echo.

echo Testing Onglet "Tous"...
curl -s -o nul -w "Onglet Tous: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/rappels-ultra-premium?tab=Tous"

echo Testing Onglet "Devis"...
curl -s -o nul -w "Onglet Devis: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/rappels-ultra-premium?tab=Devis"

echo Testing Onglet "Factures"...
curl -s -o nul -w "Onglet Factures: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/rappels-ultra-premium?tab=Factures"

echo Testing Onglet "Interventions"...
curl -s -o nul -w "Onglet Interventions: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/rappels-ultra-premium?tab=Interventions"

echo Testing Onglet "Envoi documents"...
curl -s -o nul -w "Onglet Envoi documents: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/rappels-ultra-premium?tab=Envoi%%20documents"

echo Testing Onglet "Demandes client"...
curl -s -o nul -w "Onglet Demandes client: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/rappels-ultra-premium?tab=Demandes%%20client"

echo Testing Onglet "Affaires"...
curl -s -o nul -w "Onglet Affaires: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/rappels-ultra-premium?tab=Affaires"

echo Testing Onglet "Contrats"...
curl -s -o nul -w "Onglet Contrats: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/rappels-ultra-premium?tab=Contrats"

echo Testing Onglet "Produits/services"...
curl -s -o nul -w "Onglet Produits/services: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/rappels-ultra-premium?tab=Produits%%2Fservices"

echo Testing Onglet "Pointages"...
curl -s -o nul -w "Onglet Pointages: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/rappels-ultra-premium?tab=Pointages"

echo.
echo ========================================
echo 3. VERIFICATION DU CONTENU
echo ========================================
echo.

echo Verification presence des donnees pour l'onglet "Tous"...
curl -s "%BASE_URL%/dashboard/rappels-ultra-premium" | findstr /i "rappel client montant" > nul
if %errorlevel% equ 0 (
    echo [OK] Donnees trouvees pour "Tous"
) else (
    echo [INFO] Pas de donnees specifiques trouvees
)

echo.
echo ========================================
echo 4. TEST NAVIGATION DIRECTE
echo ========================================
echo.

echo Pour un test complet avec interaction:
echo 1. Ouvrez votre navigateur
echo 2. Allez sur %BASE_URL%/dashboard/organipouss-v2
echo 3. Connectez-vous si necessaire
echo 4. Cliquez sur "Rappels" dans le menu
echo 5. Testez chaque sous-onglet manuellement
echo.
echo Ou ouvrez le fichier test-rappels.html dans votre navigateur
echo.

echo ================================================
echo RESULTATS:
echo   200 = Page charge correctement
echo   Les sous-onglets sont geres dynamiquement
echo   par React et necessite un test manuel
echo   ou avec des outils comme Playwright/Puppeteer
echo ================================================
pause