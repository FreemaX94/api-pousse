import { createBrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';

// Import des composants optimisés avec lazy loading
import {
  LoginPage,
  SignupPage,
  ForgotPasswordPage,
  StockViewer,
  NieuwkoopPage,
  ComptabilitePage,
  VehiculesPage,
  PlanningGeneral,
  AdminPage,
  CatalogueAdmin,
  EntretienPage,
  MouvementsPage,
  LivraisonListPage,
  usePreloadComponents
} from '../utils/lazy';

// Composants non-lazy (critiques)
import MainLayout from '../layouts/MainLayout';
import PrivateRoute from '../components/PrivateRoute';
import NotFound from '../pages/NotFound';
import LoadingFallback from '../components/LoadingFallback';
import ErrorBoundary from '../components/ErrorBoundary';

// Home component avec préchargement intelligent
import Home from '../Home';

/**
 * Configuration des routes avec optimisations de performance
 */

// Wrapper pour lazy loading avec gestion d'erreurs
const LazyWrapper = ({ children, routeName }) => (
  <ErrorBoundary fallback={<div>Erreur de chargement de la page {routeName}</div>}>
    <Suspense fallback={<LoadingFallback message={`Chargement ${routeName}...`} />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

// Routes avec lazy loading et préchargement
const createOptimizedRoute = (element, routeName, preloadComponents = []) => {
  const { preloadOnHover, preloadOnIdle } = usePreloadComponents();
  
  // Précharger les composants liés après un délai
  setTimeout(() => {
    preloadOnIdle(preloadComponents);
  }, 2000);

  return (
    <LazyWrapper routeName={routeName}>
      <div {...preloadOnHover(preloadComponents[0])}>
        {element}
      </div>
    </LazyWrapper>
  );
};

/**
 * Configuration du routeur optimisé
 */
export const optimizedRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
        // Précharger les composants probablement utilisés depuis l'accueil
        loader: async () => {
          // Préchargement asynchrone des pages populaires
          setTimeout(() => {
            StockViewer.preload?.();
            NieuwkoopPage.preload?.();
          }, 1000);
          return null;
        }
      },
      
      // Routes d'authentification (groupées pour optimisation)
      {
        path: "auth",
        children: [
          {
            path: "login",
            element: createOptimizedRoute(
              <LoginPage />, 
              "Connexion",
              [SignupPage, ForgotPasswordPage]
            )
          },
          {
            path: "signup", 
            element: createOptimizedRoute(
              <SignupPage />,
              "Inscription",
              [LoginPage]
            )
          },
          {
            path: "forgot-password",
            element: createOptimizedRoute(
              <ForgotPasswordPage />,
              "Mot de passe oublié",
              [LoginPage]
            )
          }
        ]
      },

      // Routes protégées avec lazy loading optimisé
      {
        path: "inventory",
        element: <PrivateRoute />,
        children: [
          {
            path: "stock",
            element: createOptimizedRoute(
              <StockViewer />,
              "Gestion Stock"
            )
          },
          {
            path: "movements",
            element: createOptimizedRoute(
              <MouvementsPage />,
              "Mouvements",
              [StockViewer]
            )
          },
          {
            path: "deliveries",
            element: createOptimizedRoute(
              <LivraisonListPage />,
              "Livraisons"
            )
          }
        ]
      },

      // Routes catalog avec préchargement conditionnel
      {
        path: "catalog",
        element: <PrivateRoute />,
        children: [
          {
            path: "nieuwkoop",
            element: createOptimizedRoute(
              <NieuwkoopPage />,
              "Catalogue Nieuwkoop"
            ),
            // Préchargement basé sur la taille d'écran
            loader: async () => {
              if (window.innerWidth > 768) {
                // Précharger seulement sur desktop (connexion plus stable)
                setTimeout(() => NieuwkoopPage.preload?.(), 500);
              }
              return null;
            }
          },
          {
            path: "admin",
            element: (
              <PrivateRoute requiredRole="admin">
                {createOptimizedRoute(
                  <CatalogueAdmin />,
                  "Administration Catalogue"
                )}
              </PrivateRoute>
            )
          }
        ]
      },

      // Routes finance avec chargement conditionnel par rôle
      {
        path: "finance",
        element: <PrivateRoute requiredRole={["admin", "manager"]} />,
        children: [
          {
            path: "accounting",
            element: createOptimizedRoute(
              <ComptabilitePage />,
              "Comptabilité"
            )
          }
        ]
      },

      // Routes planning avec optimisation mobile
      {
        path: "planning",
        element: <PrivateRoute />,
        children: [
          {
            path: "general",
            element: createOptimizedRoute(
              <PlanningGeneral />,
              "Planning Général"
            ),
            // Chargement adaptatif selon l'appareil
            loader: async () => {
              const isMobile = window.innerWidth < 768;
              if (!isMobile) {
                // Précharger les composants lourds seulement sur desktop
                setTimeout(() => PlanningGeneral.preload?.(), 1000);
              }
              return null;
            }
          }
        ]
      },

      // Routes projets
      {
        path: "projects",
        element: <PrivateRoute />,
        children: [
          {
            path: "maintenance",
            element: createOptimizedRoute(
              <EntretienPage />,
              "Entretien"
            )
          }
        ]
      },

      // Routes flotte
      {
        path: "fleet",
        element: <PrivateRoute />,
        children: [
          {
            path: "vehicles",
            element: createOptimizedRoute(
              <VehiculesPage />,
              "Véhicules"
            )
          }
        ]
      },

      // Routes admin avec chargement ultra-lazy
      {
        path: "admin",
        element: <PrivateRoute requiredRole="admin" />,
        children: [
          {
            index: true,
            element: createOptimizedRoute(
              <AdminPage />,
              "Administration"
            ),
            // Chargement très différé pour l'admin
            loader: async () => {
              return new Promise(resolve => {
                setTimeout(() => {
                  AdminPage.preload?.();
                  resolve(null);
                }, 3000);
              });
            }
          }
        ]
      }
    ]
  }
]);

/**
 * Router avec métriques de performance
 */
class PerformanceRouter {
  constructor(router) {
    this.router = router;
    this.routeMetrics = new Map();
    this.currentRoute = null;
  }

  // Enregistrer le temps de navigation
  recordNavigation(route, loadTime) {
    if (!this.routeMetrics.has(route)) {
      this.routeMetrics.set(route, {
        visits: 0,
        totalTime: 0,
        avgTime: 0,
        maxTime: 0
      });
    }

    const metric = this.routeMetrics.get(route);
    metric.visits++;
    metric.totalTime += loadTime;
    metric.avgTime = metric.totalTime / metric.visits;
    metric.maxTime = Math.max(metric.maxTime, loadTime);

    // Alerter si route lente
    if (loadTime > 3000) {
      console.warn(`🐌 Route lente détectée: ${route} (${loadTime}ms)`);
    }
  }

  // Obtenir les statistiques de navigation
  getNavigationStats() {
    const stats = {};
    for (const [route, metric] of this.routeMetrics) {
      stats[route] = {
        ...metric,
        performance: metric.avgTime < 1000 ? 'excellent' : 
                    metric.avgTime < 2000 ? 'good' : 
                    metric.avgTime < 3000 ? 'fair' : 'poor'
      };
    }
    return stats;
  }

  // Routes les plus lentes
  getSlowestRoutes(limit = 5) {
    return Array.from(this.routeMetrics.entries())
      .sort(([,a], [,b]) => b.avgTime - a.avgTime)
      .slice(0, limit)
      .map(([route, metric]) => ({
        route,
        avgTime: metric.avgTime.toFixed(2) + 'ms'
      }));
  }
}

// Instance du router avec métriques
export const performanceRouter = new PerformanceRouter(optimizedRouter);

/**
 * Hook pour optimiser la navigation
 */
export const useOptimizedNavigation = () => {
  const preloadRoute = async (route) => {
    const routeComponentMap = {
      '/catalog/nieuwkoop': NieuwkoopPage,
      '/finance/accounting': ComptabilitePage,
      '/admin': AdminPage,
      '/inventory/stock': StockViewer,
      '/planning/general': PlanningGeneral
    };

    const component = routeComponentMap[route];
    if (component && typeof component.preload === 'function') {
      await component.preload();
    }
  };

  const getRouteStats = () => {
    return performanceRouter.getNavigationStats();
  };

  return {
    preloadRoute,
    getRouteStats,
    getSlowestRoutes: performanceRouter.getSlowestRoutes.bind(performanceRouter)
  };
};

export { optimizedRouter as router };