#!/bin/bash
# backend/scripts/emergency-security-fix.sh

echo "🚨 Correction de sécurité urgente..."

# 1. Backup du .env actuel
cp backend/.env backend/.env.backup.$(date +%Y%m%d_%H%M%S)

# 2. Générer nouveaux secrets
node backend/scripts/generateSecrets.js > new-secrets.txt

# 3. Ajouter .env au .gitignore si pas déjà fait
grep -q "^\.env$" backend/.gitignore || echo ".env" >> backend/.gitignore
grep -q "^\.env\." backend/.gitignore || echo ".env.*" >> backend/.gitignore

# 4. Vérifier si .env est dans git
if git ls-files --error-unmatch backend/.env 2>/dev/null; then
    echo "⚠️  ALERTE: .env est dans git! Suppression..."
    git rm --cached backend/.env
    git commit -m "fix: remove .env from tracking"
fi

echo "✅ Étape 1 terminée. Actions requises:"
echo "1. Changez IMMÉDIATEMENT le mot de passe MongoDB"
echo "2. Régénérez les credentials Nieuwkoop"
echo "3. Créez une nouvelle clé de service Google"
echo "4. Mettez à jour le .env avec les valeurs de new-secrets.txt"
echo "5. Redémarrez l'application"
