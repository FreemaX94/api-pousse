@echo off
echo ================================================
echo   TEST LOCAL DES COMPOSANTS ORGANIPOUSS V2
echo ================================================
echo.

set BASE_URL=http://localhost:3002

echo Frontend detecte sur le port 3002
echo.

echo ========================================
echo 1. SUIVI CLIENTS
echo ========================================

echo Testing Clients Premium...
curl -s -o nul -w "Clients Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/clients-premium"

echo Testing Clients Ultra Premium...
curl -s -o nul -w "Clients Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/clients-ultra-premium"

echo Testing Adresses Premium...
curl -s -o nul -w "Adresses Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/adresses-premium"

echo Testing Adresses Ultra Premium...
curl -s -o nul -w "Adresses Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/adresses-ultra-premium"

echo Testing Contrats Premium...
curl -s -o nul -w "Contrats Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/contrats-premium"

echo Testing Contrats Ultra Premium...
curl -s -o nul -w "Contrats Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/contrats-ultra-premium"

echo Testing Contacts Premium...
curl -s -o nul -w "Contacts Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/contacts-premium"

echo Testing Contacts Ultra Premium...
curl -s -o nul -w "Contacts Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/contacts-ultra-premium"

echo Testing Affaires Premium...
curl -s -o nul -w "Affaires Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/affaires-premium"

echo Testing Affaires Ultra Premium...
curl -s -o nul -w "Affaires Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/affaires-ultra-premium"

echo.
echo ========================================
echo 2. DEMANDES CLIENT
echo ========================================

echo Testing Demandes Client Premium...
curl -s -o nul -w "Demandes Client Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/demandes-client-premium"

echo Testing Demandes Client Ultra Premium...
curl -s -o nul -w "Demandes Client Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/demandes-client-ultra-premium"

echo Testing Demandes Client Stats Premium...
curl -s -o nul -w "Stats Demandes Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/demandes-client-stats-premium"

echo Testing Demandes Client Stats Ultra Premium...
curl -s -o nul -w "Stats Demandes Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/demandes-client-stats-ultra-premium"

echo Testing Demandes Client Kanban Premium...
curl -s -o nul -w "Kanban Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/demandes-client-kanban-premium"

echo Testing Demandes Client Kanban Ultra Premium...
curl -s -o nul -w "Kanban Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/demandes-client-kanban-ultra-premium"

echo Testing Planning Demandes Client Premium...
curl -s -o nul -w "Planning Demandes Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/planning-demandes-client-premium"

echo Testing Planning Demandes Client Ultra Premium...
curl -s -o nul -w "Planning Demandes Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/planning-demandes-client-ultra-premium"

echo Testing Tableau de Bord Demandes Premium...
curl -s -o nul -w "Tableau Bord Demandes Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/tableau-bord-demandes-client-premium"

echo Testing Tableau de Bord Demandes Ultra Premium...
curl -s -o nul -w "Tableau Bord Demandes Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/tableau-bord-demandes-client-ultra-premium"

echo.
echo ========================================
echo 3. PLANNING
echo ========================================

echo Testing Planning General Ultra Premium...
curl -s -o nul -w "Planning General: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/planning-general-ultra-premium"

echo Testing Journee Ultra Premium...
curl -s -o nul -w "Journee: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/journee-ultra-premium"

echo Testing Mois Ultra Premium...
curl -s -o nul -w "Mois: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/mois-ultra-premium"

echo Testing Recurrence Ultra Premium...
curl -s -o nul -w "Recurrence: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/recurrence-ultra-premium"

echo Testing Actions Courantes Ultra Premium...
curl -s -o nul -w "Actions Courantes: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/actions-courantes-ultra-premium"

echo.
echo ========================================
echo 4. INTERVENTIONS
echo ========================================

echo Testing Tableau de Bord Interventions Ultra Premium...
curl -s -o nul -w "Tableau Bord Interventions: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/tableau-bord-interventions-ultra-premium"

echo Testing Statistiques Journee Premium...
curl -s -o nul -w "Stats Journee Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/statistiques-journee-premium"

echo Testing Statistiques Journee Ultra Premium...
curl -s -o nul -w "Stats Journee Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/statistiques-journee-ultra-premium"

echo Testing Statistiques Planning Premium...
curl -s -o nul -w "Stats Planning Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/statistiques-planning-premium"

echo Testing Statistiques Planning Ultra Premium...
curl -s -o nul -w "Stats Planning Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/statistiques-planning-ultra-premium"

echo Testing Temps Travaille Ultra Premium...
curl -s -o nul -w "Temps Travaille: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/temps-travaille-ultra-premium"

echo Testing Vehicules Ultra Premium...
curl -s -o nul -w "Vehicules: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/vehicules-ultra-premium"

echo Testing Equipements Premium...
curl -s -o nul -w "Equipements Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/equipements-premium"

echo Testing Equipements Ultra Premium...
curl -s -o nul -w "Equipements Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/equipements-ultra-premium"

echo.
echo ========================================
echo 5. FACTURATION
echo ========================================

echo Testing Devis Premium...
curl -s -o nul -w "Devis Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/devis-premium"

echo Testing Devis Ultra Premium...
curl -s -o nul -w "Devis Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/devis-ultra-premium"

echo Testing Devis Facturation Ultra Premium...
curl -s -o nul -w "Devis Facturation: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/devis-facturation-ultra-premium"

echo Testing Factures Premium...
curl -s -o nul -w "Factures Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/factures-premium"

echo Testing Factures Ultra Premium...
curl -s -o nul -w "Factures Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/factures-ultra-premium"

echo Testing Avoirs Facturation Ultra Premium...
curl -s -o nul -w "Avoirs Facturation: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/avoirs-facturation-ultra-premium"

echo Testing Statistiques Facturation Ultra Premium...
curl -s -o nul -w "Stats Facturation: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/statistiques-facturation-ultra-premium"

echo Testing Produits Services Premium...
curl -s -o nul -w "Produits Services Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/produits-services-premium"

echo Testing Produits Services Ultra Premium...
curl -s -o nul -w "Produits Services Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/produits-services-ultra-premium"

echo.
echo ========================================
echo 6. AUTRES MODULES
echo ========================================

echo Testing Pointages Premium...
curl -s -o nul -w "Pointages Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/pointages-premium"

echo Testing Pointages Ultra Premium...
curl -s -o nul -w "Pointages Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/pointages-ultra-premium"

echo Testing Fichiers Premium...
curl -s -o nul -w "Fichiers Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/fichiers-premium"

echo Testing Fichiers Ultra Premium...
curl -s -o nul -w "Fichiers Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/fichiers-ultra-premium"

echo Testing Envoi Documents Premium...
curl -s -o nul -w "Envoi Documents Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/envoi-documents-premium"

echo Testing Envoi Documents Ultra Premium...
curl -s -o nul -w "Envoi Documents Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/envoi-documents-ultra-premium"

echo Testing Rappels Ultra Premium...
curl -s -o nul -w "Rappels Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/rappels-ultra-premium"

echo Testing Dashboard Premium...
curl -s -o nul -w "Dashboard Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/dashboard-premium"

echo Testing Dashboard Ultra Premium...
curl -s -o nul -w "Dashboard Ultra Premium: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/dashboard-ultra-premium"

echo Testing OrganipoussV2...
curl -s -o nul -w "OrganipoussV2: HTTP %%{http_code}\n" "%BASE_URL%/dashboard/organipouss-v2"

echo.
echo ================================================
echo RESULTATS:
echo   200 = Page charge correctement
echo   404 = Route non trouvee
echo   500 = Erreur dans le composant
echo ================================================
pause