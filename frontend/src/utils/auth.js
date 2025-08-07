import axios from 'axios';

// Configuration API globale
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Variable pour éviter les refreshs multiples simultanés
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Fonction pour rafraîchir le token automatiquement
const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Intercepteur pour gérer les erreurs d'authentification et renouveler automatiquement
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si un refresh est déjà en cours, mettre en queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Tenter de rafraîchir le token
        await refreshToken();
        processQueue(null);
        isRefreshing = false;
        
        // Retenter la requête originale
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Si le refresh échoue, déconnecter seulement maintenant
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Fonction pour vérifier l'authentification
export const checkAuth = async () => {
  try {
    const response = await api.get('/auth/me');
    return { isAuth: true, user: response.data };
  } catch (error) {
    return { isAuth: false, user: null };
  }
};

// Fonction pour déconnecter (seulement en cas d'échec de refresh)
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.log('Erreur lors de la déconnexion:', error);
  } finally {
    // Nettoyer les données locales
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/app/login';
  }
};

// Fonction pour rafraîchir automatiquement le token toutes les 6h
export const setupAutoRefresh = () => {
  // Rafraîchir toutes les 6 heures (avant expiration)
  setInterval(async () => {
    try {
      await refreshToken();
      console.log('Token rafraîchi automatiquement');
    } catch (error) {
      console.log('Erreur lors du rafraîchissement automatique:', error);
    }
  }, 6 * 60 * 60 * 1000); // 6 heures
};

// Configuration simplifiée pour éviter les déconnexions intempestives
export const setupAutoLogout = () => {
  // Marquer la session comme active
  sessionStorage.setItem('sessionActive', 'true');
  
  // Lancer le rafraîchissement automatique
  setupAutoRefresh();
  
  // Déconnexion seulement à la fermeture réelle du navigateur (pas sur refresh)
  window.addEventListener('beforeunload', () => {
    // Ne déconnecter que si ce n'est PAS un rechargement de page
    if (!performance.getEntriesByType('navigation')[0] || 
        performance.getEntriesByType('navigation')[0].type !== 'reload') {
      sessionStorage.removeItem('sessionActive');
    }
  });

  // Gérer la visibilité de la page pour éviter les déconnexions sur changement d'onglet
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Vérifier l'auth quand on revient sur l'onglet
      checkAuth();
    }
  });
};

// Fonction pour maintenir la session active avec un heartbeat léger
export const keepSessionAlive = () => {
  // Ping toutes les 30 minutes pour maintenir la session
  setInterval(async () => {
    try {
      await api.get('/auth/me');
    } catch (error) {
      // Ignorer les erreurs silencieusement, l'intercepteur gérera le refresh
    }
  }, 30 * 60 * 1000); // 30 minutes
};