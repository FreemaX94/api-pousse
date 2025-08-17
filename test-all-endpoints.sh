#!/bin/bash

# Configuration
API_URL="https://api-pousse-app-5y2wo.ondigitalocean.app/api"
LOCAL_API="http://localhost:3001/api"

# Utiliser l'URL de production par défaut
BASE_URL="${API_URL}"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Token d'authentification (à remplacer par un token valide)
TOKEN=""

# Fonction pour afficher le statut
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

# Fonction pour tester un endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    
    echo -e "${BLUE}Testing:${NC} $description"
    
    if [ -z "$data" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            "$BASE_URL$endpoint")
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint")
    fi
    
    if [[ $response -ge 200 && $response -lt 300 ]]; then
        print_status 0 "$description (HTTP $response)"
        return 0
    elif [ $response -eq 401 ]; then
        echo -e "${YELLOW}⚠${NC} $description - Authentification requise (HTTP $response)"
        return 1
    else
        print_status 1 "$description (HTTP $response)"
        return 1
    fi
}

echo "================================================"
echo "     TEST COMPLET DES ENDPOINTS ORGANIPOUSS V2"
echo "================================================"
echo ""

# D'abord, obtenir un token d'authentification si non fourni
if [ -z "$TOKEN" ]; then
    echo -e "${YELLOW}Authentification requise${NC}"
    echo "Entrez vos identifiants:"
    read -p "Email: " email
    read -s -p "Password: " password
    echo ""
    
    # Tentative de connexion
    auth_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}" \
        "$BASE_URL/auth/login")
    
    TOKEN=$(echo $auth_response | grep -o '"token":"[^"]*' | sed 's/"token":"//')
    
    if [ -z "$TOKEN" ]; then
        echo -e "${RED}Échec de l'authentification${NC}"
        exit 1
    else
        echo -e "${GREEN}Authentification réussie${NC}"
        echo ""
    fi
fi

# ======================================
# 1. SUIVI CLIENTS
# ======================================
echo -e "${YELLOW}=== SUIVI CLIENTS ===${NC}"

test_endpoint "GET" "/clients" "Clients - Liste"
test_endpoint "GET" "/clients/stats" "Clients - Statistiques"
test_endpoint "GET" "/clients/export" "Clients - Export"
test_endpoint "GET" "/clients/1" "Clients - Détail"

test_endpoint "GET" "/addresses" "Adresses - Liste"
test_endpoint "GET" "/addresses/map" "Adresses - Carte"
test_endpoint "GET" "/addresses/zones" "Adresses - Zones"

test_endpoint "GET" "/contracts" "Contrats - Liste"
test_endpoint "GET" "/contracts/active" "Contrats - Actifs"
test_endpoint "GET" "/contracts/expiring" "Contrats - À renouveler"
test_endpoint "GET" "/contracts/templates" "Contrats - Modèles"

test_endpoint "GET" "/contacts" "Contacts - Liste"
test_endpoint "GET" "/contacts/groups" "Contacts - Groupes"
test_endpoint "GET" "/contacts/communications" "Contacts - Historique comm"

test_endpoint "GET" "/business" "Affaires - Liste"
test_endpoint "GET" "/business/pipeline" "Affaires - Pipeline"
test_endpoint "GET" "/business/forecast" "Affaires - Prévisions"

echo ""

# ======================================
# 2. DEMANDES CLIENT
# ======================================
echo -e "${YELLOW}=== DEMANDES CLIENT ===${NC}"

test_endpoint "GET" "/client-requests" "Demandes - Liste"
test_endpoint "GET" "/client-requests/stats" "Demandes - Statistiques"
test_endpoint "GET" "/client-requests/kanban" "Demandes - Kanban"
test_endpoint "GET" "/client-requests/calendar" "Demandes - Planning"
test_endpoint "GET" "/client-requests/dashboard" "Demandes - Tableau de bord"
test_endpoint "GET" "/client-requests/workflow" "Demandes - Workflow"
test_endpoint "GET" "/client-requests/sla" "Demandes - SLA"

echo ""

# ======================================
# 3. PLANNING
# ======================================
echo -e "${YELLOW}=== PLANNING ===${NC}"

test_endpoint "GET" "/planning/general" "Planning - Général"
test_endpoint "GET" "/planning/day" "Planning - Journée"
test_endpoint "GET" "/planning/month" "Planning - Mois"
test_endpoint "GET" "/planning/requests" "Planning - Demandes client"
test_endpoint "GET" "/planning/recurrence" "Planning - Récurrence"
test_endpoint "GET" "/planning/actions" "Planning - Actions courantes"
test_endpoint "GET" "/planning/optimize" "Planning - Optimisation"
test_endpoint "GET" "/planning/resources" "Planning - Ressources"

echo ""

# ======================================
# 4. INTERVENTIONS
# ======================================
echo -e "${YELLOW}=== INTERVENTIONS ===${NC}"

test_endpoint "GET" "/interventions" "Interventions - Liste"
test_endpoint "GET" "/interventions/dashboard" "Interventions - Tableau de bord"
test_endpoint "GET" "/interventions/stats/day" "Interventions - Stats journée"
test_endpoint "GET" "/interventions/stats/planning" "Interventions - Stats planning"
test_endpoint "GET" "/interventions/time-tracking" "Interventions - Temps travaillé"
test_endpoint "GET" "/interventions/vehicles" "Interventions - Véhicules"
test_endpoint "GET" "/interventions/equipment" "Interventions - Équipements"
test_endpoint "GET" "/interventions/kpi" "Interventions - KPIs temps réel"

echo ""

# ======================================
# 5. FACTURATION
# ======================================
echo -e "${YELLOW}=== FACTURATION ===${NC}"

test_endpoint "GET" "/quotes" "Devis - Liste"
test_endpoint "GET" "/quotes/stats" "Devis - Statistiques"
test_endpoint "GET" "/quotes/templates" "Devis - Modèles"
test_endpoint "GET" "/quotes/pending" "Devis - En attente"

test_endpoint "GET" "/invoices" "Factures - Liste"
test_endpoint "GET" "/invoices/stats" "Factures - Statistiques"
test_endpoint "GET" "/invoices/unpaid" "Factures - Impayées"
test_endpoint "GET" "/invoices/export" "Factures - Export comptable"

test_endpoint "GET" "/assets" "Avoirs - Liste"
test_endpoint "GET" "/assets/stats" "Avoirs - Statistiques"

test_endpoint "GET" "/products" "Produits/Services - Liste"
test_endpoint "GET" "/products/categories" "Produits - Catégories"
test_endpoint "GET" "/products/catalog" "Produits - Catalogue"

echo ""

# ======================================
# 6. AUTRES MODULES
# ======================================
echo -e "${YELLOW}=== AUTRES MODULES ===${NC}"

test_endpoint "GET" "/timesheets" "Pointages - Liste"
test_endpoint "GET" "/timesheets/summary" "Pointages - Résumé"
test_endpoint "GET" "/timesheets/validation" "Pointages - Validation"

test_endpoint "GET" "/documents" "Fichiers - Liste"
test_endpoint "GET" "/documents/shared" "Fichiers - Partagés"
test_endpoint "GET" "/documents/versions" "Fichiers - Versions"

test_endpoint "GET" "/document-sending" "Envoi documents - Liste"
test_endpoint "GET" "/document-sending/pending" "Envoi documents - En attente"
test_endpoint "GET" "/document-sending/history" "Envoi documents - Historique"

test_endpoint "GET" "/reminders" "Rappels - Liste"
test_endpoint "GET" "/reminders/scheduled" "Rappels - Planifiés"
test_endpoint "GET" "/reminders/templates" "Rappels - Modèles"
test_endpoint "GET" "/reminders/history" "Rappels - Historique"

echo ""

# ======================================
# 7. FONCTIONNALITÉS ULTRA PREMIUM
# ======================================
echo -e "${YELLOW}=== FONCTIONNALITÉS ULTRA PREMIUM ===${NC}"

# Intelligence Artificielle
test_endpoint "GET" "/ai/predictions" "IA - Prédictions"
test_endpoint "GET" "/ai/optimization" "IA - Optimisation"
test_endpoint "GET" "/ai/insights" "IA - Insights"

# Intégrations
test_endpoint "GET" "/integrations/erp" "Intégrations - ERP"
test_endpoint "GET" "/integrations/crm" "Intégrations - CRM"
test_endpoint "GET" "/integrations/accounting" "Intégrations - Comptabilité"

# Analytics avancés
test_endpoint "GET" "/analytics/realtime" "Analytics - Temps réel"
test_endpoint "GET" "/analytics/predictive" "Analytics - Prédictif"
test_endpoint "GET" "/analytics/custom" "Analytics - Personnalisé"

# Automatisation
test_endpoint "GET" "/automation/workflows" "Automation - Workflows"
test_endpoint "GET" "/automation/rules" "Automation - Règles"
test_endpoint "GET" "/automation/triggers" "Automation - Déclencheurs"

echo ""

# ======================================
# RÉSUMÉ
# ======================================
echo "================================================"
echo -e "${GREEN}     TEST TERMINÉ${NC}"
echo "================================================"

# Statistiques finales
total_tests=$(grep -c "test_endpoint" "$0")
echo -e "Total des endpoints testés: ${BLUE}$total_tests${NC}"

# Test de santé général
echo ""
echo -e "${YELLOW}=== TEST DE SANTÉ GÉNÉRAL ===${NC}"
test_endpoint "GET" "/health" "API Health Check"
test_endpoint "GET" "/version" "API Version"

echo ""
echo "Pour tester en local, utilisez:"
echo "  export API_URL=http://localhost:3001/api"
echo "  ./test-all-endpoints.sh"