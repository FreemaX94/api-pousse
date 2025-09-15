import React, { lazy, Suspense } from 'react';
import LoadingFallback from '../components/LoadingFallback';

/**
 * Wrapper intelligent pour le lazy loading avec gestion d'erreurs
 * et préchargement conditionnel
 */

/**
 * Créer un composant lazy avec fallback personnalisé
 * @param {Function} importFn - Fonction d'import dynamique
 * @param {Object} options - Options de configuration
 */
export const createLazyComponent = (importFn, options = {}) => {
  const {
    fallback = React.createElement(LoadingFallback),
    retries = 3,
    delay = 0,
    preload = false
  } = options || {};

  // Wrapper pour retry automatique en cas d'échec
  const retryImport = async (fn, retriesLeft = retries) => {
    try {
      return await fn();
    } catch (error) {
      if (retriesLeft > 0) {
        console.warn(`🔄 Retry import (${retries - retriesLeft + 1}/${retries}):`, error);
        // Délai exponentiel entre les tentatives
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries - retriesLeft) * 1000));
        return retryImport(fn, retriesLeft - 1);
      }
      console.error('❌ Import failed after retries:', error);
      throw error;
    }
  };

  // Fonction d'import avec retry et métriques
  const importWithMetrics = async () => {
    const startTime = performance.now();
    
    try {
      const module = await retryImport(importFn);
      const loadTime = performance.now() - startTime;
      
      // Log des métriques de performance
      if (loadTime > 1000) {
        console.warn(`🐌 Slow component load: ${loadTime.toFixed(2)}ms`);
      } else {
        console.log(`⚡ Component loaded: ${loadTime.toFixed(2)}ms`);
      }
      
      return module;
    } catch (error) {
      console.error('💥 Component load failed:', error);
      // Fallback vers un composant d'erreur
      return {
        default: () => React.createElement('div', {
          className: 'error-boundary',
          style: {
            padding: '20px',
            textAlign: 'center',
            border: '1px solid #ff6b6b',
            borderRadius: '8px',
            backgroundColor: '#ffe0e0'
          }
        }, [
          React.createElement('h3', { key: 'title' }, '⚠️ Erreur de chargement'),
          React.createElement('p', { key: 'message' }, 'Impossible de charger ce composant. Veuillez rafraîchir la page.'),
          React.createElement('button', {
            key: 'button',
            onClick: () => window.location.reload(),
            style: {
              padding: '8px 16px',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }
          }, '🔄 Rafraîchir')
        ])
      };
    }
  };

  const LazyComponent = lazy(async () => {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    return await importWithMetrics();
  });

  // Préchargement conditionnel
  if (preload) {
    // Précharger après un délai
    setTimeout(() => {
      importWithMetrics().catch(() => {
        // Ignorer les erreurs de préchargement
      });
    }, 2000);
  }

  // Wrapper avec Suspense
  const WrappedComponent = React.memo((props) => React.createElement(
    Suspense,
    { fallback },
    React.createElement(LazyComponent, props)
  ));

  // Ajouter une méthode de préchargement manuel
  WrappedComponent.preload = () => importWithMetrics();

  return WrappedComponent;
};

/**
 * Composants lazy pour les pages principales
 */

// Pages d'authentification
export const LoginPage = createLazyComponent(
  () => import('../features/auth/pages/Login'),
  { preload: true } // Précharger car utilisé fréquemment
);

export const SignupPage = createLazyComponent(
  () => import('../features/auth/pages/Signup')
);

export const ForgotPasswordPage = createLazyComponent(
  () => import('../features/auth/pages/ForgotPassword')
);

// Pages métier principales
export const StockViewer = createLazyComponent(
  () => import('../features/inventory/components/StockViewer'),
  { preload: true }
);

export const NieuwkoopPage = createLazyComponent(
  () => import('../features/catalog/pages/Nieuwkoop'),
  { 
    preload: false, // Gros composant, charger à la demande
    delay: 100 // Petit délai pour éviter le flash
  }
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
  () => import('../pages/AdminPage'),
  { retries: 1 } // Moins de retry pour l'admin
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

/**
 * Hook pour précharger des composants selon les conditions
 */
export const usePreloadComponents = () => {
  const preloadOnHover = (componentPreloader) => {
    return {
      onMouseEnter: () => {
        if (componentPreloader && typeof componentPreloader.preload === 'function') {
          componentPreloader.preload();
        }
      }
    };
  };

  const preloadOnIdle = (components) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        components.forEach(component => {
          if (component && typeof component.preload === 'function') {
            component.preload();
          }
        });
      });
    } else {
      // Fallback pour navigateurs sans requestIdleCallback
      setTimeout(() => {
        components.forEach(component => {
          if (component && typeof component.preload === 'function') {
            component.preload();
          }
        });
      }, 2000);
    }
  };

  const preloadByRoute = (currentRoute) => {
    // Logique de préchargement basée sur la route actuelle
    const preloadMap = {
      '/': [StockViewer, NieuwkoopPage],
      '/auth': [SignupPage, ForgotPasswordPage],
      '/admin': [CatalogueAdmin],
      '/finance': [ComptabilitePage],
      '/planning': [PlanningGeneral]
    };

    const componentsToPreload = preloadMap[currentRoute] || [];
    preloadOnIdle(componentsToPreload);
  };

  return {
    preloadOnHover,
    preloadOnIdle,
    preloadByRoute
  };
};

/**
 * Wrapper pour lazy loading conditionnel
 */
export const ConditionalLazy = ({ condition, lazyComponent, fallbackComponent, ...props }) => {
  if (condition) {
    const Component = lazyComponent;
    return React.createElement(Component, props);
  }
  
  const FallbackComponent = fallbackComponent;
  return React.createElement(FallbackComponent, props);
};

/**
 * Métriques de performance pour le lazy loading
 */
class LazyLoadingMetrics {
  constructor() {
    this.metrics = new Map();
  }

  recordLoad(componentName, loadTime, success = true) {
    if (!this.metrics.has(componentName)) {
      this.metrics.set(componentName, {
        loads: 0,
        totalTime: 0,
        failures: 0,
        avgTime: 0
      });
    }

    const metric = this.metrics.get(componentName);
    metric.loads++;
    
    if (success) {
      metric.totalTime += loadTime;
      metric.avgTime = metric.totalTime / metric.loads;
    } else {
      metric.failures++;
    }
  }

  getReport() {
    const report = {};
    for (const [component, metric] of this.metrics) {
      report[component] = {
        ...metric,
        successRate: ((metric.loads - metric.failures) / metric.loads * 100).toFixed(1) + '%'
      };
    }
    return report;
  }

  getSlowestComponents(limit = 5) {
    return Array.from(this.metrics.entries())
      .sort(([,a], [,b]) => b.avgTime - a.avgTime)
      .slice(0, limit)
      .map(([name, metric]) => ({
        name,
        avgTime: metric.avgTime.toFixed(2) + 'ms'
      }));
  }
}

export const lazyMetrics = new LazyLoadingMetrics();