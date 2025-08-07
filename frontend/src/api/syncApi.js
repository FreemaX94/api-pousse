import apiClient from './clientApi';

// Upload d'un fichier Excel
export const uploadExcelFile = async (formData) => {
  try {
    const response = await apiClient.post('/sync/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Déclencher automatiquement la synchronisation Excel après upload
    const syncResponse = await apiClient.post('/sync/sync-excel');
    return syncResponse.data;
  } catch (error) {
    console.error('❌ Erreur upload Excel:', error);
    throw new Error(error.response?.data?.message || 'Erreur lors de l\'upload du fichier');
  }
};

// Déclencher une synchronisation manuelle intelligente
export const triggerSync = async () => {
  try {
    const response = await apiClient.post('/sync/trigger');
    return response.data;
  } catch (error) {
    console.error('❌ Erreur synchronisation:', error);
    throw new Error(error.response?.data?.message || 'Erreur lors de la synchronisation');
  }
};

// Obtenir le statut de synchronisation
export const getSyncStatus = async () => {
  try {
    const response = await apiClient.get('/sync/status');
    return response.data;
  } catch (error) {
    console.error('❌ Erreur statut sync:', error);
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du statut');
  }
};

// Configurer la synchronisation
export const configureSyncSettings = async (settings) => {
  try {
    const response = await apiClient.post('/sync/configure', settings);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur configuration sync:', error);
    throw new Error(error.response?.data?.message || 'Erreur lors de la configuration');
  }
};