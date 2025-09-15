import React, { lazy, Suspense } from 'react';
import LoadingFallback from '../components/LoadingFallback';

/**
 * Créer un composant lazy simplifié
 * @param {Function} importFn - Fonction d'import dynamique
 * @param {Object} options - Options de configuration
 */
export const createLazyComponent = (importFn, options = {}) => {
  const { fallback = React.createElement(LoadingFallback) } = options || {};

  const LazyComponent = lazy(importFn);

  const WrappedComponent = (props) => React.createElement(
    Suspense,
    { fallback },
    React.createElement(LazyComponent, props)
  );

  return WrappedComponent;
};

/**
 * Composants lazy pour les pages principales
 */

// Pages d'authentification
export const LoginPage = createLazyComponent(
  () => import('../features/auth/pages/Login')
);

export const SignupPage = createLazyComponent(
  () => import('../features/auth/pages/Signup')
);

export const ForgotPasswordPage = createLazyComponent(
  () => import('../features/auth/pages/ForgotPassword')
);

// Pages métier principales
export const StockViewer = createLazyComponent(
  () => import('../features/inventory/components/StockViewer')
);

export const NieuwkoopPage = createLazyComponent(
  () => import('../features/catalog/pages/Nieuwkoop')
);

export const ComptabilitePage = createLazyComponent(
  () => import('../features/finance/pages/Comptabilite')
);

export const VehiculesPage = createLazyComponent(
  () => import('../features/fleet/pages/Vehicules')
);

export const PlanningGeneral = createLazyComponent(
  () => import('../features/planning/components/PlanningGeneral')
);

// Composants d'administration
export const AdminPage = createLazyComponent(
  () => import('../pages/AdminPage')
);

export const CatalogueAdmin = createLazyComponent(
  () => import('../features/catalog/pages/CatalogueAdmin')
);

// Pages de modules spécialisés
export const EntretienPage = createLazyComponent(
  () => import('../features/projects/pages/Entretien')
);

export const MouvementsPage = createLazyComponent(
  () => import('../features/inventory/pages/Mouvements')
);

export const LivraisonListPage = createLazyComponent(
  () => import('../features/inventory/pages/LivraisonList')
);

