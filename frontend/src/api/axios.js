// Centralisation de l'instance Axios configurée
// Ce fichier réexporte l'instance API depuis utils/auth.js pour une utilisation plus simple

import { api } from '../utils/auth';

export default api;

// Export nommé pour faciliter les imports
export { api };

// Helper pour gérer les erreurs de manière cohérente
export const handleApiError = (error) => {
  if (error.response) {
    // Le serveur a répondu avec un code d'erreur
    return {
      message: error.response.data.message || error.response.data.error || 'Erreur serveur',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // La requête a été faite mais pas de réponse
    return {
      message: 'Pas de réponse du serveur',
      status: 0
    };
  } else {
    // Erreur lors de la configuration de la requête
    return {
      message: error.message || 'Erreur inconnue',
      status: 0
    };
  }
};