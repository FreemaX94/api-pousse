import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoadingFallback from '../components/LoadingFallback';

// Import du système optimisé temporairement désactivé
// import { optimizedRouter } from './optimized';

// Test components - gardés en import statique (légers)
import TestHome from '../TestHome';
import SimpleHome from '../SimpleHome';
import Home from '../Home';

// Auth pages - import statique (critiques pour première visite)
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import ActivationPage from '../pages/ActivationPage';

// Temporairement désactivé - utilisation lazy loading standard 
// import { NieuwkoopPage, ComptabilitePage, VehiculesPage, EntretienPage, MouvementsPage, LivraisonListPage, CatalogueAdmin, createLazyComponent } from '../utils/lazy';

// Pages lourdes - Lazy loading standard (revenir à la config qui fonctionnait)
const Nieuwkoop = lazy(() => import('../pages/Nieuwkoop'));
const Composition = lazy(() => import('../pages/CompositionCSS'));
const LivraisonList = lazy(() => import('../pages/LivraisonList'));
const Entretien = lazy(() => import('../pages/Entretien'));
const AddClientPage = lazy(() => import('../pages/AddClientPage'));
const AddAddressPage = lazy(() => import('../pages/AddAddressPage'));

// Pages moyennes - Lazy loading
const Evenements = lazy(() => import('../pages/Evenements'));
const Vehicules = lazy(() => import('../pages/Vehicules'));
const Comptabilite = lazy(() => import('../pages/Comptabilite'));
const Mouvements = lazy(() => import('../pages/Mouvements'));
const CatalogueAdmin = lazy(() => import('../pages/CatalogueAdmin'));

// Pages légères - import statique (rapides à charger)
import Creation from '../pages/Creation';
import Depot from '../pages/Depot';
import AddContract from '../pages/AddContract';
import Statistiques from '../pages/Statistiques';
import Parametres from '../pages/Parametres';

// Layout imports
import MainLayout from '../layouts/MainLayout';
import PrivateRoute from '../features/auth/components/PrivateRoute';
import AuthRedirect from '../components/AuthRedirect';
import ErrorBoundary from '../components/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthRedirect />,
    errorElement: <ErrorBoundary />
  },
  // Auth routes - all under /app
  {
    path: '/app/login',
    element: <Login />
  },
  {
    path: '/app/signup',
    element: <Signup />
  },
  {
    path: '/app/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/app/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/app/activate/:token',
    element: <ActivationPage />
  },
  // Redirections pour compatibilité - auth pages
  {
    path: '/login',
    element: <Navigate to="/app/login" replace />
  },
  {
    path: '/signup',
    element: <Navigate to="/app/signup" replace />
  },
  {
    path: '/forgot-password',
    element: <Navigate to="/app/forgot-password" replace />
  },
  {
    path: '/reset-password',
    element: <Navigate to="/app/reset-password" replace />
  },
  {
    path: '/activate/:token',
    element: <Navigate to="/app/activate/:token" replace />
  },
  // Redirections pour compatibilité - app pages
  {
    path: '/home',
    element: <Navigate to="/app/home" replace />
  },
  {
    path: '/evenements',
    element: <Navigate to="/app/evenements" replace />
  },
  {
    path: '/creation',
    element: <Navigate to="/app/creation" replace />
  },
  {
    path: '/entretien',
    element: <Navigate to="/app/entretien" replace />
  },
  {
    path: '/depot',
    element: <Navigate to="/app/depot" replace />
  },
  {
    path: '/livraisons',
    element: <Navigate to="/app/livraisons" replace />
  },
  {
    path: '/vehicules',
    element: <Navigate to="/app/vehicules" replace />
  },
  {
    path: '/nieuwkoop',
    element: <Navigate to="/app/nieuwkoop" replace />
  },
  {
    path: '/statistiques',
    element: <Navigate to="/app/statistiques" replace />
  },
  {
    path: '/parametres',
    element: <Navigate to="/app/parametres" replace />
  },
  {
    path: '/comptabilite',
    element: <Navigate to="/app/comptabilite" replace />
  },
  {
    path: '/mouvements',
    element: <Navigate to="/app/mouvements" replace />
  },
  {
    path: '/contrats',
    element: <Navigate to="/app/contrats" replace />
  },
  {
    path: '/catalogue',
    element: <Navigate to="/app/catalogue" replace />
  },
  {
    path: '/add-client',
    element: <Navigate to="/app/add-client" replace />
  },
  {
    path: '/add-address',
    element: <Navigate to="/app/add-address" replace />
  },
  {
    path: '/test',
    element: <TestHome />
  },
  {
    path: '/app',
    element: <PrivateRoute><MainLayout /></PrivateRoute>,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'evenements',
        element: (
          <Suspense fallback={<LoadingFallback message="Chargement des événements..." />}>
            <Evenements />
          </Suspense>
        )
      },
      {
        path: 'creation',
        element: <Creation />
      },
      {
        path: 'depot',
        element: <Depot />
      },
      {
        path: 'mouvements',
        element: (
          <Suspense fallback={<LoadingFallback message="Chargement des mouvements..." />}>
            <Mouvements />
          </Suspense>
        )
      },
      {
        path: 'livraisons',
        element: (
          <Suspense fallback={<LoadingFallback message="Chargement des livraisons..." />}>
            <LivraisonList />
          </Suspense>
        )
      },
      {
        path: 'vehicules',
        element: (
          <Suspense fallback={<LoadingFallback message="Chargement des véhicules..." />}>
            <Vehicules />
          </Suspense>
        )
      },
      {
        path: 'comptabilite',
        element: (
          <Suspense fallback={<LoadingFallback message="Chargement de la comptabilité..." />}>
            <Comptabilite />
          </Suspense>
        )
      },
      {
        path: 'contrats',
        element: <AddContract />
      },
      {
        path: 'statistiques',
        element: <Statistiques />
      },
      {
        path: 'nieuwkoop',
        element: (
          <Suspense fallback={<LoadingFallback message="Chargement du catalogue Nieuwkoop..." />}>
            <Nieuwkoop />
          </Suspense>
        )
      },
      {
        path: 'catalogue',
        element: (
          <Suspense fallback={<LoadingFallback message="Chargement du catalogue..." />}>
            <CatalogueAdmin />
          </Suspense>
        )
      },
      {
        path: 'parametres',
        element: <Parametres />
      },
      {
        path: 'entretien',
        element: (
          <Suspense fallback={<LoadingFallback message="Chargement de l'entretien..." />}>
            <Entretien />
          </Suspense>
        )
      },
      {
        path: 'add-client',
        element: (
          <Suspense fallback={<LoadingFallback message="Chargement du formulaire client..." />}>
            <AddClientPage />
          </Suspense>
        )
      },
      {
        path: 'add-address',
        element: (
          <Suspense fallback={<LoadingFallback message="Chargement du formulaire adresse..." />}>
            <AddAddressPage />
          </Suspense>
        )
      },
      {
        path: 'composition',
        element: (
          <Suspense fallback={<LoadingFallback message="Chargement du compositeur 3D..." />}>
            <Composition />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '*',
    element: <ErrorBoundary error={{ status: 404 }} />
  }
]);