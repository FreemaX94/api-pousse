const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Schema pour stocker les changements de propriétés
const PropertyChangeSchema = new Schema({
  field: { type: String, required: true },
  fieldPath: String, // Pour les propriétés imbriquées (ex: "dates.start")
  oldValue: Schema.Types.Mixed,
  newValue: Schema.Types.Mixed,
  dataType: {
    type: String,
    enum: ['string', 'number', 'boolean', 'date', 'object', 'array'],
    required: true
  }
});

// Schema pour les changements dans les tableaux
const ArrayChangeSchema = new Schema({
  operation: {
    type: String,
    enum: ['add', 'remove', 'update', 'move', 'replace'],
    required: true
  },
  index: Number, // Position dans le tableau
  itemId: Schema.Types.ObjectId, // ID de l'élément si applicable
  oldValue: Schema.Types.Mixed,
  newValue: Schema.Types.Mixed,
  arrayPath: String // Chemin vers le tableau (ex: "tasks", "materials")
});

// Schema principal pour l'historique des projets
const ProjectHistorySchema = new Schema({
  // Projet concerné
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Projet',
    required: true,
    index: true
  },

  // Information sur l'action
  action: {
    type: String,
    enum: [
      'create', 'update', 'delete', 'restore',
      'status_change', 'team_change', 'task_add', 'task_update', 'task_delete',
      'milestone_add', 'milestone_update', 'milestone_delete',
      'material_add', 'material_update', 'material_delete',
      'expense_add', 'expense_update', 'expense_delete',
      'document_add', 'document_delete',
      'comment_add', 'comment_update', 'comment_delete',
      'bulk_update', 'import', 'export'
    ],
    required: true,
    index: true
  },

  // Type de changement
  changeType: {
    type: String,
    enum: ['property', 'array', 'complex', 'bulk'],
    required: true
  },

  // Détails des changements
  changes: {
    properties: [PropertyChangeSchema], // Changements de propriétés simples
    arrays: [ArrayChangeSchema], // Changements dans les tableaux
    metadata: Schema.Types.Mixed // Métadonnées additionnelles
  },

  // Contexte de l'action
  context: {
    entityType: String, // 'project', 'task', 'milestone', etc.
    entityId: Schema.Types.ObjectId,
    entityName: String,
    batchId: String, // Pour grouper plusieurs changements
    source: {
      type: String,
      enum: ['manual', 'api', 'import', 'scheduled', 'system'],
      default: 'manual'
    }
  },

  // Utilisateur qui a effectué l'action
  performedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Description lisible de l'action
  description: {
    type: String,
    required: true
  },

  // État avant/après pour les actions complexes
  snapshot: {
    before: Schema.Types.Mixed,
    after: Schema.Types.Mixed
  },

  // Informations sur la session
  session: {
    sessionId: String,
    ipAddress: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now }
  },

  // Statut de l'entrée d'historique
  status: {
    type: String,
    enum: ['active', 'reverted', 'superseded'],
    default: 'active',
    index: true
  },

  // Possibilité d'annulation
  canUndo: { type: Boolean, default: true },
  canRedo: { type: Boolean, default: false },

  // Informations sur l'annulation/refaire
  undoRedoInfo: {
    isUndone: { type: Boolean, default: false },
    undoneAt: Date,
    undoneBy: { type: Schema.Types.ObjectId, ref: 'User' },
    redoneAt: Date,
    redoneBy: { type: Schema.Types.ObjectId, ref: 'User' },
    undoCount: { type: Number, default: 0 },
    relatedHistoryId: { type: Schema.Types.ObjectId, ref: 'ProjectHistory' } // Référence croisée undo/redo
  },

  // Contraintes temporelles
  expiresAt: Date, // Pour auto-suppression des anciens historiques
  retentionPolicy: {
    type: String,
    enum: ['standard', 'extended', 'permanent'],
    default: 'standard'
  },

  // Métadonnées
  metadata: {
    version: { type: String, default: '1.0' },
    source: String,
    tags: [String],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    customData: Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes pour optimiser les requêtes
ProjectHistorySchema.index({ project: 1, createdAt: -1 });
ProjectHistorySchema.index({ performedBy: 1, createdAt: -1 });
ProjectHistorySchema.index({ action: 1, changeType: 1 });
ProjectHistorySchema.index({ status: 1, canUndo: 1 });
ProjectHistorySchema.index({ 'context.batchId': 1 });
ProjectHistorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index de recherche textuelle
ProjectHistorySchema.index({
  description: 'text',
  'context.entityName': 'text'
});

// Virtuals
ProjectHistorySchema.virtual('isRecent').get(function() {
  const hoursSinceCreation = (new Date() - this.createdAt) / (1000 * 60 * 60);
  return hoursSinceCreation < 24;
});

ProjectHistorySchema.virtual('canBeReverted').get(function() {
  return this.canUndo && this.status === 'active' && !this.undoRedoInfo.isUndone;
});

ProjectHistorySchema.virtual('changesCount').get(function() {
  return (this.changes.properties?.length || 0) + (this.changes.arrays?.length || 0);
});

// Méthodes d'instance
ProjectHistorySchema.methods.generateDescription = function() {
  const actionDescriptions = {
    'create': 'Création du projet',
    'update': 'Modification du projet',
    'delete': 'Suppression du projet',
    'status_change': `Changement de statut`,
    'team_change': 'Modification de l\'équipe',
    'task_add': 'Ajout d\'une tâche',
    'task_update': 'Modification d\'une tâche',
    'task_delete': 'Suppression d\'une tâche',
    'milestone_add': 'Ajout d\'un jalon',
    'milestone_update': 'Modification d\'un jalon',
    'milestone_delete': 'Suppression d\'un jalon',
    'material_add': 'Ajout de matériau',
    'material_update': 'Modification de matériau',
    'material_delete': 'Suppression de matériau',
    'bulk_update': 'Modification en lot'
  };

  let description = actionDescriptions[this.action] || this.action;

  // Ajouter des détails spécifiques
  if (this.context?.entityName) {
    description += `: ${this.context.entityName}`;
  }

  // Ajouter des détails sur les changements
  if (this.changes.properties?.length > 0) {
    const changedFields = this.changes.properties.map(p => p.field).join(', ');
    description += ` (${changedFields})`;
  }

  return description;
};

ProjectHistorySchema.methods.createUndoData = function() {
  const undoChanges = {
    properties: [],
    arrays: [],
    metadata: { isUndo: true, originalHistoryId: this._id }
  };

  // Inverser les changements de propriétés
  this.changes.properties?.forEach(change => {
    undoChanges.properties.push({
      field: change.field,
      fieldPath: change.fieldPath,
      oldValue: change.newValue, // Inverser
      newValue: change.oldValue, // Inverser
      dataType: change.dataType
    });
  });

  // Inverser les changements de tableaux
  this.changes.arrays?.forEach(change => {
    let undoOperation;
    switch (change.operation) {
      case 'add':
        undoOperation = 'remove';
        break;
      case 'remove':
        undoOperation = 'add';
        break;
      case 'update':
        undoOperation = 'update';
        break;
      case 'move':
        undoOperation = 'move'; // Nécessite des données supplémentaires
        break;
      case 'replace':
        undoOperation = 'replace';
        break;
      default:
        undoOperation = change.operation;
    }

    undoChanges.arrays.push({
      operation: undoOperation,
      index: change.index,
      itemId: change.itemId,
      oldValue: change.newValue, // Inverser
      newValue: change.oldValue, // Inverser
      arrayPath: change.arrayPath
    });
  });

  return undoChanges;
};

// Méthodes statiques
ProjectHistorySchema.statics.recordChange = async function(projectId, actionData, userId) {
  try {
    const historyEntry = new this({
      project: projectId,
      action: actionData.action,
      changeType: actionData.changeType || 'property',
      changes: actionData.changes,
      context: actionData.context,
      performedBy: userId,
      description: actionData.description,
      snapshot: actionData.snapshot,
      session: actionData.session,
      canUndo: actionData.canUndo !== false,
      metadata: actionData.metadata
    });

    // Générer une description automatique si non fournie
    if (!historyEntry.description) {
      historyEntry.description = historyEntry.generateDescription();
    }

    // Définir la politique de rétention
    historyEntry.retentionPolicy = actionData.retentionPolicy || 'standard';
    if (historyEntry.retentionPolicy === 'standard') {
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 6); // 6 mois
      historyEntry.expiresAt = expirationDate;
    }

    await historyEntry.save();
    return historyEntry;
  } catch (error) {
    console.error('Error recording change:', error);
    throw error;
  }
};

ProjectHistorySchema.statics.getProjectHistory = function(projectId, options = {}) {
  const {
    limit = 50,
    page = 1,
    action,
    performedBy,
    dateFrom,
    dateTo,
    canUndo,
    includeReverted = false
  } = options;

  const query = { project: projectId };

  if (action) query.action = action;
  if (performedBy) query.performedBy = performedBy;
  if (canUndo !== undefined) query.canUndo = canUndo;
  if (!includeReverted) query.status = { $ne: 'reverted' };

  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
    if (dateTo) query.createdAt.$lte = new Date(dateTo);
  }

  return this.find(query)
    .populate('performedBy', 'username email avatar')
    .populate('undoRedoInfo.undoneBy', 'username')
    .populate('undoRedoInfo.redoneBy', 'username')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

ProjectHistorySchema.statics.getUndoableActions = function(projectId, userId, limit = 10) {
  return this.find({
    project: projectId,
    performedBy: userId,
    canUndo: true,
    status: 'active',
    'undoRedoInfo.isUndone': false
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('performedBy', 'username');
};

ProjectHistorySchema.statics.getRedoableActions = function(projectId, userId, limit = 10) {
  return this.find({
    project: projectId,
    performedBy: userId,
    canRedo: true,
    status: 'active',
    'undoRedoInfo.isUndone': true
  })
  .sort({ 'undoRedoInfo.undoneAt': -1 })
  .limit(limit)
  .populate('performedBy', 'username');
};

ProjectHistorySchema.statics.searchHistory = function(projectId, searchTerm, options = {}) {
  const { limit = 20 } = options;

  return this.find({
    project: projectId,
    $text: { $search: searchTerm },
    status: { $ne: 'reverted' }
  }, { score: { $meta: 'textScore' } })
  .populate('performedBy', 'username email')
  .sort({ score: { $meta: 'textScore' } })
  .limit(limit);
};

ProjectHistorySchema.statics.getHistoryStats = function(projectId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
        createdAt: { $gte: startDate },
        status: { $ne: 'reverted' }
      }
    },
    {
      $group: {
        _id: null,
        totalChanges: { $sum: 1 },
        byAction: {
          $push: { k: '$action', v: 1 }
        },
        byUser: {
          $push: { k: '$performedBy', v: 1 }
        },
        undoableCount: {
          $sum: { $cond: ['$canUndo', 1, 0] }
        },
        undoneCount: {
          $sum: { $cond: ['$undoRedoInfo.isUndone', 1, 0] }
        }
      }
    }
  ]);
};

ProjectHistorySchema.statics.createBatchHistory = async function(projectId, batchActions, userId, sessionInfo = {}) {
  const batchId = new mongoose.Types.ObjectId().toString();
  const historyEntries = [];

  try {
    for (const actionData of batchActions) {
      const historyEntry = new this({
        project: projectId,
        action: actionData.action,
        changeType: actionData.changeType || 'property',
        changes: actionData.changes,
        context: {
          ...actionData.context,
          batchId,
          source: 'batch'
        },
        performedBy: userId,
        description: actionData.description || `Action en lot: ${actionData.action}`,
        session: sessionInfo,
        canUndo: true,
        metadata: {
          ...actionData.metadata,
          batchSize: batchActions.length
        }
      });

      await historyEntry.save();
      historyEntries.push(historyEntry);
    }

    return { batchId, entries: historyEntries };
  } catch (error) {
    console.error('Error creating batch history:', error);
    throw error;
  }
};

ProjectHistorySchema.statics.cleanupExpiredHistory = async function() {
  try {
    const result = await this.deleteMany({
      expiresAt: { $lte: new Date() }
    });

    console.log(`🧹 ${result.deletedCount} entrées d'historique expirées supprimées`);
    return result.deletedCount;
  } catch (error) {
    console.error('Error cleaning up expired history:', error);
    throw error;
  }
};

// Middleware pré-sauvegarde
ProjectHistorySchema.pre('save', function(next) {
  // Définir automatiquement l'expiration selon la politique de rétention
  if (this.isNew && !this.expiresAt) {
    const now = new Date();
    switch (this.retentionPolicy) {
      case 'standard':
        this.expiresAt = new Date(now.getTime() + (6 * 30 * 24 * 60 * 60 * 1000)); // 6 mois
        break;
      case 'extended':
        this.expiresAt = new Date(now.getTime() + (12 * 30 * 24 * 60 * 60 * 1000)); // 12 mois
        break;
      case 'permanent':
        this.expiresAt = null;
        break;
    }
  }

  next();
});

module.exports = model('ProjectHistory', ProjectHistorySchema);