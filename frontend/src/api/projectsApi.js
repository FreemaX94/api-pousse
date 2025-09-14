// API pour les nouvelles fonctionnalités des projets
import axios from './axios';

/**
 * API pour l'historique des projets
 */
export const historyApi = {
  // Récupérer l'historique d'un projet
  async getProjectHistory(projectId, options = {}) {
    const params = new URLSearchParams(options);
    const response = await axios.get(`/api/projects/history/${projectId}?${params}`);
    return response.data;
  },

  // Récupérer les statistiques d'historique
  async getHistoryStats(projectId) {
    const response = await axios.get(`/api/projects/history/${projectId}/stats`);
    return response.data;
  },

  // Rechercher dans l'historique
  async searchHistory(projectId, searchTerm, options = {}) {
    const params = new URLSearchParams({ ...options, search: searchTerm });
    const response = await axios.get(`/api/projects/history/${projectId}/search?${params}`);
    return response.data;
  },

  // Récupérer les actions annulables
  async getUndoableActions(projectId, userId, limit = 10) {
    const response = await axios.get(`/api/projects/history/user/${userId}/undoable?projectId=${projectId}&limit=${limit}`);
    return response.data;
  },

  // Annuler une action
  async undoAction(historyId, reason = '') {
    const response = await axios.put(`/api/projects/history/${historyId}/undo`, { reason });
    return response.data;
  },

  // Refaire une action
  async redoAction(historyId, reason = '') {
    const response = await axios.put(`/api/projects/history/${historyId}/redo`, { reason });
    return response.data;
  }
};

/**
 * API pour les templates de projets
 */
export const templatesApi = {
  // Récupérer tous les templates
  async getAllTemplates(options = {}) {
    const params = new URLSearchParams(options);
    const response = await axios.get(`/api/projects/templates?${params}`);
    return response.data;
  },

  // Récupérer les templates populaires
  async getPopularTemplates(limit = 10) {
    const response = await axios.get(`/api/projects/templates/popular?limit=${limit}`);
    return response.data;
  },

  // Récupérer un template spécifique
  async getTemplate(templateId) {
    const response = await axios.get(`/api/projects/templates/${templateId}`);
    return response.data;
  },

  // Récupérer les templates par catégorie
  async getTemplatesByCategory(category) {
    const response = await axios.get(`/api/projects/templates/category/${category}`);
    return response.data;
  },

  // Créer un nouveau template
  async createTemplate(templateData) {
    const response = await axios.post('/api/projects/templates', templateData);
    return response.data;
  },

  // Créer un projet depuis un template
  async createProjectFromTemplate(templateId, projectData = {}) {
    const response = await axios.post(`/api/projects/templates/${templateId}/use`, projectData);
    return response.data;
  },

  // Dupliquer un template
  async duplicateTemplate(templateId, newName) {
    const response = await axios.post(`/api/projects/templates/${templateId}/duplicate`, { name: newName });
    return response.data;
  },

  // Mettre à jour un template
  async updateTemplate(templateId, templateData) {
    const response = await axios.put(`/api/projects/templates/${templateId}`, templateData);
    return response.data;
  },

  // Supprimer un template
  async deleteTemplate(templateId) {
    const response = await axios.delete(`/api/projects/templates/${templateId}`);
    return response.data;
  },

  // Récupérer les statistiques des templates
  async getTemplateStats() {
    const response = await axios.get('/api/projects/templates/stats');
    return response.data;
  }
};

/**
 * API pour l'export des projets
 */
export const exportApi = {
  // Exporter un projet en PDF
  async exportProjectToPDF(projectId) {
    const response = await axios.get(`/api/projects/exports/pdf/${projectId}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Exporter un projet en Excel
  async exportProjectToExcel(projectId) {
    const response = await axios.get(`/api/projects/exports/excel/${projectId}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Exporter plusieurs projets en PDF (ZIP)
  async exportMultipleProjectsToPDF(projectIds) {
    const response = await axios.post('/api/projects/exports/bulk/pdf',
      { projectIds },
      { responseType: 'blob' }
    );
    return response.data;
  },

  // Exporter plusieurs projets en Excel
  async exportMultipleProjectsToExcel(projectIds) {
    const response = await axios.post('/api/projects/exports/bulk/excel',
      { projectIds },
      { responseType: 'blob' }
    );
    return response.data;
  },

  // Exporter l'historique d'un projet en PDF
  async exportProjectHistoryToPDF(projectId) {
    const response = await axios.get(`/api/projects/exports/history/${projectId}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

/**
 * API pour les commentaires des projets
 */
export const commentsApi = {
  // Récupérer les commentaires d'un projet
  async getProjectComments(projectId) {
    const response = await axios.get(`/api/projects/comments/${projectId}`);
    return response.data;
  },

  // Ajouter un commentaire à un projet
  async addComment(projectId, content, attachments = []) {
    const response = await axios.post(`/api/projects/comments/${projectId}`, {
      content,
      attachments
    });
    return response.data;
  },

  // Modifier un commentaire
  async updateComment(commentId, content) {
    const response = await axios.put(`/api/projects/comments/comment/${commentId}`, {
      content
    });
    return response.data;
  },

  // Supprimer un commentaire
  async deleteComment(commentId) {
    const response = await axios.delete(`/api/projects/comments/comment/${commentId}`);
    return response.data;
  },

  // Répondre à un commentaire
  async replyToComment(commentId, content) {
    const response = await axios.post(`/api/projects/comments/comment/${commentId}/reply`, {
      content
    });
    return response.data;
  },

  // Récupérer les commentaires récents d'un utilisateur
  async getRecentComments(userId, limit = 10) {
    const response = await axios.get(`/api/projects/comments/recent/${userId}?limit=${limit}`);
    return response.data;
  }
};

/**
 * Utilitaires pour les exports
 */
export const exportUtils = {
  // Télécharger un blob comme fichier
  downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Exporter un projet en PDF et le télécharger
  async downloadProjectPDF(projectId, filename) {
    try {
      const blob = await exportApi.exportProjectToPDF(projectId);
      this.downloadBlob(blob, filename || `projet-${projectId}.pdf`);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      throw error;
    }
  },

  // Exporter un projet en Excel et le télécharger
  async downloadProjectExcel(projectId, filename) {
    try {
      const blob = await exportApi.exportProjectToExcel(projectId);
      this.downloadBlob(blob, filename || `projet-${projectId}.xlsx`);
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      throw error;
    }
  }
};

export default {
  historyApi,
  templatesApi,
  exportApi,
  commentsApi,
  exportUtils
};