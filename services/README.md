# 🏗️ Services - Architecture Microservices

Cette structure organise l'application en services modulaires pour améliorer la maintenabilité et la scalabilité.

## 📁 Structure des Services

```
services/
├── auth-service/           # Authentification et gestion utilisateurs
├── stock-service/          # Gestion des stocks et inventaires
├── catalog-service/        # Catalogue et intégration Nieuwkoop
├── invoice-service/        # Facturation et comptabilité
└── shared/                 # Utilitaires et composants partagés
    ├── event-bus/         # Bus d'événements Redis
    ├── database/          # Configuration MongoDB
    └── middleware/        # Middlewares communs
```

## 🎯 Responsabilités des Services

### **auth-service**
- Authentification JWT
- Gestion des utilisateurs
- Contrôle d'accès (RBAC)
- Sessions et refresh tokens

### **stock-service**
- Entrées/Sorties de stock
- Mouvements d'inventaire
- Gestion des dépôts
- Rapports de stock

### **catalog-service**
- Catalogue produits
- Intégration API Nieuwkoop
- Synchronisation externe
- Cache intelligent

### **invoice-service**
- Génération factures
- Gestion comptable
- Rapports financiers
- Exports comptables

## 🚀 Prochaines Étapes

1. Migration progressive depuis la structure monolithique
2. Implémentation Event-Driven Architecture
3. Configuration Docker pour chaque service
4. Tests d'intégration inter-services