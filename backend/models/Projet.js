const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { getNextSequenceValue } = require('./Counter');

const TaskSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'review', 'completed', 'cancelled'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  estimatedHours: { type: Number, min: 0 },
  actualHours: { type: Number, min: 0, default: 0 },
  dueDate: Date,
  completedDate: Date,
  dependencies: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  tags: [String],
  comments: [{
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const MilestoneSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  dueDate: { type: Date, required: true },
  completedDate: Date,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'delayed'],
    default: 'pending'
  },
  deliverables: [String],
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

const ExpenseSchema = new Schema({
  description: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    enum: ['materials', 'labor', 'equipment', 'transport', 'other'],
    required: true
  },
  date: { type: Date, default: Date.now },
  receipt: String, // Path vers le reçu
  approved: { type: Boolean, default: false },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

const TimeEntrySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: Schema.Types.ObjectId, ref: 'Task' },
  description: { type: String, trim: true },
  startTime: { type: Date, required: true },
  endTime: Date,
  duration: { type: Number, min: 0 }, // en minutes
  hourlyRate: { type: Number, min: 0 },
  billable: { type: Boolean, default: true }
}, { timestamps: true });

const projetSchema = new Schema(
  {
    projectId: { 
      type: String, 
      unique: true, 
      index: true 
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    client: {
      type: {
        type: String,
        enum: ['individual', 'company'],
        default: 'individual'
      },
      name: { type: String, required: true, trim: true },
      contact: {
        email: String,
        phone: String,
        address: {
          street: String,
          city: String,
          postalCode: String,
          country: { type: String, default: 'France' }
        }
      },
      company: {
        name: String,
        siret: String,
        vatNumber: String
      }
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    type: {
      type: String,
      enum: ['Création', 'Entretien', 'Événements', 'Rénovation', 'Conseil', 'Installation'],
      required: true,
      index: true
    },
    category: {
      type: String,
      enum: ['residential', 'commercial', 'event', 'maintenance', 'design'],
      default: 'residential'
    },
    dates: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
      actualStart: Date,
      actualEnd: Date,
      lastActivity: Date
    },
    status: {
      type: String,
      enum: ['draft', 'planned', 'active', 'on_hold', 'completed', 'cancelled', 'archived'],
      default: 'draft',
      index: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true
    },
    
    // Équipe et responsabilités
    team: {
      projectManager: { type: Schema.Types.ObjectId, ref: 'User' },
      members: [{
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: {
          type: String,
          enum: ['manager', 'designer', 'technician', 'coordinator'],
          required: true
        },
        assignedDate: { type: Date, default: Date.now },
        permissions: {
          canEdit: { type: Boolean, default: false },
          canAssignTasks: { type: Boolean, default: false },
          canApproveExpenses: { type: Boolean, default: false }
        }
      }]
    },

    // Chargé de projet (nom simple pour l'interface)
    chargeProjet: {
      type: String,
      trim: true,
      enum: ['Amélie', 'Hugo', 'Baptiste']
    },
    
    // Budget et finances
    budget: {
      total: { type: Number, min: 0 },
      materials: { type: Number, min: 0, default: 0 },
      labor: { type: Number, min: 0, default: 0 },
      equipment: { type: Number, min: 0, default: 0 },
      overhead: { type: Number, min: 0, default: 0 },
      currency: { type: String, default: 'EUR' },
      approved: { type: Boolean, default: false },
      approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      approvalDate: Date
    },
    
    // Localisation
    location: {
      address: { type: String, required: true },
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      accessInstructions: String,
      parkingInfo: String,
      specialRequirements: String
    },
    
    // Gestion des tâches et jalons
    tasks: [TaskSchema],
    milestones: [MilestoneSchema],
    
    // Suivi financier
    expenses: [ExpenseSchema],
    timeEntries: [TimeEntrySchema],
    
    // Documents et fichiers
    documents: [{
      name: { type: String, required: true },
      path: { type: String, required: true },
      type: {
        type: String,
        enum: ['contract', 'plan', 'photo', 'invoice', 'receipt', 'report', 'other'],
        default: 'other'
      },
      uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      uploadDate: { type: Date, default: Date.now },
      size: Number,
      mimeType: String,
      version: { type: Number, default: 1 },
      tags: [String]
    }],
    
    // Photos et visuels
    photos: [{
      url: { type: String, required: true },
      caption: String,
      category: {
        type: String,
        enum: ['before', 'during', 'after', 'design', 'issue'],
        default: 'during'
      },
      takenBy: { type: Schema.Types.ObjectId, ref: 'User' },
      date: { type: Date, default: Date.now },
      location: {
        latitude: Number,
        longitude: Number
      },
      tags: [String]
    }],
    
    // Matériaux et ressources
    materials: [{
      catalogueItem: { type: Schema.Types.ObjectId, ref: 'CatalogueItem' },
      reference: String,
      name: { type: String, required: true },
      quantity: { type: Number, required: true, min: 0 },
      unitPrice: { type: Number, min: 0 },
      supplier: String,
      status: {
        type: String,
        enum: ['needed', 'ordered', 'delivered', 'used', 'returned'],
        default: 'needed'
      },
      deliveryDate: Date,
      notes: String,
      image: String
    }],
    
    // Équipements nécessaires
    equipment: [{
      name: { type: String, required: true },
      type: String,
      quantity: { type: Number, default: 1, min: 1 },
      status: {
        type: String,
        enum: ['needed', 'reserved', 'available', 'in_use', 'returned'],
        default: 'needed'
      },
      assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
      reservedFrom: Date,
      reservedUntil: Date,
      notes: String
    }],
    
    // Récurrence (pour l'entretien)
    recurring: {
      isRecurring: { type: Boolean, default: false },
      frequency: {
        type: String,
        enum: ['weekly', 'monthly', 'quarterly', 'yearly']
      },
      nextDueDate: Date,
      endDate: Date,
      parentProjectId: { type: Schema.Types.ObjectId, ref: 'Projet' }
    },
    
    // Qualité et évaluation
    quality: {
      clientSatisfaction: { type: Number, min: 1, max: 5 },
      clientFeedback: String,
      internalRating: { type: Number, min: 1, max: 5 },
      issues: [{
        description: String,
        severity: {
          type: String,
          enum: ['low', 'medium', 'high', 'critical'],
          default: 'medium'
        },
        reportedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        reportedDate: { type: Date, default: Date.now },
        resolved: { type: Boolean, default: false },
        resolvedDate: Date,
        resolution: String
      }]
    },
    
    // Météo et conditions
    weather: {
      conditions: [{
        date: Date,
        temperature: Number,
        humidity: Number,
        precipitation: Number,
        windSpeed: Number,
        description: String,
        impact: {
          type: String,
          enum: ['none', 'minimal', 'moderate', 'severe'],
          default: 'none'
        }
      }]
    },
    
    // Notes et communication
    notes: {
      internal: String, // Notes équipe interne
      client: String,   // Notes partageables avec le client
      technical: String // Notes techniques
    },
    
    // Historique et audit
    history: [{
      action: {
        type: String,
        enum: ['created', 'updated', 'status_changed', 'member_added', 'task_completed', 'expense_added'],
        required: true
      },
      description: String,
      performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      date: { type: Date, default: Date.now },
      oldValue: Schema.Types.Mixed,
      newValue: Schema.Types.Mixed
    }],
    
    // Métadonnées
    metadata: {
      source: { type: String, default: 'manual' },
      template: String,
      tags: [String],
      customFields: Schema.Types.Mixed
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Validation personnalisée pour les dates
projetSchema.pre('save', function(next) {
  if (this.dates.start && this.dates.end && this.dates.start > this.dates.end) {
    return next(new Error('La date de fin doit être postérieure à la date de début'));
  }
  next();
});

// Générer un ID unique logique avant la sauvegarde
projetSchema.pre('save', async function(next) {
  if (this.isNew && !this.projectId) {
    try {
      const sequenceValue = await getNextSequenceValue('project');
      const year = new Date(this.dates.start).getFullYear();
      const paddedSequence = sequenceValue.toString().padStart(3, '0');
      this.projectId = `PROJ-${year}-${paddedSequence}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Virtual pour la durée estimée
projetSchema.virtual('duration.estimated').get(function() {
  if (!this.dates.start || !this.dates.end) return 0;
  return Math.ceil((this.dates.end - this.dates.start) / (1000 * 60 * 60 * 24));
});

// Virtual pour la durée réelle
projetSchema.virtual('duration.actual').get(function() {
  if (!this.dates.actualStart || !this.dates.actualEnd) return 0;
  return Math.ceil((this.dates.actualEnd - this.dates.actualStart) / (1000 * 60 * 60 * 24));
});

// Virtual pour le pourcentage de completion
projetSchema.virtual('progress.percentage').get(function() {
  if (!this.tasks || this.tasks.length === 0) return 0;
  const completedTasks = this.tasks.filter(task => task.status === 'completed').length;
  return Math.round((completedTasks / this.tasks.length) * 100);
});

// Virtual pour les coûts totaux
projetSchema.virtual('costs.total').get(function() {
  if (!this.expenses || this.expenses.length === 0) return 0;
  return this.expenses.reduce((total, expense) => total + expense.amount, 0);
});

// Virtual pour le temps total passé
projetSchema.virtual('time.total').get(function() {
  if (!this.timeEntries || this.timeEntries.length === 0) return 0;
  return this.timeEntries.reduce((total, entry) => total + (entry.duration || 0), 0);
});

// Virtual pour savoir si le projet est en retard
projetSchema.virtual('isOverdue').get(function() {
  if (this.status === 'completed' || this.status === 'cancelled') return false;
  return this.dates.end < new Date();
});

// Indexes pour optimiser les requêtes
projetSchema.index({ status: 1, 'dates.start': -1 });
projetSchema.index({ type: 1, status: 1 });
projetSchema.index({ 'client.name': 1 });
projetSchema.index({ 'team.projectManager': 1 });
projetSchema.index({ priority: 1, status: 1 });
projetSchema.index({ 'dates.end': 1 });

// Méthodes d'instance
projetSchema.methods.addTeamMember = function(userId, role, permissions = {}) {
  const existingMember = this.team.members.find(m => m.user.toString() === userId.toString());
  if (existingMember) {
    throw new Error('Cet utilisateur fait déjà partie de l\'équipe');
  }
  
  this.team.members.push({
    user: userId,
    role,
    permissions: {
      canEdit: permissions.canEdit || false,
      canAssignTasks: permissions.canAssignTasks || false,
      canApproveExpenses: permissions.canApproveExpenses || false
    }
  });
  
  return this.save();
};

projetSchema.methods.addTask = function(taskData) {
  this.tasks.push(taskData);
  
  // Ajouter à l'historique
  this.history.push({
    action: 'task_added',
    description: `Tâche ajoutée: ${taskData.title}`,
    performedBy: taskData.assignedTo || this.team.projectManager
  });
  
  return this.save();
};

projetSchema.methods.addExpense = function(expenseData) {
  this.expenses.push(expenseData);
  
  // Ajouter à l'historique
  this.history.push({
    action: 'expense_added',
    description: `Dépense ajoutée: ${expenseData.description} (${expenseData.amount}€)`,
    performedBy: expenseData.approvedBy
  });
  
  return this.save();
};

projetSchema.methods.updateStatus = function(newStatus, userId) {
  const oldStatus = this.status;
  this.status = newStatus;
  
  // Mettre à jour les dates si nécessaire
  if (newStatus === 'active' && !this.dates.actualStart) {
    this.dates.actualStart = new Date();
  } else if (newStatus === 'completed' && !this.dates.actualEnd) {
    this.dates.actualEnd = new Date();
  }
  
  // Ajouter à l'historique
  this.history.push({
    action: 'status_changed',
    description: `Statut changé de ${oldStatus} à ${newStatus}`,
    performedBy: userId,
    oldValue: oldStatus,
    newValue: newStatus
  });
  
  return this.save();
};

projetSchema.methods.calculateProgress = function() {
  if (this.tasks.length === 0) return 0;
  
  let totalWeight = 0;
  let completedWeight = 0;
  
  this.tasks.forEach(task => {
    const weight = task.estimatedHours || 1;
    totalWeight += weight;
    
    if (task.status === 'completed') {
      completedWeight += weight;
    } else if (task.status === 'in_progress') {
      completedWeight += weight * 0.5; // 50% pour les tâches en cours
    }
  });
  
  return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
};

// Méthodes statiques
projetSchema.statics.getActiveProjects = function() {
  return this.find({ status: { $in: ['active', 'planned'] } })
    .populate('team.projectManager', 'username email')
    .sort({ priority: -1, 'dates.start': 1 });
};

projetSchema.statics.getOverdueProjects = function() {
  return this.find({
    status: { $nin: ['completed', 'cancelled', 'archived'] },
    'dates.end': { $lt: new Date() }
  });
};

projetSchema.statics.getProjectsByClient = function(clientName) {
  return this.find({ 'client.name': new RegExp(clientName, 'i') })
    .sort({ 'dates.start': -1 });
};

projetSchema.statics.getProjectStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        'dates.start': { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalBudget: { $sum: '$budget.total' },
        avgDuration: {
          $avg: {
            $divide: [
              { $subtract: ['$dates.end', '$dates.start'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      }
    }
  ]);
};

module.exports = model('Projet', projetSchema);
