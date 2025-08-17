@echo off
echo ================================================
echo      TEST SIMPLE DES ENDPOINTS ORGANIPOUSS V2
echo ================================================
echo.

set API_URL=https://api-pousse-app-5y2wo.ondigitalocean.app

echo Testing API Health...
curl -s -o nul -w "Health Check: HTTP %%{http_code}\n" "%API_URL%/api/health"

echo.
echo Testing Auth Endpoint...
curl -s -o nul -w "Auth Login: HTTP %%{http_code}\n" "%API_URL%/api/auth/login" -X POST -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"test\"}"

echo.
echo Testing Root...
curl -s -o nul -w "Root: HTTP %%{http_code}\n" "%API_URL%/"

echo.
echo Testing Static Files...
curl -s -o nul -w "Static: HTTP %%{http_code}\n" "%API_URL%/index.html"

echo.
echo Testing API Base...
curl -s -o nul -w "API Base: HTTP %%{http_code}\n" "%API_URL%/api"

echo.
echo Testing Clients Endpoint (without auth)...
curl -s -o nul -w "Clients: HTTP %%{http_code}\n" "%API_URL%/api/clients"

echo.
echo ================================================
echo Si les codes HTTP sont:
echo   200-299 = OK
echo   401 = Authentification requise (normal)
echo   404 = Endpoint non trouve
echo   500-503 = Erreur serveur
echo ================================================
pause