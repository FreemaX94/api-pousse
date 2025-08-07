const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const SheetEntrySchema = new Schema({
  sheetId: {
    type: String,
    required: [true, 'L\'identifiant de la feuille est requis'],
    trim: true,
    index: true,
    maxlength: [100, 'L\'identifiant de la feuille ne peut dépasser 100 caractères'],
    match: [/^[a-zA-Z0-9\-_.]+$/, 'L\'identifiant de la feuille ne peut contenir que des lettres, chiffres, tirets, underscores et points']
  },
  entryId: {
    type: String,
    required: [true, 'L\'identifiant de l\'entrée est requis'],
    unique: true,
    trim: true,
    index: true
  },
  rowNumber: {
    type: Number,
    required: [true, 'Le numéro de ligne est requis'],
    min: [1, 'Le numéro de ligne doit être au moins 1'],
    index: true
  },
  data: {
    type: Schema.Types.Mixed,
    required: [true, 'Les données sont requises'],
    validate: {
      validator: function(value) {
        return typeof value === 'object' && value !== null;
      },
      message: 'Les données doivent être un objet valide'
    }
  },
  originalData: {
    type: Schema.Types.Mixed,
    default: function() {
      return this.data;
    }
  },
  source: {
    type: String,
    required: true,
    enum: {
      values: ['manual', 'import', 'api', 'csv', 'excel', 'google_sheets', 'sync', 'migration'],
      message: 'Source invalide : {VALUE}'
    },
    default: 'manual',
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['active', 'pending', 'processed', 'error', 'deleted', 'archived'],
      message: 'Statut invalide : {VALUE}'
    },
    default: 'active',
    index: true
  },
  validation: {
    isValid: {
      type: Boolean,
      default: true,
      index: true
    },
    errors: [{
      field: {
        type: String,
        required: true,
        trim: true
      },
      message: {
        type: String,
        required: true,
        maxlength: [500, 'Le message d\'erreur ne peut dépasser 500 caractères']
      },
      code: {
        type: String,
        enum: ['REQUIRED', 'TYPE', 'FORMAT', 'RANGE', 'UNIQUE', 'CUSTOM'],
        default: 'CUSTOM'
      },
      severity: {
        type: String,
        enum: ['error', 'warning', 'info'],
        default: 'error'
      }
    }],
    warnings: [{
      field: String,
      message: String,
      code: String
    }],
    lastValidated: {
      type: Date,
      default: Date.now
    }
  },
  processing: {
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    startedAt: Date,
    completedAt: Date,
    attempts: {
      type: Number,
      default: 0,
      min: [0, 'Le nombre de tentatives ne peut être négatif']
    },
    maxAttempts: {
      type: Number,
      default: 3,
      min: [1, 'Le nombre maximum de tentatives doit être au moins 1']
    },
    lastError: {
      message: String,
      stack: String,
      timestamp: Date
    },
    result: {
      type: Schema.Types.Mixed
    }
  },
  metadata: {
    importBatch: {
      type: String,
      trim: true,
      index: true
    },
    importedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    checksum: {
      type: String,
      trim: true,
      index: true
    },
    size: {
      type: Number,
      min: [0, 'La taille ne peut être négative']
    },
    encoding: {
      type: String,
      enum: ['utf8', 'utf16', 'ascii', 'latin1'],
      default: 'utf8'
    },
    format: {
      type: String,
      enum: ['json', 'csv', 'xlsx', 'xml', 'text'],
      default: 'json'
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [50, 'Un tag ne peut dépasser 50 caractères']
    }]
  },
  relationships: {
    parentEntry: {
      type: Schema.Types.ObjectId,
      ref: 'SheetEntry',
      index: true
    },
    childEntries: [{
      type: Schema.Types.ObjectId,
      ref: 'SheetEntry'
    }],
    relatedEntries: [{
      entry: {
        type: Schema.Types.ObjectId,
        ref: 'SheetEntry',
        required: true
      },
      type: {
        type: String,
        enum: ['duplicate', 'variant', 'reference', 'dependency'],
        default: 'reference'
      },
      confidence: {
        type: Number,
        min: [0, 'La confiance ne peut être négative'],
        max: [100, 'La confiance ne peut dépasser 100']
      }
    }]
  },
  changes: [{
    field: {
      type: String,
      required: true,
      trim: true
    },
    oldValue: {
      type: Schema.Types.Mixed
    },
    newValue: {
      type: Schema.Types.Mixed
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    reason: {
      type: String,
      maxlength: [200, 'La raison ne peut dépasser 200 caractères']
    },
    source: {
      type: String,
      enum: ['user', 'system', 'sync', 'import'],
      default: 'user'
    }
  }],
  access: {
    lastAccessed: {
      type: Date,
      default: Date.now
    },
    accessCount: {
      type: Number,
      default: 0,
      min: [0, 'Le nombre d\'accès ne peut être négatif']
    },
    accessHistory: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      action: {
        type: String,
        enum: ['read', 'write', 'delete', 'validate', 'process'],
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      details: {
        type: String,
        maxlength: [500, 'Les détails ne peuvent dépasser 500 caractères']
      }
    }]
  },
  flags: {
    isLocked: {
      type: Boolean,
      default: false,
      index: true
    },
    isBookmarked: {
      type: Boolean,
      default: false
    },
    isPriority: {
      type: Boolean,
      default: false
    },
    hasConflict: {
      type: Boolean,
      default: false,
      index: true
    },
    needsReview: {
      type: Boolean,
      default: false,
      index: true
    },
    isTemplate: {
      type: Boolean,
      default: false
    }
  },
  notes: {
    type: String,
    maxlength: [2000, 'Les notes ne peuvent dépasser 2000 caractères']
  },
  expiresAt: {
    type: Date,
    index: { expireAfterSeconds: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composés pour les recherches fréquentes
SheetEntrySchema.index({ sheetId: 1, rowNumber: 1 });
SheetEntrySchema.index({ sheetId: 1, status: 1 });
SheetEntrySchema.index({ sheetId: 1, 'validation.isValid': 1 });
SheetEntrySchema.index({ source: 1, createdAt: -1 });
SheetEntrySchema.index({ 'metadata.importBatch': 1, createdAt: -1 });
SheetEntrySchema.index({ 'flags.needsReview': 1, 'flags.hasConflict': 1 });
SheetEntrySchema.index({ 'processing.status': 1, 'processing.attempts': 1 });

// Génération automatique de l'identifiant d'entrée
SheetEntrySchema.pre('validate', async function(next) {
  if (this.isNew && !this.entryId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.entryId = `${this.sheetId}-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

// Virtuals
SheetEntrySchema.virtual('isProcessing').get(function() {
  return this.processing.status === 'processing';
});

SheetEntrySchema.virtual('hasErrors').get(function() {
  return !this.validation.isValid || (this.validation.errors && this.validation.errors.length > 0);
});

SheetEntrySchema.virtual('hasWarnings').get(function() {
  return this.validation.warnings && this.validation.warnings.length > 0;
});

SheetEntrySchema.virtual('canRetry').get(function() {
  return this.processing.status === 'failed' && this.processing.attempts < this.processing.maxAttempts;
});

SheetEntrySchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt <= new Date();
});

SheetEntrySchema.virtual('dataSize').get(function() {
  return JSON.stringify(this.data).length;
});

SheetEntrySchema.virtual('hasChanges').get(function() {
  return this.changes && this.changes.length > 0;
});

SheetEntrySchema.virtual('lastChange').get(function() {
  if (!this.changes || this.changes.length === 0) return null;
  return this.changes[this.changes.length - 1];
});

// Méthodes d'instance
SheetEntrySchema.methods.validate = async function(rules = []) {
  const errors = [];
  const warnings = [];
  
  // Validation de base
  if (!this.data || typeof this.data !== 'object') {
    errors.push({
      field: 'data',
      message: 'Les données doivent être un objet valide',
      code: 'TYPE',
      severity: 'error'
    });
  }
  
  // Appliquer les règles personnalisées
  for (const rule of rules) {
    const fieldValue = this.data[rule.field];
    
    switch (rule.type) {
    case 'required':
      if (!fieldValue) {
        errors.push({
          field: rule.field,
          message: rule.message || `Le champ ${rule.field} est requis`,
          code: 'REQUIRED',
          severity: 'error'
        });
      }
      break;
      
    case 'type':
      if (fieldValue && typeof fieldValue !== rule.expectedType) {
        errors.push({
          field: rule.field,
          message: rule.message || `Le champ ${rule.field} doit être de type ${rule.expectedType}`,
          code: 'TYPE',
          severity: 'error'
        });
      }
      break;
      
    case 'format':
      if (fieldValue && rule.pattern && !new RegExp(rule.pattern).test(fieldValue)) {
        errors.push({
          field: rule.field,
          message: rule.message || `Le format du champ ${rule.field} est invalide`,
          code: 'FORMAT',
          severity: 'error'
        });
      }
      break;
      
    case 'range':
      if (fieldValue && rule.range) {
        const { min, max } = rule.range;
        if ((min !== undefined && fieldValue < min) || (max !== undefined && fieldValue > max)) {
          errors.push({
            field: rule.field,
            message: rule.message || `La valeur du champ ${rule.field} est hors limite`,
            code: 'RANGE',
            severity: 'error'
          });
        }
      }
      break;
      
    case 'warning':
      if (fieldValue && rule.condition && rule.condition(fieldValue)) {
        warnings.push({
          field: rule.field,
          message: rule.message,
          code: 'CUSTOM'
        });
      }
      break;
    }
  }
  
  this.validation.errors = errors;
  this.validation.warnings = warnings;
  this.validation.isValid = errors.length === 0;
  this.validation.lastValidated = new Date();
  
  if (errors.length > 0) {
    this.flags.needsReview = true;
  }
  
  await this.save();
  return this.validation.isValid;
};

SheetEntrySchema.methods.startProcessing = async function(userId) {
  this.processing.status = 'processing';
  this.processing.startedAt = new Date();
  this.processing.attempts += 1;
  
  this.access.accessHistory.push({
    user: userId,
    action: 'process',
    details: `Tentative ${this.processing.attempts}`
  });
  
  await this.save();
  return this;
};

SheetEntrySchema.methods.completeProcessing = async function(result) {
  this.processing.status = 'completed';
  this.processing.completedAt = new Date();
  this.processing.result = result;
  this.status = 'processed';
  
  await this.save();
  return this;
};

SheetEntrySchema.methods.failProcessing = async function(error) {
  this.processing.status = 'failed';
  this.processing.lastError = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date()
  };
  
  if (this.processing.attempts >= this.processing.maxAttempts) {
    this.status = 'error';
    this.flags.needsReview = true;
  }
  
  await this.save();
  return this;
};

SheetEntrySchema.methods.updateData = async function(newData, userId, reason) {
  const changes = [];
  
  // Identifier les changements
  for (const [field, newValue] of Object.entries(newData)) {
    const oldValue = this.data[field];
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changes.push({
        field,
        oldValue,
        newValue,
        changedBy: userId,
        reason,
        source: 'user'
      });
    }
  }
  
  // Appliquer les changements
  this.data = { ...this.data, ...newData };
  this.changes.push(...changes);
  
  // Marquer pour revalidation
  this.validation.isValid = false;
  this.flags.needsReview = true;
  
  this.access.accessHistory.push({
    user: userId,
    action: 'write',
    details: `${changes.length} champ(s) modifié(s)`
  });
  
  await this.save();
  return this;
};

SheetEntrySchema.methods.addRelation = async function(entryId, type = 'reference', confidence = 100) {
  const existingIndex = this.relationships.relatedEntries.findIndex(r => 
    r.entry.toString() === entryId.toString()
  );
  
  if (existingIndex !== -1) {
    this.relationships.relatedEntries[existingIndex].type = type;
    this.relationships.relatedEntries[existingIndex].confidence = confidence;
  } else {
    this.relationships.relatedEntries.push({
      entry: entryId,
      type,
      confidence
    });
  }
  
  await this.save();
  return this;
};

SheetEntrySchema.methods.removeRelation = async function(entryId) {
  this.relationships.relatedEntries = this.relationships.relatedEntries.filter(r => 
    r.entry.toString() !== entryId.toString()
  );
  
  await this.save();
  return this;
};

SheetEntrySchema.methods.lock = async function(userId) {
  this.flags.isLocked = true;
  
  this.access.accessHistory.push({
    user: userId,
    action: 'write',
    details: 'Entrée verrouillée'
  });
  
  await this.save();
  return this;
};

SheetEntrySchema.methods.unlock = async function(userId) {
  this.flags.isLocked = false;
  
  this.access.accessHistory.push({
    user: userId,
    action: 'write',
    details: 'Entrée déverrouillée'
  });
  
  await this.save();
  return this;
};

SheetEntrySchema.methods.archive = async function(userId) {
  this.status = 'archived';
  
  this.access.accessHistory.push({
    user: userId,
    action: 'delete',
    details: 'Entrée archivée'
  });
  
  await this.save();
  return this;
};

SheetEntrySchema.methods.incrementAccess = async function(userId, action = 'read') {
  this.access.accessCount += 1;
  this.access.lastAccessed = new Date();
  
  if (userId) {
    this.access.accessHistory.push({
      user: userId,
      action,
      timestamp: new Date()
    });
  }
  
  await this.save();
  return this;
};

SheetEntrySchema.methods.duplicate = async function(userId, newSheetId) {
  const SheetEntryModel = this.constructor;
  
  const duplicatedData = this.toObject();
  delete duplicatedData._id;
  delete duplicatedData.entryId;
  delete duplicatedData.createdAt;
  delete duplicatedData.updatedAt;
  
  if (newSheetId) {
    duplicatedData.sheetId = newSheetId;
  }
  
  duplicatedData.source = 'manual';
  duplicatedData.status = 'pending';
  duplicatedData.flags.needsReview = true;
  
  const duplicatedEntry = new SheetEntryModel(duplicatedData);
  await duplicatedEntry.save();
  
  return duplicatedEntry;
};

SheetEntrySchema.methods.calculateChecksum = function() {
  const crypto = require('crypto');
  const dataString = JSON.stringify(this.data, Object.keys(this.data).sort());
  return crypto.createHash('md5').update(dataString).digest('hex');
};

SheetEntrySchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  
  // Masquer les informations sensibles
  if (obj.processing && obj.processing.lastError) {
    delete obj.processing.lastError.stack;
  }
  
  return obj;
};

// Méthodes statiques
SheetEntrySchema.statics.findBySheet = function(sheetId, options = {}) {
  const query = { sheetId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.isValid !== undefined) {
    query['validation.isValid'] = options.isValid;
  }
  
  return this.find(query).sort({ rowNumber: 1 });
};

SheetEntrySchema.statics.findByBatch = function(batchId) {
  return this.find({ 'metadata.importBatch': batchId }).sort({ rowNumber: 1 });
};

SheetEntrySchema.statics.findPendingProcessing = function(limit = 100) {
  return this.find({
    'processing.status': 'pending',
    status: 'active'
  })
    .sort({ createdAt: 1 })
    .limit(limit);
};

SheetEntrySchema.statics.findNeedingReview = function(options = {}) {
  const query = {
    'flags.needsReview': true,
    status: 'active'
  };
  
  if (options.sheetId) {
    query.sheetId = options.sheetId;
  }
  
  if (options.hasErrors) {
    query['validation.isValid'] = false;
  }
  
  return this.find(query).sort({ updatedAt: -1 });
};

SheetEntrySchema.statics.findConflicts = function(sheetId) {
  return this.find({
    sheetId,
    'flags.hasConflict': true,
    status: 'active'
  }).sort({ updatedAt: -1 });
};

SheetEntrySchema.statics.findDuplicates = function(sheetId, checksum) {
  return this.find({
    sheetId,
    'metadata.checksum': checksum,
    status: 'active'
  });
};

SheetEntrySchema.statics.searchEntries = function(sheetId, query, options = {}) {
  const searchQuery = {
    sheetId,
    status: 'active',
    $or: [
      { 'data.name': new RegExp(query, 'i') },
      { 'data.description': new RegExp(query, 'i') },
      { 'data.reference': new RegExp(query, 'i') },
      { entryId: new RegExp(query, 'i') }
    ]
  };
  
  if (options.source) {
    searchQuery.source = options.source;
  }
  
  return this.find(searchQuery).sort({ rowNumber: 1 });
};

SheetEntrySchema.statics.getStatistics = async function(sheetId) {
  const [total, byStatus, bySource, validation, processing] = await Promise.all([
    this.countDocuments({ sheetId }),
    this.aggregate([
      { $match: { sheetId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    this.aggregate([
      { $match: { sheetId } },
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]),
    this.aggregate([
      { $match: { sheetId } },
      { $group: {
        _id: null,
        valid: { $sum: { $cond: ['$validation.isValid', 1, 0] } },
        invalid: { $sum: { $cond: ['$validation.isValid', 0, 1] } },
        needsReview: { $sum: { $cond: ['$flags.needsReview', 1, 0] } }
      }}
    ]),
    this.aggregate([
      { $match: { sheetId } },
      { $group: { _id: '$processing.status', count: { $sum: 1 } } }
    ])
  ]);
  
  return {
    total,
    byStatus: byStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    bySource: bySource.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    validation: validation[0] || { valid: 0, invalid: 0, needsReview: 0 },
    processing: processing.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {})
  };
};

SheetEntrySchema.statics.bulkValidate = async function(sheetId, rules) {
  const entries = await this.find({ sheetId, status: 'active' });
  const results = [];
  
  for (const entry of entries) {
    const isValid = await entry.validate(rules);
    results.push({
      entryId: entry.entryId,
      rowNumber: entry.rowNumber,
      isValid,
      errors: entry.validation.errors,
      warnings: entry.validation.warnings
    });
  }
  
  return results;
};

SheetEntrySchema.statics.bulkUpdate = async function(sheetId, updates, userId) {
  const entries = await this.find({ sheetId, status: 'active' });
  const results = [];
  
  for (const entry of entries) {
    if (updates[entry.entryId]) {
      await entry.updateData(updates[entry.entryId], userId, 'Mise à jour en lot');
      results.push({
        entryId: entry.entryId,
        success: true
      });
    }
  }
  
  return results;
};

SheetEntrySchema.statics.cleanupExpired = async function() {
  const expiredCount = await this.deleteMany({
    expiresAt: { $lte: new Date() }
  });
  
  return expiredCount.deletedCount;
};

// Middleware pre-save
SheetEntrySchema.pre('save', function(next) {
  // Calculer et mettre à jour le checksum
  this.metadata.checksum = this.calculateChecksum();
  
  // Mettre à jour la taille des données
  this.metadata.size = this.dataSize;
  
  // Normaliser les tags
  if (this.metadata.tags && this.metadata.tags.length > 0) {
    this.metadata.tags = this.metadata.tags.map(tag => tag.toLowerCase().trim()).filter(tag => tag.length > 0);
    this.metadata.tags = [...new Set(this.metadata.tags)];
  }
  
  next();
});

// Middleware post-save
SheetEntrySchema.post('save', async function(doc) {
  // Vérifier les doublons
  if (doc.metadata.checksum) {
    const duplicates = await doc.constructor.countDocuments({
      sheetId: doc.sheetId,
      'metadata.checksum': doc.metadata.checksum,
      _id: { $ne: doc._id },
      status: 'active'
    });
    
    if (duplicates > 0) {
      doc.flags.hasConflict = true;
      doc.flags.needsReview = true;
      await doc.save();
    }
  }
});

// Plugin de pagination
SheetEntrySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('SheetEntry', SheetEntrySchema);
