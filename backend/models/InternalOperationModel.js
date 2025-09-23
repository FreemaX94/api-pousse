/**
 * Modèle pour les opérations diverses inter-pôles
 * Gestion des ventes internes entre départements
 */

const mongoose = require('mongoose');

const internalOperationSchema = new mongoose.Schema({
  // Informations de base
  operationId: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return 'OP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
  },
  
  // Départements impliqués
  sellingDepartment: {
    type: String,
    enum: ['evenementiel', 'evenements', 'creation', 'entretien', 'upsell'],
    default: 'evenements',
    required: true
  },
  
  buyingDepartment: {
    type: String,
    enum: ['creation', 'entretien', 'upsell', 'evenements'],
    required: true
  },
  
  // Article vendu
  article: {
    reference: { type: String, required: true },
    name: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    image: { type: String },
    category: { type: String }
  },
  
  // Détails de la transaction
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  
  coefficient: {
    type: Number,
    required: true,
    min: 0.1,
    default: 1.0
  },
  
  finalPrice: {
    type: Number,
    required: true
  },
  
  totalAmount: {
    type: Number,
    required: true
  },
  
  // Statut de l'opération
  status: {
    type: String,
    enum: ['pending', 'validated', 'cancelled', 'completed'],
    default: 'pending'
  },
  
  // Métadonnées
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  validatedAt: {
    type: Date
  },
  
  notes: {
    type: String,
    maxlength: 500
  },
  
  // Référence à l'article stock si disponible
  stockReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StockEntry'
  }
}, {
  timestamps: true,
  collection: 'internal_operations'
});

// Index pour les recherches courantes
internalOperationSchema.index({ operationId: 1 });
internalOperationSchema.index({ sellingDepartment: 1, buyingDepartment: 1 });
internalOperationSchema.index({ status: 1 });
internalOperationSchema.index({ createdAt: -1 });
internalOperationSchema.index({ 'article.reference': 1 });

// Méthodes du schéma
internalOperationSchema.methods.calculateTotals = function() {
  this.finalPrice = this.article.originalPrice * this.coefficient;
  this.totalAmount = this.finalPrice * this.quantity;
  return this;
};

internalOperationSchema.methods.validate = function(validatorId) {
  this.status = 'validated';
  this.validatedBy = validatorId;
  this.validatedAt = new Date();
  return this;
};

internalOperationSchema.methods.complete = function() {
  if (this.status !== 'validated') {
    throw new Error('Cannot complete non-validated operation');
  }
  this.status = 'completed';
  return this;
};

// Méthodes statiques
internalOperationSchema.statics.getOperationsByDepartment = function(department, isSellerOrBuyer = 'both') {
  const query = {};
  
  if (isSellerOrBuyer === 'seller') {
    query.sellingDepartment = department;
  } else if (isSellerOrBuyer === 'buyer') {
    query.buyingDepartment = department;
  } else {
    query.$or = [
      { sellingDepartment: department },
      { buyingDepartment: department }
    ];
  }
  
  return this.find(query)
    .populate('createdBy', 'fullname email')
    .populate('validatedBy', 'fullname email')
    .sort({ createdAt: -1 });
};

internalOperationSchema.statics.getOperationStats = function(timeRange = '30d') {
  const startDate = new Date();
  
  switch (timeRange) {
    case '7d':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(startDate.getDate() - 90);
      break;
    default:
      startDate.setDate(startDate.getDate() - 30);
  }
  
  return this.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: '$buyingDepartment',
        totalOperations: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
        averageAmount: { $avg: '$totalAmount' },
        statusBreakdown: {
          $push: '$status'
        }
      }
    },
    {
      $project: {
        department: '$_id',
        totalOperations: 1,
        totalAmount: { $round: ['$totalAmount', 2] },
        averageAmount: { $round: ['$averageAmount', 2] },
        statusBreakdown: 1
      }
    }
  ]);
};

// Hook pre-save pour calculer automatiquement les totaux
internalOperationSchema.pre('save', function(next) {
  if (this.isModified('quantity') || this.isModified('coefficient') || this.isModified('article.originalPrice')) {
    this.calculateTotals();
  }
  next();
});

// Hook post-save pour logging
internalOperationSchema.post('save', function(doc) {
  console.log(`💰 Opération interne créée: ${doc.operationId} - ${doc.sellingDepartment} → ${doc.buyingDepartment}`);
});

module.exports = mongoose.model('InternalOperation', internalOperationSchema);