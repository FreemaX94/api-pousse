// Hooks React pour les nouvelles API des projets
import { useState, useEffect, useCallback } from 'react';
import { historyApi, templatesApi, exportApi, commentsApi, exportUtils } from '../api/projectsApi';

/**
 * Hook pour gérer l'historique d'un projet
 */
export const useProjectHistory = (projectId, options = {}) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchHistory = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await historyApi.getProjectHistory(projectId, options);
      setHistory(data.history || data);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du chargement de l\'historique:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId, options]);

  const fetchStats = useCallback(async () => {
    if (!projectId) return;

    try {
      const statsData = await historyApi.getHistoryStats(projectId);
      setStats(statsData);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  }, [projectId]);

  const undoAction = useCallback(async (historyId, reason) => {
    try {
      await historyApi.undoAction(historyId, reason);
      await fetchHistory(); // Recharger l'historique
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [fetchHistory]);

  const redoAction = useCallback(async (historyId, reason) => {
    try {
      await historyApi.redoAction(historyId, reason);
      await fetchHistory(); // Recharger l'historique
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [fetchHistory]);

  const searchHistory = useCallback(async (searchTerm) => {
    if (!projectId || !searchTerm) return;

    setLoading(true);
    try {
      const results = await historyApi.searchHistory(projectId, searchTerm);
      setHistory(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, [fetchHistory, fetchStats]);

  return {
    history,
    stats,
    loading,
    error,
    refreshHistory: fetchHistory,
    undoAction,
    redoAction,
    searchHistory
  };
};

/**
 * Hook pour gérer les templates de projets
 */
export const useProjectTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [popularTemplates, setPopularTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchTemplates = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await templatesApi.getAllTemplates(options);
      console.log('useProjectTemplates - API response:', data);

      // Vérifier si la réponse est de l'HTML (API endpoint non implémenté)
      if (typeof data === 'string' && data.includes('<!DOCTYPE html>')) {
        console.warn('Templates API endpoint not implemented - returning HTML instead of JSON');
        setError('Les templates ne sont pas encore disponibles');
        setTemplates([]);
        return;
      }

      const templatesArray = Array.isArray(data) ? data : (Array.isArray(data.templates) ? data.templates : []);
      console.log('useProjectTemplates - final templatesArray:', templatesArray, 'isArray:', Array.isArray(templatesArray));
      setTemplates(templatesArray);
    } catch (err) {
      console.error('Erreur lors du chargement des templates:', err);
      setError(err.message);
      // En cas d'erreur, on s'assure que templates reste un tableau vide
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPopularTemplates = useCallback(async (limit = 10) => {
    try {
      const data = await templatesApi.getPopularTemplates(limit);

      // Vérifier si la réponse est de l'HTML (API endpoint non implémenté)
      if (typeof data === 'string' && data.includes('<!DOCTYPE html>')) {
        console.warn('Popular templates API endpoint not implemented');
        setPopularTemplates([]);
        return;
      }

      const templatesArray = Array.isArray(data) ? data : (Array.isArray(data.templates) ? data.templates : []);
      setPopularTemplates(templatesArray);
    } catch (err) {
      console.error('Erreur lors du chargement des templates populaires:', err);
      setPopularTemplates([]);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await templatesApi.getTemplateStats();
      setStats(statsData);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  }, []);

  const createTemplate = useCallback(async (templateData) => {
    try {
      const newTemplate = await templatesApi.createTemplate(templateData);
      setTemplates(prev => [newTemplate, ...prev]);
      return newTemplate;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const createProjectFromTemplate = useCallback(async (templateId, projectData) => {
    try {
      const project = await templatesApi.createProjectFromTemplate(templateId, projectData);
      return project;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const duplicateTemplate = useCallback(async (templateId, newName) => {
    try {
      const duplicatedTemplate = await templatesApi.duplicateTemplate(templateId, newName);
      setTemplates(prev => [duplicatedTemplate, ...prev]);
      return duplicatedTemplate;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateTemplate = useCallback(async (templateId, templateData) => {
    try {
      const updatedTemplate = await templatesApi.updateTemplate(templateId, templateData);
      setTemplates(prev => prev.map(t => t._id === templateId ? updatedTemplate : t));
      return updatedTemplate;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteTemplate = useCallback(async (templateId) => {
    try {
      await templatesApi.deleteTemplate(templateId);
      setTemplates(prev => prev.filter(t => t._id !== templateId));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
    fetchPopularTemplates();
    fetchStats();
  }, [fetchTemplates, fetchPopularTemplates, fetchStats]);

  return {
    templates,
    popularTemplates,
    stats,
    loading,
    error,
    createTemplate,
    createProjectFromTemplate,
    duplicateTemplate,
    updateTemplate,
    deleteTemplate,
    refreshTemplates: fetchTemplates
  };
};

/**
 * Hook pour gérer les commentaires d'un projet
 */
export const useProjectComments = (projectId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await commentsApi.getProjectComments(projectId);
      setComments(data.comments || data);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du chargement des commentaires:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const addComment = useCallback(async (content, attachments = []) => {
    try {
      const newComment = await commentsApi.addComment(projectId, content, attachments);
      setComments(prev => [newComment, ...prev]);
      return newComment;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [projectId]);

  const updateComment = useCallback(async (commentId, content) => {
    try {
      const updatedComment = await commentsApi.updateComment(commentId, content);
      setComments(prev => prev.map(c => c._id === commentId ? updatedComment : c));
      return updatedComment;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteComment = useCallback(async (commentId) => {
    try {
      await commentsApi.deleteComment(commentId);
      setComments(prev => prev.filter(c => c._id !== commentId));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const replyToComment = useCallback(async (commentId, content) => {
    try {
      const reply = await commentsApi.replyToComment(commentId, content);
      // Mettre à jour le commentaire parent avec la réponse
      setComments(prev => prev.map(c => {
        if (c._id === commentId) {
          return {
            ...c,
            replies: [...(c.replies || []), reply]
          };
        }
        return c;
      }));
      return reply;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
    replyToComment,
    refreshComments: fetchComments
  };
};

/**
 * Hook pour gérer les exports
 */
export const useProjectExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const exportProjectPDF = useCallback(async (projectId, filename) => {
    setLoading(true);
    setError(null);
    try {
      await exportUtils.downloadProjectPDF(projectId, filename);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de l\'export PDF:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const exportProjectExcel = useCallback(async (projectId, filename) => {
    setLoading(true);
    setError(null);
    try {
      await exportUtils.downloadProjectExcel(projectId, filename);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de l\'export Excel:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const exportMultipleProjectsPDF = useCallback(async (projectIds, filename = 'projets.zip') => {
    setLoading(true);
    setError(null);
    try {
      const blob = await exportApi.exportMultipleProjectsToPDF(projectIds);
      exportUtils.downloadBlob(blob, filename);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de l\'export multiple PDF:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const exportProjectHistoryPDF = useCallback(async (projectId, filename) => {
    setLoading(true);
    setError(null);
    try {
      const blob = await exportApi.exportProjectHistoryToPDF(projectId);
      exportUtils.downloadBlob(blob, filename || `historique-${projectId}.pdf`);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de l\'export de l\'historique:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    exportProjectPDF,
    exportProjectExcel,
    exportMultipleProjectsPDF,
    exportProjectHistoryPDF
  };
};