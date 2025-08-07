import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Configuration du client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Temps avant qu'une requête soit considérée comme stale (5 minutes)
      staleTime: 1000 * 60 * 5,
      // Temps avant qu'une requête soit mise en cache (10 minutes)
      cacheTime: 1000 * 60 * 10,
      // Retry automatique en cas d'erreur
      retry: (failureCount, error) => {
        // Ne pas retry pour les erreurs 4xx (erreurs client)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry maximum 3 fois pour les autres erreurs
        return failureCount < 3;
      },
      // Délai entre les retries (exponentiel)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch automatique quand la fenêtre reprend le focus
      refetchOnWindowFocus: false,
      // Refetch automatique quand la connexion est rétablie
      refetchOnReconnect: true,
      // Afficher les erreurs dans la console
      onError: (error) => {
        console.error('Query error:', error);
      }
    },
    mutations: {
      // Retry automatique pour les mutations en cas d'erreur réseau
      retry: (failureCount, error) => {
        // Ne retry que pour les erreurs réseau ou serveur (5xx)
        if (error?.response?.status >= 500 || !error?.response) {
          return failureCount < 2;
        }
        return false;
      },
      // Afficher les erreurs de mutation dans la console
      onError: (error) => {
        console.error('Mutation error:', error);
      }
    }
  }
});

const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools React Query - uniquement en développement */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom-right"
          toggleButtonProps={{
            style: {
              marginLeft: '5px',
              transform: undefined,
              width: '30px',
              height: '30px'
            }
          }}
        />
      )}
    </QueryClientProvider>
  );
};

export default QueryProvider;