const ProjectHistory = require('../models/ProjectHistory');
const Projet = require('../models/Projet');
const mongoose = require('mongoose');
const _ = require('lodash');

class HistoryService {
  constructor() {
    this.supportedActions = [
      'create', 'update', 'delete', 'restore',
      'status_change', 'team_change',
      'task_add', 'task_update', 'task_delete',
      'milestone_add', 'milestone_update', 'milestone_delete',
      'material_add', 'material_update', 'material_delete',
      'expense_add', 'expense_update', 'expense_delete',
      'document_add', 'document_delete',
      'bulk_update', 'import', 'export'
    ];
  }

  /**
   * Enregistrer un changement simple (propriété)
   */
  async recordPropertyChange(projectId, field, oldValue, newValue, userId, options = {}) {
    try {
      const changes = {
        properties: [{
          field: field,
          fieldPath: options.fieldPath || field,
          oldValue,
          newValue,
          dataType: this.detectDataType(newValue)
        }],
        arrays: [],
        metadata: options.metadata || {}
      };

      const actionData = {
        action: options.action || 'update',
        changeType: 'property',
        changes,
        context: {
          entityType: 'project',
          entityId: projectId,
          source: options.source || 'manual',
          ...options.context
        },
        description: options.description || `Modification: ${field}`,
        session: options.session,
        canUndo: options.canUndo !== false,
        retentionPolicy: options.retentionPolicy
      };

      return await ProjectHistory.recordChange(projectId, actionData, userId);
    } catch (error) {
      console.error('Error recording property change:', error);
      throw error;
    }
  }

  /**
   * Enregistrer un changement dans un tableau
   */
  async recordArrayChange(projectId, arrayPath, operation, itemData, userId, options = {}) {
    try {
      const changes = {
        properties: [],
        arrays: [{
          operation,
          index: options.index,
          itemId: options.itemId,
          oldValue: options.oldValue,
          newValue: options.newValue || itemData,
          arrayPath
        }],
        metadata: options.metadata || {}
      };

      const actionData = {
        action: options.action || this.getArrayAction(arrayPath, operation),
        changeType: 'array',
        changes,
        context: {
          entityType: options.entityType || arrayPath.slice(0, -1), // "tasks" -> "task"
          entityId: options.itemId,
          entityName: options.entityName,
          source: options.source || 'manual',
          ...options.context
        },
        description: options.description || this.generateArrayDescription(arrayPath, operation, options.entityName),
        session: options.session,
        canUndo: options.canUndo !== false,
        retentionPolicy: options.retentionPolicy
      };

      return await ProjectHistory.recordChange(projectId, actionData, userId);
    } catch (error) {
      console.error('Error recording array change:', error);
      throw error;
    }
  }

  /**
   * Enregistrer un changement complexe avec snapshot
   */
  async recordComplexChange(projectId, beforeSnapshot, afterSnapshot, userId, options = {}) {
    try {
      const diff = this.generateDiff(beforeSnapshot, afterSnapshot);

      const actionData = {
        action: options.action || 'update',
        changeType: 'complex',
        changes: diff,
        context: {
          entityType: 'project',
          entityId: projectId,
          source: options.source || 'manual',
          ...options.context
        },
        description: options.description || 'Modification complexe',
        snapshot: {
          before: beforeSnapshot,
          after: afterSnapshot
        },
        session: options.session,
        canUndo: options.canUndo !== false,
        retentionPolicy: options.retentionPolicy || 'extended' // Complex changes gardés plus longtemps
      };

      return await ProjectHistory.recordChange(projectId, actionData, userId);
    } catch (error) {
      console.error('Error recording complex change:', error);
      throw error;
    }
  }

  /**
   * Enregistrer plusieurs changements en lot
   */
  async recordBulkChanges(projectId, actions, userId, sessionInfo = {}) {
    try {
      return await ProjectHistory.createBatchHistory(projectId, actions, userId, sessionInfo);
    } catch (error) {
      console.error('Error recording bulk changes:', error);
      throw error;
    }
  }

  /**
   * Annuler une action (UNDO)
   */
  async undoAction(historyId, userId) {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const historyEntry = await ProjectHistory.findById(historyId).session(session);

        if (!historyEntry) {
          throw new Error('Entrée d\'historique non trouvée');
        }

        if (!historyEntry.canUndo || historyEntry.undoRedoInfo.isUndone) {
          throw new Error('Cette action ne peut pas être annulée');
        }

        // Vérifier les permissions
        if (historyEntry.performedBy.toString() !== userId && !await this.isAdmin(userId)) {
          throw new Error('Seul l\'auteur de l\'action ou un admin peut l\'annuler');
        }

        const project = await Projet.findById(historyEntry.project).session(session);
        if (!project) {
          throw new Error('Projet non trouvé');
        }

        // Appliquer les changements inverses
        await this.applyChanges(project, historyEntry.createUndoData(), session);

        // Marquer comme annulé
        historyEntry.undoRedoInfo.isUndone = true;
        historyEntry.undoRedoInfo.undoneAt = new Date();
        historyEntry.undoRedoInfo.undoneBy = userId;
        historyEntry.undoRedoInfo.undoCount += 1;
        historyEntry.canRedo = true;

        await historyEntry.save({ session });

        // Créer une entrée d'historique pour l'annulation
        const undoActionData = {
          action: 'undo_' + historyEntry.action,
          changeType: historyEntry.changeType,
          changes: historyEntry.createUndoData(),
          context: {
            ...historyEntry.context,
            source: 'undo',
            originalHistoryId: historyEntry._id
          },
          description: `Annulation: ${historyEntry.description}`,
          canUndo: false, // Les undos ne peuvent pas être annulés directement
          retentionPolicy: 'extended'
        };

        const undoHistory = await ProjectHistory.recordChange(
          historyEntry.project,
          undoActionData,
          userId
        );

        // Référence croisée
        historyEntry.undoRedoInfo.relatedHistoryId = undoHistory._id;
        await historyEntry.save({ session });

        return { original: historyEntry, undo: undoHistory };
      });
    } catch (error) {
      console.error('Error undoing action:', error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Refaire une action annulée (REDO)
   */
  async redoAction(historyId, userId) {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const historyEntry = await ProjectHistory.findById(historyId).session(session);

        if (!historyEntry) {
          throw new Error('Entrée d\'historique non trouvée');
        }

        if (!historyEntry.canRedo || !historyEntry.undoRedoInfo.isUndone) {
          throw new Error('Cette action ne peut pas être refaite');
        }

        // Vérifier les permissions
        if (historyEntry.performedBy.toString() !== userId && !await this.isAdmin(userId)) {
          throw new Error('Seul l\'auteur de l\'action ou un admin peut la refaire');
        }

        const project = await Projet.findById(historyEntry.project).session(session);
        if (!project) {
          throw new Error('Projet non trouvé');
        }

        // Réappliquer les changements originaux
        await this.applyChanges(project, historyEntry.changes, session);

        // Marquer comme refait
        historyEntry.undoRedoInfo.isUndone = false;
        historyEntry.undoRedoInfo.redoneAt = new Date();
        historyEntry.undoRedoInfo.redoneBy = userId;
        historyEntry.canRedo = false;

        await historyEntry.save({ session });

        // Créer une entrée d'historique pour le redo
        const redoActionData = {
          action: 'redo_' + historyEntry.action.replace('undo_', ''),
          changeType: historyEntry.changeType,
          changes: historyEntry.changes,
          context: {
            ...historyEntry.context,
            source: 'redo',
            originalHistoryId: historyEntry._id
          },
          description: `Refaire: ${historyEntry.description}`,
          canUndo: false,
          retentionPolicy: 'extended'
        };

        const redoHistory = await ProjectHistory.recordChange(
          historyEntry.project,
          redoActionData,
          userId
        );

        return { original: historyEntry, redo: redoHistory };
      });
    } catch (error) {
      console.error('Error redoing action:', error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Annuler un lot d'actions
   */
  async undoBatch(batchId, userId) {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const batchEntries = await ProjectHistory.find({
          'context.batchId': batchId,
          canUndo: true,
          'undoRedoInfo.isUndone': false
        }).session(session).sort({ createdAt: -1 }); // Ordre inverse

        if (batchEntries.length === 0) {
          throw new Error('Aucune action annulable trouvée dans ce lot');
        }

        const results = [];
        for (const entry of batchEntries) {
          const result = await this.undoAction(entry._id, userId);
          results.push(result);
        }

        return results;
      });
    } catch (error) {
      console.error('Error undoing batch:', error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Restaurer un projet à un point dans le temps
   */
  async restoreToPoint(projectId, targetDate, userId) {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const project = await Projet.findById(projectId).session(session);
        if (!project) {
          throw new Error('Projet non trouvé');
        }

        // Vérifier les permissions
        if (!await this.canRestoreProject(userId, project)) {
          throw new Error('Permissions insuffisantes pour restaurer le projet');
        }

        // Récupérer toutes les actions après la date cible
        const actionsToRevert = await ProjectHistory.find({
          project: projectId,
          createdAt: { $gt: new Date(targetDate) },
          canUndo: true,
          'undoRedoInfo.isUndone': false
        }).sort({ createdAt: -1 }).session(session);

        // Créer un snapshot avant restauration
        const beforeSnapshot = project.toObject();

        // Annuler toutes les actions dans l'ordre inverse
        for (const action of actionsToRevert) {
          await this.applyChanges(project, action.createUndoData(), session);

          // Marquer comme annulé
          action.undoRedoInfo.isUndone = true;
          action.undoRedoInfo.undoneAt = new Date();
          action.undoRedoInfo.undoneBy = userId;
          await action.save({ session });
        }

        await project.save({ session });

        // Enregistrer la restauration
        const restoreActionData = {
          action: 'restore',
          changeType: 'complex',
          changes: { properties: [], arrays: [], metadata: { targetDate, actionsReverted: actionsToRevert.length } },
          context: {
            entityType: 'project',
            entityId: projectId,
            source: 'restore'
          },
          description: `Restauration au ${new Date(targetDate).toLocaleString('fr-FR')}`,
          snapshot: {
            before: beforeSnapshot,
            after: project.toObject()
          },
          canUndo: true,
          retentionPolicy: 'permanent'
        };

        const restoreHistory = await ProjectHistory.recordChange(projectId, restoreActionData, userId);

        return {
          project,
          actionsReverted: actionsToRevert.length,
          restoreHistory
        };
      });
    } catch (error) {
      console.error('Error restoring to point:', error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Appliquer des changements à un projet
   */
  async applyChanges(project, changes, session = null) {
    try {
      // Appliquer les changements de propriétés
      for (const propertyChange of changes.properties || []) {
        const fieldPath = propertyChange.fieldPath || propertyChange.field;
        this.setNestedProperty(project, fieldPath, propertyChange.newValue);
      }

      // Appliquer les changements de tableaux
      for (const arrayChange of changes.arrays || []) {
        await this.applyArrayChange(project, arrayChange);
      }

      // Sauvegarder si session fournie
      if (session) {
        await project.save({ session });
      }

      return project;
    } catch (error) {
      console.error('Error applying changes:', error);
      throw error;
    }
  }

  /**
   * Appliquer un changement de tableau
   */
  async applyArrayChange(project, arrayChange) {
    const array = this.getNestedProperty(project, arrayChange.arrayPath);

    if (!Array.isArray(array)) {
      throw new Error(`Propriété ${arrayChange.arrayPath} n'est pas un tableau`);
    }

    switch (arrayChange.operation) {
      case 'add':
        if (arrayChange.index !== undefined) {
          array.splice(arrayChange.index, 0, arrayChange.newValue);
        } else {
          array.push(arrayChange.newValue);
        }
        break;

      case 'remove':
        if (arrayChange.itemId) {
          const index = array.findIndex(item => item._id?.toString() === arrayChange.itemId.toString());
          if (index >= 0) array.splice(index, 1);
        } else if (arrayChange.index !== undefined) {
          array.splice(arrayChange.index, 1);
        }
        break;

      case 'update':
        if (arrayChange.itemId) {
          const index = array.findIndex(item => item._id?.toString() === arrayChange.itemId.toString());
          if (index >= 0) array[index] = arrayChange.newValue;
        } else if (arrayChange.index !== undefined) {
          array[arrayChange.index] = arrayChange.newValue;
        }
        break;

      case 'move':
        if (arrayChange.index !== undefined && arrayChange.newValue !== undefined) {
          const item = array.splice(arrayChange.index, 1)[0];
          array.splice(arrayChange.newValue, 0, item);
        }
        break;

      case 'replace':
        if (arrayChange.newValue && Array.isArray(arrayChange.newValue)) {
          array.splice(0, array.length, ...arrayChange.newValue);
        }
        break;

      default:
        throw new Error(`Opération de tableau non supportée: ${arrayChange.operation}`);
    }
  }

  /**
   * Générer un diff entre deux objets
   */
  generateDiff(before, after) {
    const changes = {
      properties: [],
      arrays: [],
      metadata: {}
    };

    const diff = this.deepDiff(before, after);

    for (const [path, change] of Object.entries(diff)) {
      if (Array.isArray(change.newValue)) {
        // Changement de tableau
        changes.arrays.push({
          operation: 'replace',
          arrayPath: path,
          oldValue: change.oldValue,
          newValue: change.newValue
        });
      } else {
        // Changement de propriété
        changes.properties.push({
          field: path.split('.').pop(),
          fieldPath: path,
          oldValue: change.oldValue,
          newValue: change.newValue,
          dataType: this.detectDataType(change.newValue)
        });
      }
    }

    return changes;
  }

  /**
   * Comparaison profonde entre deux objets
   */
  deepDiff(obj1, obj2, path = '') {
    const diff = {};

    const allKeys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);

    for (const key of allKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      const val1 = obj1?.[key];
      const val2 = obj2?.[key];

      if (!_.isEqual(val1, val2)) {
        if (_.isObject(val1) && _.isObject(val2) && !Array.isArray(val1) && !Array.isArray(val2)) {
          // Récursion pour les objets
          Object.assign(diff, this.deepDiff(val1, val2, currentPath));
        } else {
          // Différence trouvée
          diff[currentPath] = {
            oldValue: val1,
            newValue: val2
          };
        }
      }
    }

    return diff;
  }

  // Méthodes utilitaires

  detectDataType(value) {
    if (value === null || value === undefined) return 'object';
    if (Array.isArray(value)) return 'array';
    if (value instanceof Date) return 'date';
    return typeof value;
  }

  getArrayAction(arrayPath, operation) {
    const entityType = arrayPath.replace(/s$/, ''); // "tasks" -> "task"
    const actionMap = {
      'add': `${entityType}_add`,
      'remove': `${entityType}_delete`,
      'update': `${entityType}_update`
    };
    return actionMap[operation] || 'update';
  }

  generateArrayDescription(arrayPath, operation, entityName = '') {
    const operationLabels = {
      'add': 'Ajout',
      'remove': 'Suppression',
      'update': 'Modification',
      'move': 'Déplacement',
      'replace': 'Remplacement'
    };

    const entityLabels = {
      'tasks': 'tâche',
      'milestones': 'jalon',
      'materials': 'matériau',
      'expenses': 'dépense',
      'documents': 'document'
    };

    const operation_label = operationLabels[operation] || operation;
    const entity_label = entityLabels[arrayPath] || arrayPath;

    return `${operation_label} ${entity_label}${entityName ? `: ${entityName}` : ''}`;
  }

  setNestedProperty(obj, path, value) {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
  }

  getNestedProperty(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  async isAdmin(userId) {
    // Implémentation selon votre système d'autorisation
    const User = mongoose.model('User');
    const user = await User.findById(userId);
    return user?.role === 'admin';
  }

  async canRestoreProject(userId, project) {
    // Vérifier si l'utilisateur peut restaurer ce projet
    const isAdmin = await this.isAdmin(userId);
    const isProjectManager = project.team?.projectManager?.toString() === userId;

    return isAdmin || isProjectManager;
  }

  /**
   * Nettoyer l'historique expiré
   */
  async cleanupExpiredHistory() {
    return await ProjectHistory.cleanupExpiredHistory();
  }

  /**
   * Statistiques d'utilisation
   */
  async getUsageStats(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await ProjectHistory.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalActions: { $sum: 1 },
          totalUndos: {
            $sum: { $cond: ['$undoRedoInfo.isUndone', 1, 0] }
          },
          totalRedos: {
            $sum: '$undoRedoInfo.undoCount'
          },
          byAction: {
            $push: { k: '$action', v: 1 }
          },
          avgRetentionDays: {
            $avg: {
              $divide: [
                { $subtract: ['$expiresAt', '$createdAt'] },
                1000 * 60 * 60 * 24
              ]
            }
          }
        }
      }
    ]);
  }
}

module.exports = new HistoryService();