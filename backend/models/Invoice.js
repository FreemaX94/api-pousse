const mongoose = require('mongoose');
const { Schema } = mongoose;
const { getNextSequenceValue } = require('./Counter');

const InvoiceItemSchema = new Schema({
  catalogueItem: { 
    type: Schema.Types.ObjectId, 
    ref: 'CatalogueItem',
    required: true 
  },
  description: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  discount: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 100 
  },
  taxRate: { type: Number, default: 20, min: 0 }, // TVA en %
  totalHT: { type: Number }, // Calculé automatiquement
  totalTTC: { type: Number } // Calculé automatiquement
});

const InvoiceSchema = new Schema({
  invoiceId: { 
    type: String, 
    unique: true, 
    index: true 
  },
  invoiceNumber: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  client: {
    type: { 
      type: String, 
      enum: ['individual', 'company'], 
      default: 'individual' 
    },
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: { type: String, trim: true },
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: { type: String, default: 'France' }
    },
    siret: String, // Pour les entreprises
    vatNumber: String // Pour les entreprises
  },
  employee: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  pole: { 
    type: String, 
    required: true, 
    trim: true,
    enum: ['Création', 'Entretien', 'Événements', 'Vente', 'Conseil'],
    index: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Projet'
  },
  items: [InvoiceItemSchema],
  amounts: {
    subtotalHT: { type: Number, default: 0 },
    totalDiscount: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    totalTTC: { type: Number, default: 0 },
    currency: { type: String, default: 'EUR' }
  },
  dates: {
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    paidDate: Date,
    reminderSentDates: [Date]
  },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled'], 
    default: 'draft',
    index: true
  },
  paymentTerms: {
    type: String,
    enum: ['immediate', '15_days', '30_days', '45_days', '60_days'],
    default: '30_days'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'check', 'transfer', 'card', 'paypal'],
    default: 'transfer'
  },
  payments: [{
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    method: { 
      type: String, 
      enum: ['cash', 'check', 'transfer', 'card', 'paypal'],
      required: true 
    },
    reference: String,
    note: String
  }],
  notes: {
    internal: String, // Notes internes non visibles sur la facture
    customer: String  // Notes visibles sur la facture
  },
  attachments: [{
    filename: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now }
  }],
  metadata: {
    source: { type: String, default: 'manual' },
    template: { type: String, default: 'standard' },
    sentBy: { type: Schema.Types.ObjectId, ref: 'User' },
    sentDate: Date,
    viewedByClient: { type: Boolean, default: false },
    viewedDate: Date,
    reminderCount: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Générer un ID unique logique avant la sauvegarde
InvoiceSchema.pre('save', async function(next) {
  if (this.isNew && !this.invoiceId) {
    try {
      const sequenceValue = await getNextSequenceValue('invoice');
      const year = new Date().getFullYear();
      const paddedSequence = sequenceValue.toString().padStart(4, '0');
      this.invoiceId = `INV-${year}-${paddedSequence}`;
      
      // Générer le numéro de facture si non fourni
      if (!this.invoiceNumber) {
        this.invoiceNumber = this.invoiceId;
      }
      
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Calculer les montants automatiquement avant sauvegarde
InvoiceSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.calculateAmounts();
  }
  
  // Mettre à jour le statut si nécessaire
  this.updateStatus();
  
  next();
});

// Calculer la date d'échéance automatiquement
InvoiceSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('dates.issueDate') || this.isModified('paymentTerms')) {
    const issueDate = this.dates.issueDate || new Date();
    const daysToAdd = this.getPaymentTermsDays();
    this.dates.dueDate = new Date(issueDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  }
  next();
});

// Virtual pour le montant restant à payer
InvoiceSchema.virtual('amounts.remaining').get(function() {
  const totalPaid = this.payments.reduce((sum, payment) => sum + payment.amount, 0);
  return Math.max(0, this.amounts.totalTTC - totalPaid);
});

// Virtual pour savoir si la facture est en retard
InvoiceSchema.virtual('isOverdue').get(function() {
  return this.dates.dueDate < new Date() && this.status !== 'paid' && this.status !== 'cancelled';
});

// Virtual pour le nombre de jours de retard
InvoiceSchema.virtual('daysPastDue').get(function() {
  if (!this.isOverdue) return 0;
  const today = new Date();
  const diffTime = today - this.dates.dueDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Indexes pour optimiser les requêtes
InvoiceSchema.index({ 'client.name': 1 });
InvoiceSchema.index({ employee: 1, status: 1 });
InvoiceSchema.index({ pole: 1, 'dates.issueDate': -1 });
InvoiceSchema.index({ status: 1, 'dates.dueDate': 1 });
InvoiceSchema.index({ 'dates.issueDate': -1 });
InvoiceSchema.index({ invoiceNumber: 1 });

// Méthodes d'instance
InvoiceSchema.methods.calculateAmounts = function() {
  let subtotalHT = 0;
  let totalDiscount = 0;
  let totalTax = 0;

  this.items.forEach(item => {
    const lineTotal = item.quantity * item.unitPrice;
    const discountAmount = lineTotal * (item.discount / 100);
    const lineTotalHT = lineTotal - discountAmount;
    const lineTax = lineTotalHT * (item.taxRate / 100);
    
    item.totalHT = lineTotalHT;
    item.totalTTC = lineTotalHT + lineTax;
    
    subtotalHT += lineTotalHT;
    totalDiscount += discountAmount;
    totalTax += lineTax;
  });

  this.amounts.subtotalHT = subtotalHT;
  this.amounts.totalDiscount = totalDiscount;
  this.amounts.totalTax = totalTax;
  this.amounts.totalTTC = subtotalHT + totalTax;
};

InvoiceSchema.methods.updateStatus = function() {
  const totalPaid = this.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remaining = this.amounts.totalTTC - totalPaid;
  
  if (remaining <= 0) {
    this.status = 'paid';
    if (!this.dates.paidDate) {
      this.dates.paidDate = new Date();
    }
  } else if (totalPaid > 0) {
    this.status = 'partial';
  } else if (this.isOverdue && this.status !== 'cancelled') {
    this.status = 'overdue';
  }
};

InvoiceSchema.methods.addPayment = function(amount, method, reference, note) {
  this.payments.push({
    amount,
    method,
    reference,
    note
  });
  this.updateStatus();
  return this.save();
};

InvoiceSchema.methods.getPaymentTermsDays = function() {
  const termsMap = {
    'immediate': 0,
    '15_days': 15,
    '30_days': 30,
    '45_days': 45,
    '60_days': 60
  };
  return termsMap[this.paymentTerms] || 30;
};

InvoiceSchema.methods.markAsSent = function(sentBy) {
  this.status = 'sent';
  this.metadata.sentBy = sentBy;
  this.metadata.sentDate = new Date();
  return this.save();
};

InvoiceSchema.methods.markAsViewed = function() {
  this.metadata.viewedByClient = true;
  this.metadata.viewedDate = new Date();
  return this.save();
};

InvoiceSchema.methods.sendReminder = function() {
  this.dates.reminderSentDates.push(new Date());
  this.metadata.reminderCount += 1;
  return this.save();
};

// Méthodes statiques
InvoiceSchema.statics.findOverdue = function() {
  return this.find({
    'dates.dueDate': { $lt: new Date() },
    status: { $in: ['sent', 'partial', 'overdue'] }
  });
};

InvoiceSchema.statics.findByEmployee = function(employeeId, status = null) {
  const query = { employee: employeeId };
  if (status) query.status = status;
  return this.find(query).sort({ 'dates.issueDate': -1 });
};

InvoiceSchema.statics.getRevenue = function(startDate, endDate, pole = null) {
  const match = {
    status: 'paid',
    'dates.paidDate': { $gte: startDate, $lte: endDate }
  };
  
  if (pole) match.pole = pole;

  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: pole ? null : '$pole',
        totalRevenue: { $sum: '$amounts.totalTTC' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amounts.totalTTC' }
      }
    }
  ]);
};

InvoiceSchema.statics.getClientStats = function(clientName) {
  return this.aggregate([
    { $match: { 'client.name': clientName } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amounts.totalTTC' }
      }
    }
  ]);
};

module.exports = mongoose.model('Invoice', InvoiceSchema);
