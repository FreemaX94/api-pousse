const mongoose = require('mongoose');
const { Schema } = mongoose;
const { getNextSequenceValue } = require('../../../shared/models/Counter');

const ReceiptSchema = new Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now },
  extractedData: {
    vendor: String,
    totalAmount: Number,
    taxAmount: Number,
    date: Date,
    items: [String]
  }
});

const ExpenseSchema = new Schema({
  expenseId: { 
    type: String, 
    unique: true, 
    index: true 
  },
  category: {
    type: String,
    required: true,
    enum: [
      'fuel', 'maintenance', 'supplies', 'equipment', 'travel', 
      'meals', 'office', 'utilities', 'rent', 'insurance', 
      'marketing', 'training', 'software', 'professional_services',
      'taxes', 'other'
    ],
    index: true
  },
  subcategory: { type: String, trim: true },
  amount: { 
    type: Number, 
    required: true, 
    min: 0.01,
    set: v => Math.round(v * 100) / 100 // Arrondir à 2 décimales
  },
  description: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 500
  },
  date: { 
    type: Date, 
    required: true, 
    default: Date.now,
    index: true
  },
  currency: { 
    type: String, 
    required: true, 
    uppercase: true, 
    match: /^[A-Z]{3}$/,
    default: 'EUR'
  },
  exchangeRate: {
    type: Number,
    default: 1,
    min: 0.01
  },
  amountInBaseCurrency: { type: Number }, // Calculé automatiquement
  
  // Informations sur le fournisseur/vendeur
  vendor: {
    name: { type: String, trim: true },
    address: String,
    phone: String,
    email: String,
    taxId: String,
    website: String
  },
  
  // Informations fiscales
  tax: {
    isDeductible: { type: Boolean, default: true },
    taxRate: { type: Number, min: 0, max: 100 },
    taxAmount: { type: Number, min: 0 },
    taxCategory: {
      type: String,
      enum: ['standard', 'reduced', 'zero', 'exempt']
    }
  },
  
  // Méthode de paiement
  payment: {
    method: {
      type: String,
      enum: ['cash', 'card', 'bank_transfer', 'check', 'online', 'other'],
      required: true,
      default: 'card'
    },
    reference: String, // Numéro de transaction, chèque, etc.
    accountUsed: String // Compte bancaire ou carte utilisée
  },
  
  // Projet ou véhicule associé
  linkedTo: {
    type: {
      type: String,
      enum: ['project', 'vehicle', 'employee', 'general']
    },
    id: { type: Schema.Types.ObjectId, refPath: 'linkedTo.type' },
    description: String
  },
  
  // Qui a créé/approuvé cette dépense
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  approvalDate: Date,
  
  // Status de la dépense
  status: {
    type: String,
    enum: ['draft', 'pending_approval', 'approved', 'rejected', 'paid', 'reimbursed'],
    default: 'draft',
    index: true
  },
  
  // Remboursement
  reimbursement: {
    isReimbursable: { type: Boolean, default: false },
    requestedAmount: Number,
    approvedAmount: Number,
    paidAmount: Number,
    paidDate: Date,
    method: {
      type: String,
      enum: ['bank_transfer', 'cash', 'payroll', 'other']
    }
  },
  
  // Reçus et documents
  receipts: [ReceiptSchema],
  
  // Récurrence
  recurring: {
    isRecurring: { type: Boolean, default: false },
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', 'yearly']
    },
    nextDueDate: Date,
    endDate: Date,
    parentExpenseId: { type: Schema.Types.ObjectId, ref: 'Expense' }
  },
  
  // Géolocalisation
  location: {
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    address: String,
    country: String,
    city: String
  },
  
  // Notes et commentaires
  notes: {
    internal: String, // Notes internes
    public: String,   // Notes visibles dans les rapports
    rejection: String // Raison du rejet si applicable
  },
  
  // Alertes et notifications
  alerts: [{
    type: {
      type: String,
      enum: ['duplicate_suspected', 'high_amount', 'missing_receipt', 'tax_issue']
    },
    message: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    resolved: { type: Boolean, default: false },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedDate: Date
  }],
  
  // Métadonnées
  metadata: {
    source: { type: String, default: 'manual' }, // manual, import, api, mobile
    importBatch: String,
    originalFilename: String,
    duplicateCheckPerformed: { type: Boolean, default: false },
    aiProcessed: { type: Boolean, default: false }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Générer un ID unique logique avant la sauvegarde
ExpenseSchema.pre('save', async function(next) {
  if (this.isNew && !this.expenseId) {
    try {
      const sequenceValue = await getNextSequenceValue('expense');
      const year = new Date(this.date).getFullYear();
      const paddedSequence = sequenceValue.toString().padStart(4, '0');
      this.expenseId = `EXP-${year}-${paddedSequence}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Calculer le montant dans la devise de base
ExpenseSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('exchangeRate')) {
    this.amountInBaseCurrency = this.amount * this.exchangeRate;
  }
  next();
});

// Virtual pour savoir si c'est une grosse dépense
ExpenseSchema.virtual('isHighAmount').get(function() {
  return this.amountInBaseCurrency > 1000; // Configurable
});

// Virtual pour calculer le montant HT si on a la TVA
ExpenseSchema.virtual('amountExcludingTax').get(function() {
  if (this.tax.taxAmount) {
    return this.amount - this.tax.taxAmount;
  }
  if (this.tax.taxRate) {
    return this.amount / (1 + this.tax.taxRate / 100);
  }
  return this.amount;
});

// Virtual pour vérifier si des documents sont manquants
ExpenseSchema.virtual('hasMissingDocuments').get(function() {
  return this.receipts.length === 0 && this.amount > 50; // Configurable
});

// Indexes pour optimiser les requêtes
ExpenseSchema.index({ category: 1, date: -1 });
ExpenseSchema.index({ createdBy: 1, status: 1 });
ExpenseSchema.index({ 'vendor.name': 1 });
ExpenseSchema.index({ status: 1, approvalDate: -1 });
ExpenseSchema.index({ 'recurring.nextDueDate': 1 });
ExpenseSchema.index({ 'linkedTo.type': 1, 'linkedTo.id': 1 });

// Méthodes d'instance
ExpenseSchema.methods.approve = function(approvedBy, notes = '') {
  this.status = 'approved';
  this.approvedBy = approvedBy;
  this.approvalDate = new Date();
  if (notes) this.notes.internal = notes;
  return this.save();
};

ExpenseSchema.methods.reject = function(rejectedBy, reason) {
  this.status = 'rejected';
  this.approvedBy = rejectedBy;
  this.approvalDate = new Date();
  this.notes.rejection = reason;
  return this.save();
};

ExpenseSchema.methods.addReceipt = function(receiptData) {
  this.receipts.push(receiptData);
  
  // Retirer l'alerte "missing_receipt" si elle existe
  this.alerts = this.alerts.filter(alert => alert.type !== 'missing_receipt');
  
  return this.save();
};

ExpenseSchema.methods.checkForDuplicates = async function() {
  const duplicates = await this.constructor.find({
    _id: { $ne: this._id },
    amount: this.amount,
    'vendor.name': this.vendor.name,
    date: {
      $gte: new Date(this.date.getTime() - 24 * 60 * 60 * 1000), // -1 jour
      $lte: new Date(this.date.getTime() + 24 * 60 * 60 * 1000)  // +1 jour
    }
  });
  
  if (duplicates.length > 0) {
    this.alerts.push({
      type: 'duplicate_suspected',
      message: `Dépense similaire trouvée: ${duplicates[0].expenseId}`,
      severity: 'medium'
    });
  }
  
  this.metadata.duplicateCheckPerformed = true;
  return this.save();
};

ExpenseSchema.methods.createRecurring = function() {
  if (!this.recurring.isRecurring) return null;
  
  const frequencies = {
    weekly: 7,
    monthly: 30,
    quarterly: 90,
    yearly: 365
  };
  
  const daysToAdd = frequencies[this.recurring.frequency];
  const nextDate = new Date(this.date);
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  
  const newExpense = new this.constructor({
    ...this.toObject(),
    _id: undefined,
    expenseId: undefined,
    date: nextDate,
    status: 'draft',
    approvedBy: undefined,
    approvalDate: undefined,
    receipts: [],
    recurring: {
      ...this.recurring.toObject(),
      parentExpenseId: this._id
    },
    createdAt: undefined,
    updatedAt: undefined
  });
  
  this.recurring.nextDueDate = nextDate;
  
  return newExpense;
};

// Méthodes statiques
ExpenseSchema.statics.getExpensesByPeriod = function(startDate, endDate, category = null) {
  const query = {
    date: { $gte: startDate, $lte: endDate },
    status: { $in: ['approved', 'paid'] }
  };
  
  if (category) query.category = category;
  
  return this.find(query);
};

ExpenseSchema.statics.getExpensesByCategory = function(year = new Date().getFullYear()) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        status: { $in: ['approved', 'paid'] }
      }
    },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amountInBaseCurrency' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amountInBaseCurrency' }
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);
};

ExpenseSchema.statics.getPendingApprovals = function() {
  return this.find({ status: 'pending_approval' })
    .populate('createdBy', 'username email')
    .sort({ date: -1 });
};

ExpenseSchema.statics.getRecurringDue = function() {
  const today = new Date();
  return this.find({
    'recurring.isRecurring': true,
    'recurring.nextDueDate': { $lte: today },
    $or: [
      { 'recurring.endDate': { $exists: false } },
      { 'recurring.endDate': { $gte: today } }
    ]
  });
};

ExpenseSchema.statics.getExpenseStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        status: { $in: ['approved', 'paid'] }
      }
    },
    {
      $group: {
        _id: null,
        totalExpenses: { $sum: '$amountInBaseCurrency' },
        count: { $sum: 1 },
        avgExpense: { $avg: '$amountInBaseCurrency' },
        maxExpense: { $max: '$amountInBaseCurrency' },
        categoriesCount: { $addToSet: '$category' }
      }
    },
    {
      $project: {
        totalExpenses: 1,
        count: 1,
        avgExpense: 1,
        maxExpense: 1,
        categoriesCount: { $size: '$categoriesCount' }
      }
    }
  ]);
};

module.exports = mongoose.model('Expense', ExpenseSchema);
