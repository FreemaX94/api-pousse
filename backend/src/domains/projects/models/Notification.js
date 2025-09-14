const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const NotificationSchema = new Schema({
  // Destinataire
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Type de notification
  type: {
    type: String,
    enum: [
      'project_deadline',
      'task_overdue',
      'milestone_approaching',
      'project_status_change',
      'new_comment',
      'team_assignment',
      'budget_alert',
      'material_delivery',
      'weather_warning',
      'maintenance_reminder',
      'client_feedback',
      'document_uploaded',
      'expense_approval',
      'system_update'
    ],
    required: true,
    index: true
  },

  // Priorité
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },

  // Titre et contenu
  title: {
    type: String,
    required: true,
    maxlength: 200
  },

  message: {
    type: String,
    required: true,
    maxlength: 1000
  },

  // Données contextuelles
  context: {
    projectId: { type: Schema.Types.ObjectId, ref: 'Projet' },
    taskId: Schema.Types.ObjectId,
    milestoneId: Schema.Types.ObjectId,
    commentId: Schema.Types.ObjectId,
    templateId: { type: Schema.Types.ObjectId, ref: 'ProjectTemplate' },
    entityType: {
      type: String,
      enum: ['project', 'task', 'milestone', 'comment', 'expense', 'material', 'team']
    },
    entityId: Schema.Types.ObjectId,
    additionalData: Schema.Types.Mixed
  },

  // Actions possibles
  actions: [{
    label: { type: String, required: true },
    action: {
      type: String,
      enum: ['view', 'edit', 'approve', 'decline', 'complete', 'dismiss', 'reschedule'],
      required: true
    },
    url: String,
    payload: Schema.Types.Mixed
  }],

  // Statut et suivi
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'read', 'dismissed', 'failed'],
    default: 'pending',
    index: true
  },

  // Méthodes de livraison
  channels: {
    push: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    inApp: { type: Boolean, default: true }
  },

  // Programmation
  scheduledFor: {
    type: Date,
    index: true
  },

  sentAt: Date,
  readAt: Date,
  dismissedAt: Date,

  // Récurrence (pour notifications périodiques)
  recurring: {
    isRecurring: { type: Boolean, default: false },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    interval: { type: Number, default: 1 },
    endDate: Date,
    nextRun: Date
  },

  // Métadonnées
  metadata: {
    source: { type: String, default: 'system' },
    version: { type: String, default: '1.0' },
    template: String,
    tags: [String],
    customFields: Schema.Types.Mixed
  },

  // Expédition
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  // Suivi des tentatives d'envoi
  deliveryAttempts: [{
    channel: {
      type: String,
      enum: ['push', 'email', 'sms', 'inApp']
    },
    attemptedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['success', 'failed', 'retrying']
    },
    error: String,
    response: Schema.Types.Mixed
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes pour optimiser les requêtes
NotificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, priority: 1 });
NotificationSchema.index({ scheduledFor: 1, status: 1 });
NotificationSchema.index({ 'context.projectId': 1 });
NotificationSchema.index({ 'recurring.nextRun': 1, 'recurring.isRecurring': 1 });

// Virtual pour savoir si la notification est en retard
NotificationSchema.virtual('isOverdue').get(function() {
  if (!this.scheduledFor) return false;
  return this.scheduledFor < new Date() && this.status === 'pending';
});

// Virtual pour le délai depuis la création
NotificationSchema.virtual('ageInHours').get(function() {
  return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60));
});

// Méthodes d'instance
NotificationSchema.methods.markAsRead = function(userId) {
  if (this.recipient.toString() !== userId.toString()) {
    throw new Error('Non autorisé à marquer cette notification comme lue');
  }

  this.status = 'read';
  this.readAt = new Date();
  return this.save();
};

NotificationSchema.methods.dismiss = function(userId) {
  if (this.recipient.toString() !== userId.toString()) {
    throw new Error('Non autorisé à ignorer cette notification');
  }

  this.status = 'dismissed';
  this.dismissedAt = new Date();
  return this.save();
};

NotificationSchema.methods.reschedule = function(newDate) {
  if (newDate <= new Date()) {
    throw new Error('La nouvelle date doit être dans le futur');
  }

  this.scheduledFor = newDate;
  this.status = 'pending';
  return this.save();
};

NotificationSchema.methods.addDeliveryAttempt = function(channel, status, error = null, response = null) {
  this.deliveryAttempts.push({
    channel,
    status,
    error,
    response
  });

  // Mettre à jour le statut général si nécessaire
  if (status === 'success' && this.status === 'pending') {
    this.status = 'sent';
    this.sentAt = new Date();
  } else if (status === 'failed' && this.deliveryAttempts.filter(a => a.status === 'failed').length >= 3) {
    this.status = 'failed';
  }

  return this.save();
};

// Méthodes statiques
NotificationSchema.statics.createProjectDeadlineNotification = function(project, daysUntilDeadline) {
  const urgencyLevel = daysUntilDeadline <= 1 ? 'urgent' : daysUntilDeadline <= 3 ? 'high' : 'medium';

  return new this({
    recipient: project.team.projectManager,
    type: 'project_deadline',
    priority: urgencyLevel,
    title: `Échéance projet: ${project.title}`,
    message: `Le projet "${project.title}" se termine dans ${daysUntilDeadline} jour(s). Vérifiez l'avancement et les dernières tâches.`,
    context: {
      projectId: project._id,
      entityType: 'project',
      entityId: project._id,
      additionalData: {
        daysUntilDeadline,
        endDate: project.dates.end,
        progress: project.calculateProgress()
      }
    },
    actions: [
      {
        label: 'Voir le projet',
        action: 'view',
        url: `/projects/${project._id}`
      },
      {
        label: 'Modifier échéance',
        action: 'edit',
        url: `/projects/${project._id}/edit`
      }
    ],
    scheduledFor: new Date()
  });
};

NotificationSchema.statics.createTaskOverdueNotification = function(project, task) {
  return new this({
    recipient: task.assignedTo || project.team.projectManager,
    type: 'task_overdue',
    priority: 'high',
    title: `Tâche en retard: ${task.title}`,
    message: `La tâche "${task.title}" du projet "${project.title}" est en retard. Échéance dépassée depuis le ${task.dueDate.toLocaleDateString('fr-FR')}.`,
    context: {
      projectId: project._id,
      taskId: task._id,
      entityType: 'task',
      entityId: task._id,
      additionalData: {
        dueDate: task.dueDate,
        priority: task.priority,
        estimatedHours: task.estimatedHours
      }
    },
    actions: [
      {
        label: 'Voir la tâche',
        action: 'view',
        url: `/projects/${project._id}/tasks/${task._id}`
      },
      {
        label: 'Marquer comme terminé',
        action: 'complete',
        payload: { taskId: task._id, status: 'completed' }
      },
      {
        label: 'Reporter l\'échéance',
        action: 'reschedule',
        url: `/projects/${project._id}/tasks/${task._id}/reschedule`
      }
    ],
    scheduledFor: new Date()
  });
};

NotificationSchema.statics.createMilestoneNotification = function(project, milestone, daysUntil) {
  return new this({
    recipient: project.team.projectManager,
    type: 'milestone_approaching',
    priority: daysUntil <= 2 ? 'high' : 'medium',
    title: `Jalon à venir: ${milestone.title}`,
    message: `Le jalon "${milestone.title}" du projet "${project.title}" est prévu dans ${daysUntil} jour(s).`,
    context: {
      projectId: project._id,
      milestoneId: milestone._id,
      entityType: 'milestone',
      entityId: milestone._id,
      additionalData: {
        dueDate: milestone.dueDate,
        deliverables: milestone.deliverables
      }
    },
    actions: [
      {
        label: 'Voir le jalon',
        action: 'view',
        url: `/projects/${project._id}/milestones/${milestone._id}`
      }
    ],
    scheduledFor: new Date()
  });
};

NotificationSchema.statics.createMaintenanceReminder = function(project, nextMaintenanceDate) {
  return new this({
    recipient: project.team.projectManager,
    type: 'maintenance_reminder',
    priority: 'medium',
    title: `Rappel maintenance: ${project.title}`,
    message: `Le projet "${project.title}" nécessite une maintenance prévue le ${nextMaintenanceDate.toLocaleDateString('fr-FR')}.`,
    context: {
      projectId: project._id,
      entityType: 'project',
      entityId: project._id,
      additionalData: {
        maintenanceDate: nextMaintenanceDate,
        type: project.type
      }
    },
    actions: [
      {
        label: 'Planifier maintenance',
        action: 'edit',
        url: `/projects/${project._id}/maintenance`
      }
    ],
    scheduledFor: new Date(nextMaintenanceDate.getTime() - (7 * 24 * 60 * 60 * 1000)), // 7 jours avant
    recurring: {
      isRecurring: true,
      frequency: project.recurring?.frequency || 'monthly',
      interval: 1,
      nextRun: nextMaintenanceDate
    }
  });
};

NotificationSchema.statics.getPendingNotifications = function(limit = 100) {
  return this.find({
    status: 'pending',
    scheduledFor: { $lte: new Date() }
  })
  .populate('recipient', 'username email phone preferences')
  .populate('context.projectId', 'title projectId status')
  .sort({ priority: -1, scheduledFor: 1 })
  .limit(limit);
};

NotificationSchema.statics.getUserNotifications = function(userId, options = {}) {
  const {
    status,
    type,
    priority,
    limit = 50,
    page = 1,
    unreadOnly = false
  } = options;

  const query = { recipient: userId };

  if (status) query.status = status;
  if (type) query.type = type;
  if (priority) query.priority = priority;
  if (unreadOnly) query.status = { $in: ['pending', 'sent', 'delivered'] };

  return this.find(query)
    .populate('context.projectId', 'title projectId')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

NotificationSchema.statics.markAllAsRead = function(userId, filters = {}) {
  const query = {
    recipient: userId,
    status: { $in: ['pending', 'sent', 'delivered'] },
    ...filters
  };

  return this.updateMany(query, {
    status: 'read',
    readAt: new Date()
  });
};

NotificationSchema.statics.getNotificationStats = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        recipient: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        unread: {
          $sum: {
            $cond: [{ $in: ['$status', ['pending', 'sent', 'delivered']] }, 1, 0]
          }
        },
        byType: {
          $push: {
            type: '$type',
            count: 1
          }
        },
        byPriority: {
          $push: {
            priority: '$priority',
            count: 1
          }
        }
      }
    }
  ]);
};

// Middleware pour gérer les notifications récurrentes
NotificationSchema.pre('save', function(next) {
  if (this.recurring?.isRecurring && this.status === 'sent' && !this.recurring.nextRun) {
    // Calculer la prochaine exécution
    const nextRun = new Date(this.scheduledFor);

    switch (this.recurring.frequency) {
      case 'daily':
        nextRun.setDate(nextRun.getDate() + this.recurring.interval);
        break;
      case 'weekly':
        nextRun.setDate(nextRun.getDate() + (7 * this.recurring.interval));
        break;
      case 'monthly':
        nextRun.setMonth(nextRun.getMonth() + this.recurring.interval);
        break;
      case 'yearly':
        nextRun.setFullYear(nextRun.getFullYear() + this.recurring.interval);
        break;
    }

    this.recurring.nextRun = nextRun;
  }

  next();
});

module.exports = model('Notification', NotificationSchema);