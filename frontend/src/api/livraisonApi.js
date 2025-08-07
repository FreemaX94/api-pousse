import api from './clientApi';

// Récupérer toutes les livraisons avec pagination et filtres
export const getAllLivraisons = async (params = {}) => {
  try {
    const response = await api.get('/livraisons', { params });
    return response.data;
  } catch (error) {
    console.error('❌ Erreur getAllLivraisons:', error);
    throw error;
  }
};

// Récupérer les statistiques des livraisons
export const getStats = async () => {
  try {
    const response = await api.get('/livraisons/stats');
    return response.data;
  } catch (error) {
    console.error('❌ Erreur getStats:', error);
    throw error;
  }
};

// Récupérer les livraisons par mois
export const getLivraisonsByMonth = async (mois) => {
  try {
    const response = await api.get(`/livraisons/mois/${mois}`);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur getLivraisonsByMonth:', error);
    throw error;
  }
};

// Rechercher des livraisons par client
export const searchByClient = async (client) => {
  try {
    const response = await api.get(`/livraisons/client/${client}`);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur searchByClient:', error);
    throw error;
  }
};

// Récupérer une livraison par ID
export const getLivraisonById = async (id) => {
  try {
    const response = await api.get(`/livraisons/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur getLivraisonById:', error);
    throw error;
  }
};

// Mettre à jour le statut d'une livraison
export const updateLivraisonStatus = async (id, fait) => {
  try {
    const response = await api.put(`/livraisons/${id}/status`, { fait });
    return response.data;
  } catch (error) {
    console.error('❌ Erreur updateLivraisonStatus:', error);
    throw error;
  }
};

// Créer une nouvelle livraison
export const createLivraison = async (livraisonData) => {
  try {
    const response = await api.post('/livraisons', livraisonData);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur createLivraison:', error);
    throw error;
  }
};

// Supprimer une livraison
export const deleteLivraison = async (id) => {
  try {
    const response = await api.delete(`/livraisons/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur deleteLivraison:', error);
    throw error;
  }
};
