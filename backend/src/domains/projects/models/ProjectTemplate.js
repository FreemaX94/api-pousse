const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const TemplateTaskSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  estimatedHours: { type: Number, min: 0 },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  dependencies: [String], // IDs relatifs des tâches dépendantes
  daysFromStart: { type: Number, default: 0 }, // Délai en jours depuis le début du projet
  role: {
    type: String,
    enum: ['manager', 'designer', 'technician', 'coordinator'],
    required: true
  },
  tags: [String]
});

const TemplateMaterialSchema = new Schema({
  name: { type: String, required: true },
  reference: String,
  quantity: { type: Number, required: true, min: 0 },
  unitPrice: { type: Number, min: 0 },
  supplier: String,
  category: {
    type: String,
    enum: ['plants', 'tools', 'soil', 'decoration', 'irrigation', 'other'],
    default: 'other'
  },
  isOptional: { type: Boolean, default: false }
});

const ProjectTemplateSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    enum: ['residential', 'commercial', 'event', 'maintenance', 'design'],
    required: true
  },
  type: {
    type: String,
    enum: ['Création', 'Entretien', 'Événements', 'Rénovation', 'Conseil', 'Installation'],
    required: true
  },

  // Paramètres par défaut
  defaultSettings: {
    duration: { type: Number, required: true }, // Durée en jours
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    budget: {
      materials: { type: Number, default: 0 },
      labor: { type: Number, default: 0 },
      equipment: { type: Number, default: 0 },
      overhead: { type: Number, default: 0 }
    }
  },

  // Tâches prédéfinies
  tasks: [TemplateTaskSchema],

  // Matériaux standards
  materials: [TemplateMaterialSchema],

  // Équipements nécessaires
  equipment: [{
    name: { type: String, required: true },
    type: String,
    quantity: { type: Number, default: 1, min: 1 },
    daysNeeded: { type: Number, default: 1 }, // Durée de réservation en jours
    isOptional: { type: Boolean, default: false }
  }],

  // Jalons prédéfinis
  milestones: [{
    title: { type: String, required: true },
    description: String,
    daysFromStart: { type: Number, required: true }, // Délai en jours depuis le début
    deliverables: [String]
  }],

  // Checklist de contrôle qualité
  qualityChecklist: [{
    item: { type: String, required: true },
    phase: {
      type: String,
      enum: ['planning', 'execution', 'completion'],
      required: true
    },
    mandatory: { type: Boolean, default: true }
  }],

  // Documents requis
  requiredDocuments: [{
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['contract', 'plan', 'photo', 'invoice', 'receipt', 'report', 'other'],
      required: true
    },
    mandatory: { type: Boolean, default: true },
    phase: {
      type: String,
      enum: ['planning', 'execution', 'completion'],
      default: 'planning'
    }
  }],

  // Métadonnées
  metadata: {
    icon: { type: String, default: '🏗️' },
    color: { type: String, default: '#3b82f6' },
    tags: [String],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    },
    seasonality: [{
      type: String,
      enum: ['spring', 'summer', 'autumn', 'winter']
    }],
    customFields: [{
      name: String,
      type: {
        type: String,
        enum: ['text', 'number', 'date', 'boolean', 'select'],
        default: 'text'
      },
      required: { type: Boolean, default: false },
      options: [String] // Pour les champs select
    }]
  },

  // Utilisation et statistiques
  usage: {
    timesUsed: { type: Number, default: 0 },
    avgDuration: Number,
    avgBudget: Number,
    successRate: Number, // Pourcentage de projets terminés avec succès
    lastUsed: Date
  },

  // Créateur et maintenance
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  isPublic: { type: Boolean, default: false }, // Visible par tous les utilisateurs
  version: { type: Number, default: 1 },

  // Notes et instructions
  instructions: {
    setup: String,
    execution: String,
    completion: String,
    tips: [String],
    warnings: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes pour optimiser les requêtes
ProjectTemplateSchema.index({ category: 1, type: 1 });
ProjectTemplateSchema.index({ isActive: 1, isPublic: 1 });
ProjectTemplateSchema.index({ 'usage.timesUsed': -1 });
ProjectTemplateSchema.index({ name: 'text', description: 'text' });

// Virtual pour le budget total estimé
ProjectTemplateSchema.virtual('estimatedBudget').get(function() {
  const { materials, labor, equipment, overhead } = this.defaultSettings.budget;
  return materials + labor + equipment + overhead;
});

// Virtual pour le nombre total de tâches
ProjectTemplateSchema.virtual('taskCount').get(function() {
  return this.tasks.length;
});

// Virtual pour la complexité (basée sur le nombre de tâches et la durée)
ProjectTemplateSchema.virtual('complexity').get(function() {
  const taskWeight = this.tasks.length * 0.5;
  const durationWeight = this.defaultSettings.duration * 0.1;
  const materialWeight = this.materials.length * 0.3;

  const score = taskWeight + durationWeight + materialWeight;

  if (score < 5) return 'simple';
  if (score < 15) return 'moderate';
  if (score < 30) return 'complex';
  return 'very_complex';
});

// Méthodes d'instance
ProjectTemplateSchema.methods.createProject = function(projectData) {
  const template = this;

  // Calculer les dates des tâches et jalons
  const startDate = new Date(projectData.dates.start);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + template.defaultSettings.duration);

  const tasks = template.tasks.map(taskTemplate => ({
    title: taskTemplate.title,
    description: taskTemplate.description,
    priority: taskTemplate.priority,
    estimatedHours: taskTemplate.estimatedHours,
    dueDate: new Date(startDate.getTime() + (taskTemplate.daysFromStart * 24 * 60 * 60 * 1000)),
    tags: taskTemplate.tags,
    status: 'todo'
  }));

  const milestones = template.milestones.map(milestoneTemplate => ({
    title: milestoneTemplate.title,
    description: milestoneTemplate.description,
    dueDate: new Date(startDate.getTime() + (milestoneTemplate.daysFromStart * 24 * 60 * 60 * 1000)),
    deliverables: milestoneTemplate.deliverables,
    status: 'pending'
  }));

  return {
    ...projectData,
    type: template.type,
    category: template.category,
    dates: {
      ...projectData.dates,
      end: endDate
    },
    priority: template.defaultSettings.priority,
    budget: {
      ...template.defaultSettings.budget,
      total: template.estimatedBudget,
      currency: 'EUR'
    },
    tasks,
    milestones,
    materials: template.materials.map(m => ({
      name: m.name,
      reference: m.reference,
      quantity: m.quantity,
      unitPrice: m.unitPrice,
      supplier: m.supplier,
      status: 'needed'
    })),
    equipment: template.equipment.map(e => ({
      name: e.name,
      type: e.type,
      quantity: e.quantity,
      status: 'needed'
    })),
    metadata: {
      template: template.name,
      templateId: template._id,
      customFields: template.metadata.customFields
    }
  };
};

ProjectTemplateSchema.methods.updateUsageStats = function(projectOutcome) {
  this.usage.timesUsed += 1;
  this.usage.lastUsed = new Date();

  if (projectOutcome) {
    const { duration, budget, success } = projectOutcome;

    // Mise à jour des moyennes
    if (duration) {
      this.usage.avgDuration = this.usage.avgDuration
        ? ((this.usage.avgDuration + duration) / 2)
        : duration;
    }

    if (budget) {
      this.usage.avgBudget = this.usage.avgBudget
        ? ((this.usage.avgBudget + budget) / 2)
        : budget;
    }

    if (typeof success === 'boolean') {
      const currentSuccesses = (this.usage.successRate || 0) * (this.usage.timesUsed - 1);
      this.usage.successRate = (currentSuccesses + (success ? 1 : 0)) / this.usage.timesUsed;
    }
  }

  return this.save();
};

// Méthodes statiques
ProjectTemplateSchema.statics.getPopularTemplates = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ 'usage.timesUsed': -1 })
    .limit(limit);
};

ProjectTemplateSchema.statics.getTemplatesByCategory = function(category) {
  return this.find({ category, isActive: true })
    .sort({ 'usage.timesUsed': -1 });
};

ProjectTemplateSchema.statics.searchTemplates = function(query, filters = {}) {
  const searchCriteria = {
    isActive: true,
    $text: { $search: query }
  };

  if (filters.category) searchCriteria.category = filters.category;
  if (filters.type) searchCriteria.type = filters.type;
  if (filters.difficulty) searchCriteria['metadata.difficulty'] = filters.difficulty;

  return this.find(searchCriteria)
    .sort({ score: { $meta: 'textScore' }, 'usage.timesUsed': -1 });
};

module.exports = model('ProjectTemplate', ProjectTemplateSchema);