# Script de test complet des endpoints OrganiPouss V2
# PowerShell version pour Windows

# Configuration
$API_URL = "https://api-pousse-app-5y2wo.ondigitalocean.app/api"
$LOCAL_API = "http://localhost:3001/api"

# Utiliser l'URL de production par défaut
$BASE_URL = $API_URL

# Token d'authentification (à remplacer par un token valide)
$TOKEN = ""

# Fonction pour afficher le statut avec couleur
function Write-Status {
    param(
        [bool]$Success,
        [string]$Message
    )
    
    if ($Success) {
        Write-Host "✓ $Message" -ForegroundColor Green
    } else {
        Write-Host "✗ $Message" -ForegroundColor Red
    }
}

# Fonction pour tester un endpoint
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Description,
        [string]$Data = $null
    )
    
    Write-Host "Testing: $Description" -ForegroundColor Blue
    
    $headers = @{
        "Authorization" = "Bearer $TOKEN"
        "Content-Type" = "application/json"
    }
    
    $uri = "$BASE_URL$Endpoint"
    
    try {
        if ($Data) {
            $response = Invoke-WebRequest -Uri $uri -Method $Method -Headers $headers -Body $Data -UseBasicParsing -ErrorAction Stop
        } else {
            $response = Invoke-WebRequest -Uri $uri -Method $Method -Headers $headers -UseBasicParsing -ErrorAction Stop
        }
        
        Write-Status -Success $true -Message "$Description (HTTP $($response.StatusCode))"
        return $true
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        if ($statusCode -eq 401) {
            Write-Host "⚠ $Description - Authentification requise (HTTP 401)" -ForegroundColor Yellow
        } else {
            Write-Status -Success $false -Message "$Description (HTTP $statusCode)"
        }
        return $false
    }
}

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "     TEST COMPLET DES ENDPOINTS ORGANIPOUSS V2" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Authentification si pas de token
if (-not $TOKEN) {
    Write-Host "Authentification requise" -ForegroundColor Yellow
    $email = Read-Host "Email"
    $password = Read-Host "Password" -AsSecureString
    $password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
    
    $authBody = @{
        email = $email
        password = $password
    } | ConvertTo-Json
    
    try {
        $authResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method Post -Body $authBody -ContentType "application/json"
        $TOKEN = $authResponse.token
        
        if ($TOKEN) {
            Write-Host "Authentification réussie" -ForegroundColor Green
            Write-Host ""
        } else {
            Write-Host "Échec de l'authentification" -ForegroundColor Red
            exit 1
        }
    }
    catch {
        Write-Host "Échec de l'authentification" -ForegroundColor Red
        exit 1
    }
}

# ======================================
# 1. SUIVI CLIENTS
# ======================================
Write-Host "=== SUIVI CLIENTS ===" -ForegroundColor Yellow

Test-Endpoint -Method "GET" -Endpoint "/clients" -Description "Clients - Liste"
Test-Endpoint -Method "GET" -Endpoint "/clients/stats" -Description "Clients - Statistiques"
Test-Endpoint -Method "GET" -Endpoint "/clients/export" -Description "Clients - Export"
Test-Endpoint -Method "GET" -Endpoint "/clients/1" -Description "Clients - Détail"

Test-Endpoint -Method "GET" -Endpoint "/addresses" -Description "Adresses - Liste"
Test-Endpoint -Method "GET" -Endpoint "/addresses/map" -Description "Adresses - Carte"
Test-Endpoint -Method "GET" -Endpoint "/addresses/zones" -Description "Adresses - Zones"

Test-Endpoint -Method "GET" -Endpoint "/contracts" -Description "Contrats - Liste"
Test-Endpoint -Method "GET" -Endpoint "/contracts/active" -Description "Contrats - Actifs"
Test-Endpoint -Method "GET" -Endpoint "/contracts/expiring" -Description "Contrats - À renouveler"
Test-Endpoint -Method "GET" -Endpoint "/contracts/templates" -Description "Contrats - Modèles"

Test-Endpoint -Method "GET" -Endpoint "/contacts" -Description "Contacts - Liste"
Test-Endpoint -Method "GET" -Endpoint "/contacts/groups" -Description "Contacts - Groupes"
Test-Endpoint -Method "GET" -Endpoint "/contacts/communications" -Description "Contacts - Historique comm"

Test-Endpoint -Method "GET" -Endpoint "/business" -Description "Affaires - Liste"
Test-Endpoint -Method "GET" -Endpoint "/business/pipeline" -Description "Affaires - Pipeline"
Test-Endpoint -Method "GET" -Endpoint "/business/forecast" -Description "Affaires - Prévisions"

Write-Host ""

# ======================================
# 2. DEMANDES CLIENT
# ======================================
Write-Host "=== DEMANDES CLIENT ===" -ForegroundColor Yellow

Test-Endpoint -Method "GET" -Endpoint "/client-requests" -Description "Demandes - Liste"
Test-Endpoint -Method "GET" -Endpoint "/client-requests/stats" -Description "Demandes - Statistiques"
Test-Endpoint -Method "GET" -Endpoint "/client-requests/kanban" -Description "Demandes - Kanban"
Test-Endpoint -Method "GET" -Endpoint "/client-requests/calendar" -Description "Demandes - Planning"
Test-Endpoint -Method "GET" -Endpoint "/client-requests/dashboard" -Description "Demandes - Tableau de bord"
Test-Endpoint -Method "GET" -Endpoint "/client-requests/workflow" -Description "Demandes - Workflow"
Test-Endpoint -Method "GET" -Endpoint "/client-requests/sla" -Description "Demandes - SLA"

Write-Host ""

# ======================================
# 3. PLANNING
# ======================================
Write-Host "=== PLANNING ===" -ForegroundColor Yellow

Test-Endpoint -Method "GET" -Endpoint "/planning/general" -Description "Planning - Général"
Test-Endpoint -Method "GET" -Endpoint "/planning/day" -Description "Planning - Journée"
Test-Endpoint -Method "GET" -Endpoint "/planning/month" -Description "Planning - Mois"
Test-Endpoint -Method "GET" -Endpoint "/planning/requests" -Description "Planning - Demandes client"
Test-Endpoint -Method "GET" -Endpoint "/planning/recurrence" -Description "Planning - Récurrence"
Test-Endpoint -Method "GET" -Endpoint "/planning/actions" -Description "Planning - Actions courantes"
Test-Endpoint -Method "GET" -Endpoint "/planning/optimize" -Description "Planning - Optimisation"
Test-Endpoint -Method "GET" -Endpoint "/planning/resources" -Description "Planning - Ressources"

Write-Host ""

# ======================================
# 4. INTERVENTIONS
# ======================================
Write-Host "=== INTERVENTIONS ===" -ForegroundColor Yellow

Test-Endpoint -Method "GET" -Endpoint "/interventions" -Description "Interventions - Liste"
Test-Endpoint -Method "GET" -Endpoint "/interventions/dashboard" -Description "Interventions - Tableau de bord"
Test-Endpoint -Method "GET" -Endpoint "/interventions/stats/day" -Description "Interventions - Stats journée"
Test-Endpoint -Method "GET" -Endpoint "/interventions/stats/planning" -Description "Interventions - Stats planning"
Test-Endpoint -Method "GET" -Endpoint "/interventions/time-tracking" -Description "Interventions - Temps travaillé"
Test-Endpoint -Method "GET" -Endpoint "/interventions/vehicles" -Description "Interventions - Véhicules"
Test-Endpoint -Method "GET" -Endpoint "/interventions/equipment" -Description "Interventions - Équipements"
Test-Endpoint -Method "GET" -Endpoint "/interventions/kpi" -Description "Interventions - KPIs temps réel"

Write-Host ""

# ======================================
# 5. FACTURATION
# ======================================
Write-Host "=== FACTURATION ===" -ForegroundColor Yellow

Test-Endpoint -Method "GET" -Endpoint "/quotes" -Description "Devis - Liste"
Test-Endpoint -Method "GET" -Endpoint "/quotes/stats" -Description "Devis - Statistiques"
Test-Endpoint -Method "GET" -Endpoint "/quotes/templates" -Description "Devis - Modèles"
Test-Endpoint -Method "GET" -Endpoint "/quotes/pending" -Description "Devis - En attente"

Test-Endpoint -Method "GET" -Endpoint "/invoices" -Description "Factures - Liste"
Test-Endpoint -Method "GET" -Endpoint "/invoices/stats" -Description "Factures - Statistiques"
Test-Endpoint -Method "GET" -Endpoint "/invoices/unpaid" -Description "Factures - Impayées"
Test-Endpoint -Method "GET" -Endpoint "/invoices/export" -Description "Factures - Export comptable"

Test-Endpoint -Method "GET" -Endpoint "/assets" -Description "Avoirs - Liste"
Test-Endpoint -Method "GET" -Endpoint "/assets/stats" -Description "Avoirs - Statistiques"

Test-Endpoint -Method "GET" -Endpoint "/products" -Description "Produits/Services - Liste"
Test-Endpoint -Method "GET" -Endpoint "/products/categories" -Description "Produits - Catégories"
Test-Endpoint -Method "GET" -Endpoint "/products/catalog" -Description "Produits - Catalogue"

Write-Host ""

# ======================================
# 6. AUTRES MODULES
# ======================================
Write-Host "=== AUTRES MODULES ===" -ForegroundColor Yellow

Test-Endpoint -Method "GET" -Endpoint "/timesheets" -Description "Pointages - Liste"
Test-Endpoint -Method "GET" -Endpoint "/timesheets/summary" -Description "Pointages - Résumé"
Test-Endpoint -Method "GET" -Endpoint "/timesheets/validation" -Description "Pointages - Validation"

Test-Endpoint -Method "GET" -Endpoint "/documents" -Description "Fichiers - Liste"
Test-Endpoint -Method "GET" -Endpoint "/documents/shared" -Description "Fichiers - Partagés"
Test-Endpoint -Method "GET" -Endpoint "/documents/versions" -Description "Fichiers - Versions"

Test-Endpoint -Method "GET" -Endpoint "/document-sending" -Description "Envoi documents - Liste"
Test-Endpoint -Method "GET" -Endpoint "/document-sending/pending" -Description "Envoi documents - En attente"
Test-Endpoint -Method "GET" -Endpoint "/document-sending/history" -Description "Envoi documents - Historique"

Test-Endpoint -Method "GET" -Endpoint "/reminders" -Description "Rappels - Liste"
Test-Endpoint -Method "GET" -Endpoint "/reminders/scheduled" -Description "Rappels - Planifiés"
Test-Endpoint -Method "GET" -Endpoint "/reminders/templates" -Description "Rappels - Modèles"
Test-Endpoint -Method "GET" -Endpoint "/reminders/history" -Description "Rappels - Historique"

Write-Host ""

# ======================================
# 7. FONCTIONNALITÉS ULTRA PREMIUM
# ======================================
Write-Host "=== FONCTIONNALITÉS ULTRA PREMIUM ===" -ForegroundColor Yellow

# Intelligence Artificielle
Test-Endpoint -Method "GET" -Endpoint "/ai/predictions" -Description "IA - Prédictions"
Test-Endpoint -Method "GET" -Endpoint "/ai/optimization" -Description "IA - Optimisation"
Test-Endpoint -Method "GET" -Endpoint "/ai/insights" -Description "IA - Insights"

# Intégrations
Test-Endpoint -Method "GET" -Endpoint "/integrations/erp" -Description "Intégrations - ERP"
Test-Endpoint -Method "GET" -Endpoint "/integrations/crm" -Description "Intégrations - CRM"
Test-Endpoint -Method "GET" -Endpoint "/integrations/accounting" -Description "Intégrations - Comptabilité"

# Analytics avancés
Test-Endpoint -Method "GET" -Endpoint "/analytics/realtime" -Description "Analytics - Temps réel"
Test-Endpoint -Method "GET" -Endpoint "/analytics/predictive" -Description "Analytics - Prédictif"
Test-Endpoint -Method "GET" -Endpoint "/analytics/custom" -Description "Analytics - Personnalisé"

# Automatisation
Test-Endpoint -Method "GET" -Endpoint "/automation/workflows" -Description "Automation - Workflows"
Test-Endpoint -Method "GET" -Endpoint "/automation/rules" -Description "Automation - Règles"
Test-Endpoint -Method "GET" -Endpoint "/automation/triggers" -Description "Automation - Déclencheurs"

Write-Host ""

# ======================================
# RÉSUMÉ
# ======================================
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "     TEST TERMINÉ" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan

# Test de santé général
Write-Host ""
Write-Host "=== TEST DE SANTÉ GÉNÉRAL ===" -ForegroundColor Yellow
Test-Endpoint -Method "GET" -Endpoint "/health" -Description "API Health Check"
Test-Endpoint -Method "GET" -Endpoint "/version" -Description "API Version"

Write-Host ""
Write-Host "Pour tester en local, modifiez la variable:" -ForegroundColor Cyan
Write-Host '  $BASE_URL = "http://localhost:3001/api"' -ForegroundColor White
Write-Host "Puis executez:" -ForegroundColor Cyan
Write-Host '  .\test-all-endpoints.ps1' -ForegroundColor White