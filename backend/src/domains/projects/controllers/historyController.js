const ProjectHistory = require('../models/ProjectHistory');
const historyService = require('../services/historyService');
const Projet = require('../models/Projet');
const { validationResult } = require('express-validator');

class HistoryController {
  /**
   * Récupérer l'historique d'un projet
   */
  async getProjectHistory(req, res) {
    try {
      const { projectId } = req.params;
      const {
        limit = 50,
        page = 1,
        action,
        performedBy,
        dateFrom,
        dateTo,
        canUndo,
        includeReverted = 'false'
      } = req.query;

      // Vérifier l'accès au projet
      const project = await Projet.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Projet non trouvé' });
      }

      if (!this.canViewHistory(req.user, project)) {
        return res.status(403).json({ error: 'Accès refusé à l\'historique' });
      }

      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        action,
        performedBy,
        dateFrom,
        dateTo,
        canUndo: canUndo === 'true' ? true : canUndo === 'false' ? false : undefined,
        includeReverted: includeReverted === 'true'
      };

      const history = await ProjectHistory.getProjectHistory(projectId, options);
      const total = await ProjectHistory.countDocuments({
        project: projectId,
        ...(options.includeReverted ? {} : { status: { $ne: 'reverted' } })
      });

      res.json({
        history,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      });

    } catch (error) {
      console.error('Error fetching project history:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération de l\'historique',
        details: error.message
      });
    }
  }

  /**
   * Récupérer une entrée d'historique spécifique
   */
  async getHistoryEntry(req, res) {
    try {
      const { historyId } = req.params;

      const historyEntry = await ProjectHistory.findById(historyId)
        .populate('performedBy', 'username email avatar')
        .populate('undoRedoInfo.undoneBy', 'username email')
        .populate('undoRedoInfo.redoneBy', 'username email')
        .populate('project', 'title projectId');

      if (!historyEntry) {
        return res.status(404).json({ error: 'Entrée d\'historique non trouvée' });
      }

      // Vérifier l'accès au projet
      const project = await Projet.findById(historyEntry.project._id);
      if (!this.canViewHistory(req.user, project)) {
        return res.status(403).json({ error: 'Accès refusé' });
      }

      res.json(historyEntry);

    } catch (error) {
      console.error('Error fetching history entry:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération de l\'entrée d\'historique',
        details: error.message
      });
    }
  }

  /**
   * Annuler une action (UNDO)
   */
  async undoAction(req, res) {
    try {
      const { historyId } = req.params;
      const { reason } = req.body;

      const result = await historyService.undoAction(historyId, req.user.id);

      res.json({
        message: 'Action annulée avec succès',
        original: result.original,
        undo: result.undo,
        reason
      });

    } catch (error) {
      console.error('Error undoing action:', error);

      if (error.message.includes('non trouvée') ||
          error.message.includes('ne peut pas être annulée') ||
          error.message.includes('Permissions insuffisantes')) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({
        error: 'Erreur lors de l\'annulation de l\'action',
        details: error.message
      });
    }
  }

  /**
   * Refaire une action annulée (REDO)
   */
  async redoAction(req, res) {
    try {
      const { historyId } = req.params;

      const result = await historyService.redoAction(historyId, req.user.id);

      res.json({
        message: 'Action refaite avec succès',
        original: result.original,
        redo: result.redo
      });

    } catch (error) {
      console.error('Error redoing action:', error);

      if (error.message.includes('non trouvée') ||
          error.message.includes('ne peut pas être refaite') ||
          error.message.includes('Permissions insuffisantes')) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({
        error: 'Erreur lors de la reprise de l\'action',
        details: error.message
      });
    }
  }

  /**
   * Récupérer les actions annulables pour un utilisateur
   */
  async getUndoableActions(req, res) {
    try {
      const { projectId } = req.params;
      const { limit = 10 } = req.query;

      // Vérifier l'accès au projet
      const project = await Projet.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Projet non trouvé' });
      }

      if (!this.canUndoActions(req.user, project)) {
        return res.status(403).json({ error: 'Accès refusé aux actions d\'annulation' });
      }

      const actions = await ProjectHistory.getUndoableActions(
        projectId,
        req.user.id,
        parseInt(limit)
      );

      res.json({
        actions,
        count: actions.length
      });

    } catch (error) {
      console.error('Error fetching undoable actions:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des actions annulables',
        details: error.message
      });
    }
  }

  /**
   * Récupérer les actions refaisables pour un utilisateur
   */
  async getRedoableActions(req, res) {
    try {
      const { projectId } = req.params;
      const { limit = 10 } = req.query;

      const project = await Projet.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Projet non trouvé' });
      }

      if (!this.canUndoActions(req.user, project)) {
        return res.status(403).json({ error: 'Accès refusé aux actions de reprise' });
      }

      const actions = await ProjectHistory.getRedoableActions(
        projectId,
        req.user.id,
        parseInt(limit)
      );

      res.json({
        actions,
        count: actions.length
      });

    } catch (error) {
      console.error('Error fetching redoable actions:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des actions refaisables',
        details: error.message
      });
    }
  }

  /**
   * Annuler un lot d'actions
   */
  async undoBatch(req, res) {
    try {
      const { batchId } = req.params;
      const { reason } = req.body;

      const results = await historyService.undoBatch(batchId, req.user.id);

      res.json({
        message: `${results.length} actions annulées avec succès`,
        results,
        batchId,
        reason
      });

    } catch (error) {
      console.error('Error undoing batch:', error);

      if (error.message.includes('Aucune action annulable')) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({
        error: 'Erreur lors de l\'annulation du lot d\'actions',
        details: error.message
      });
    }
  }

  /**
   * Restaurer un projet à un point dans le temps
   */
  async restoreToPoint(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { projectId } = req.params;
      const { targetDate, confirm = false } = req.body;

      if (!confirm) {
        // Mode aperçu - montrer ce qui sera affecté
        const actionsToRevert = await ProjectHistory.find({
          project: projectId,
          createdAt: { $gt: new Date(targetDate) },
          canUndo: true,
          'undoRedoInfo.isUndone': false
        }).populate('performedBy', 'username').sort({ createdAt: -1 });

        return res.json({
          preview: true,
          targetDate,
          actionsToRevert: actionsToRevert.length,
          actions: actionsToRevert.slice(0, 10), // Afficher les 10 premières
          message: `${actionsToRevert.length} actions seraient annulées. Confirmez avec confirm: true`
        });
      }

      const result = await historyService.restoreToPoint(projectId, targetDate, req.user.id);

      res.json({
        message: 'Projet restauré avec succès',
        targetDate,
        actionsReverted: result.actionsReverted,
        project: result.project,
        restoreHistory: result.restoreHistory
      });

    } catch (error) {
      console.error('Error restoring to point:', error);

      if (error.message.includes('non trouvé') ||
          error.message.includes('Permissions insuffisantes')) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({
        error: 'Erreur lors de la restauration',
        details: error.message
      });
    }
  }

  /**
   * Rechercher dans l'historique
   */
  async searchHistory(req, res) {
    try {
      const { projectId } = req.params;
      const { q: searchTerm, limit = 20 } = req.query;

      if (!searchTerm || searchTerm.trim().length < 2) {
        return res.status(400).json({ error: 'Terme de recherche trop court (min 2 caractères)' });
      }

      const project = await Projet.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Projet non trouvé' });
      }

      if (!this.canViewHistory(req.user, project)) {
        return res.status(403).json({ error: 'Accès refusé à la recherche' });
      }

      const results = await ProjectHistory.searchHistory(
        projectId,
        searchTerm,
        { limit: parseInt(limit) }
      );

      res.json({
        query: searchTerm,
        results,
        count: results.length
      });

    } catch (error) {
      console.error('Error searching history:', error);
      res.status(500).json({
        error: 'Erreur lors de la recherche',
        details: error.message
      });
    }
  }

  /**
   * Récupérer les statistiques d'historique
   */
  async getHistoryStats(req, res) {
    try {
      const { projectId } = req.params;
      const { days = 30 } = req.query;

      const project = await Projet.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Projet non trouvé' });
      }

      if (!this.canViewHistory(req.user, project)) {
        return res.status(403).json({ error: 'Accès refusé aux statistiques' });
      }

      const stats = await ProjectHistory.getHistoryStats(projectId, parseInt(days));

      res.json({
        projectId,
        period: `${days} derniers jours`,
        stats: stats[0] || {
          totalChanges: 0,
          byAction: {},
          byUser: {},
          undoableCount: 0,
          undoneCount: 0
        }
      });

    } catch (error) {
      console.error('Error fetching history stats:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des statistiques',
        details: error.message
      });
    }
  }

  /**
   * Comparer deux versions d'un projet
   */
  async compareVersions(req, res) {
    try {
      const { projectId } = req.params;
      const { fromDate, toDate, historyId1, historyId2 } = req.query;

      const project = await Projet.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Projet non trouvé' });
      }

      if (!this.canViewHistory(req.user, project)) {
        return res.status(403).json({ error: 'Accès refusé à la comparaison' });
      }

      let snapshot1, snapshot2;

      if (historyId1 && historyId2) {
        // Comparaison entre deux entrées d'historique spécifiques
        const history1 = await ProjectHistory.findById(historyId1);
        const history2 = await ProjectHistory.findById(historyId2);

        if (!history1 || !history2) {
          return res.status(404).json({ error: 'Entrées d\'historique non trouvées' });
        }

        snapshot1 = history1.snapshot?.before || history1.snapshot?.after;
        snapshot2 = history2.snapshot?.before || history2.snapshot?.after;
      } else if (fromDate && toDate) {
        // Comparaison entre deux dates
        const historyFrom = await ProjectHistory.findOne({
          project: projectId,
          createdAt: { $lte: new Date(fromDate) }
        }).sort({ createdAt: -1 });

        const historyTo = await ProjectHistory.findOne({
          project: projectId,
          createdAt: { $lte: new Date(toDate) }
        }).sort({ createdAt: -1 });

        snapshot1 = historyFrom?.snapshot?.after;
        snapshot2 = historyTo?.snapshot?.after;
      } else {
        return res.status(400).json({
          error: 'Paramètres requis: (historyId1 et historyId2) ou (fromDate et toDate)'
        });
      }

      if (!snapshot1 || !snapshot2) {
        return res.status(400).json({ error: 'Snapshots non disponibles pour la comparaison' });
      }

      const diff = historyService.generateDiff(snapshot1, snapshot2);

      res.json({
        comparison: {
          from: fromDate || historyId1,
          to: toDate || historyId2,
          differences: diff,
          changesCount: (diff.properties?.length || 0) + (diff.arrays?.length || 0)
        }
      });

    } catch (error) {
      console.error('Error comparing versions:', error);
      res.status(500).json({
        error: 'Erreur lors de la comparaison',
        details: error.message
      });
    }
  }

  /**
   * Exporter l'historique
   */
  async exportHistory(req, res) {
    try {
      const { projectId } = req.params;
      const { format = 'json', dateFrom, dateTo } = req.query;

      const project = await Projet.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Projet non trouvé' });
      }

      if (!this.canViewHistory(req.user, project)) {
        return res.status(403).json({ error: 'Accès refusé à l\'export' });
      }

      const query = { project: projectId };
      if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
        if (dateTo) query.createdAt.$lte = new Date(dateTo);
      }

      const history = await ProjectHistory.find(query)
        .populate('performedBy', 'username email')
        .sort({ createdAt: -1 });

      if (format === 'csv') {
        const csv = this.convertToCSV(history);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="history-${projectId}.csv"`);
        return res.send(csv);
      }

      res.json({
        project: {
          id: project._id,
          title: project.title,
          projectId: project.projectId
        },
        exportDate: new Date(),
        totalEntries: history.length,
        history
      });

    } catch (error) {
      console.error('Error exporting history:', error);
      res.status(500).json({
        error: 'Erreur lors de l\'export',
        details: error.message
      });
    }
  }

  /**
   * Nettoyer l'historique expiré
   */
  async cleanupHistory(req, res) {
    try {
      // Vérifier les permissions admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé - Admin requis' });
      }

      const deletedCount = await historyService.cleanupExpiredHistory();

      res.json({
        message: 'Nettoyage terminé',
        deletedEntries: deletedCount
      });

    } catch (error) {
      console.error('Error cleaning up history:', error);
      res.status(500).json({
        error: 'Erreur lors du nettoyage',
        details: error.message
      });
    }
  }

  /**
   * Statistiques globales d'usage
   */
  async getGlobalUsageStats(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé - Admin requis' });
      }

      const { days = 30 } = req.query;
      const stats = await historyService.getUsageStats(parseInt(days));

      res.json({
        period: `${days} derniers jours`,
        stats: stats[0] || {
          totalActions: 0,
          totalUndos: 0,
          totalRedos: 0,
          byAction: {},
          avgRetentionDays: 0
        }
      });

    } catch (error) {
      console.error('Error fetching usage stats:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des statistiques',
        details: error.message
      });
    }
  }

  // Méthodes utilitaires pour les permissions

  canViewHistory(user, project) {
    // Admin peut tout voir
    if (user.role === 'admin') return true;

    // Chef de projet peut voir l'historique
    if (project.team?.projectManager?.toString() === user.id) return true;

    // Membre de l'équipe peut voir l'historique
    return project.team?.members?.some(member => member.user.toString() === user.id);
  }

  canUndoActions(user, project) {
    // Admin peut annuler
    if (user.role === 'admin') return true;

    // Chef de projet peut annuler ses propres actions
    if (project.team?.projectManager?.toString() === user.id) return true;

    // Les membres peuvent annuler leurs propres actions
    return project.team?.members?.some(member => member.user.toString() === user.id);
  }

  convertToCSV(history) {
    const headers = [
      'Date',
      'Action',
      'Description',
      'Utilisateur',
      'Type de changement',
      'Peut être annulé',
      'Statut'
    ];

    const rows = history.map(entry => [
      entry.createdAt.toISOString(),
      entry.action,
      entry.description,
      entry.performedBy?.username || 'Système',
      entry.changeType,
      entry.canUndo ? 'Oui' : 'Non',
      entry.undoRedoInfo.isUndone ? 'Annulé' : 'Actif'
    ]);

    return [headers, ...rows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');
  }
}

module.exports = new HistoryController();