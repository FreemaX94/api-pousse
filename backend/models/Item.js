const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const ItemSchema = new Schema({
  identifier: {
    type: String,
    required: [true, 'L\'identifiant est requis'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^[A-Z0-9\-_]+$/, 'L\'identifiant ne peut contenir que des lettres majuscules, chiffres, tirets et underscores'],
    maxlength: [100, 'L\'identifiant ne peut dépasser 100 caractères'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    minlength: [1, 'Le nom doit contenir au moins 1 caractère'],
    maxlength: [200, 'Le nom ne peut dépasser 200 caractères'],
    index: true
  },
  displayName: {
    type: String,
    trim: true,
    maxlength: [250, 'Le nom d\'affichage ne peut dépasser 250 caractères']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La description ne peut dépasser 1000 caractères']
  },
  type: {
    type: String,
    required: [true, 'Le type est requis'],
    trim: true,
    enum: {
      values: ['component', 'service', 'product', 'resource', 'template', 'config', 'workflow', 'autre'],
      message: 'Type invalide : {VALUE}'
    },
    index: true
  },
  category: {
    type: String,
    trim: true,
    maxlength: [100, 'La catégorie ne peut dépasser 100 caractères'],
    index: true
  },
  subcategory: {
    type: String,
    trim: true,
    maxlength: [100, 'La sous-catégorie ne peut dépasser 100 caractères']
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['active', 'inactive', 'pending', 'deprecated', 'archived'],
      message: 'Statut invalide : {VALUE}'
    },
    default: 'active',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  version: {
    type: String,
    trim: true,
    match: [/^\d+\.\d+\.\d+$/, 'Format de version invalide (exemple: 1.0.0)'],
    default: '1.0.0'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Un tag ne peut dépasser 50 caractères']
  }],
  data: {
    type: Schema.Types.Mixed,
    default: {},
    validate: {
      validator: function(value) {
        // Valider que data est un objet
        return typeof value === 'object' && value !== null;
      },
      message: 'Les données doivent être un objet valide'
    }
  },
  configuration: {
    settings: {
      type: Schema.Types.Mixed,
      default: {}
    },
    parameters: {
      type: Schema.Types.Mixed,
      default: {}
    },
    options: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  relationships: {
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      index: true
    },
    children: [{
      type: Schema.Types.ObjectId,
      ref: 'Item'
    }],
    dependencies: [{
      item: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true
      },
      type: {
        type: String,
        enum: ['requires', 'uses', 'extends', 'implements'],
        default: 'uses'
      },
      version: {
        type: String,
        trim: true
      }
    }],
    related: [{
      type: Schema.Types.ObjectId,
      ref: 'Item'
    }]
  },
  access: {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    collaborators: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      role: {
        type: String,
        enum: ['viewer', 'editor', 'admin'],
        default: 'viewer'
      },
      permissions: [{
        type: String,
        enum: ['read', 'write', 'delete', 'share', 'configure']
      }]
    }],
    visibility: {
      type: String,
      enum: ['public', 'private', 'restricted', 'internal'],
      default: 'private'
    },
    sharing: {
      enabled: {
        type: Boolean,
        default: false
      },
      shareUrl: {
        type: String,
        trim: true
      },
      expiresAt: {
        type: Date,
        validate: {
          validator: function(value) {
            if (!value) return true;
            return value > new Date();
          },
          message: 'La date d\'expiration doit être dans le futur'
        }
      }
    }
  },
  usage: {
    views: {
      type: Number,
      default: 0,
      min: [0, 'Le nombre de vues ne peut être négatif']
    },
    downloads: {
      type: Number,
      default: 0,
      min: [0, 'Le nombre de téléchargements ne peut être négatif']
    },
    lastAccessed: {
      type: Date,
      default: Date.now
    },
    accessHistory: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      action: {
        type: String,
        enum: ['view', 'edit', 'download', 'share', 'delete'],
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
  files: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Le nom du fichier ne peut dépasser 200 caractères']
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    size: {
      type: Number,
      min: [0, 'La taille ne peut être négative']
    },
    mimeType: {
      type: String,
      trim: true,
      maxlength: [100, 'Le type MIME ne peut dépasser 100 caractères']
    },
    hash: {
      type: String,
      trim: true,
      maxlength: [128, 'Le hash ne peut dépasser 128 caractères']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  validation: {
    schema: {
      type: Schema.Types.Mixed,
      default: null
    },
    rules: [{
      field: {
        type: String,
        required: true,
        trim: true
      },
      rule: {
        type: String,
        required: true,
        enum: ['required', 'unique', 'format', 'range', 'custom']
      },
      value: {
        type: Schema.Types.Mixed
      },
      message: {
        type: String,
        maxlength: [200, 'Le message ne peut dépasser 200 caractères']
      }
    }],
    lastValidated: {
      type: Date
    },
    isValid: {
      type: Boolean,
      default: true
    },
    validationErrors: [{
      field: String,
      message: String,
      code: String
    }]
  },
  lifecycle: {
    created: {
      by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      at: {
        type: Date,
        default: Date.now
      },
      reason: {
        type: String,
        maxlength: [500, 'La raison ne peut dépasser 500 caractères']
      }
    },
    modified: {
      by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      at: {
        type: Date
      },
      reason: {
        type: String,
        maxlength: [500, 'La raison ne peut dépasser 500 caractères']
      }
    },
    archived: {
      by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      at: {
        type: Date
      },
      reason: {
        type: String,
        maxlength: [500, 'La raison ne peut dépasser 500 caractères']
      }
    }
  },
  metadata: {
    source: {
      type: String,
      enum: ['manual', 'import', 'api', 'migration', 'system'],
      default: 'manual'
    },
    importBatch: {
      type: String,
      trim: true
    },
    checksum: {
      type: String,
      trim: true
    },
    customFields: {
      type: Schema.Types.Mixed,
      default: {}
    },
    notes: {
      type: String,
      maxlength: [2000, 'Les notes ne peuvent dépasser 2000 caractères']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composés pour les recherches fréquentes
ItemSchema.index({ type: 1, name: 1 });
ItemSchema.index({ type: 1, status: 1 });
ItemSchema.index({ category: 1, subcategory: 1 });
ItemSchema.index({ 'access.owner': 1, status: 1 });
ItemSchema.index({ tags: 1 });
ItemSchema.index({ name: 'text', description: 'text' });
ItemSchema.index({ 'lifecycle.created.at': -1 });
ItemSchema.index({ 'usage.lastAccessed': -1 });

// Génération automatique de l'identifiant
ItemSchema.pre('validate', async function(next) {
  if (this.isNew && !this.identifier) {
    const typePrefix = this.type.substring(0, 3).toUpperCase();
    const now = new Date();
    const timestamp = now.getTime().toString().slice(-8);
    
    let sequence = 1;
    const lastItem = await this.constructor.findOne({
      identifier: new RegExp(`^${typePrefix}-${timestamp.substring(0, 4)}`)
    }).sort({ identifier: -1 });
    
    if (lastItem) {
      const lastSeq = parseInt(lastItem.identifier.split('-').pop());
      sequence = lastSeq + 1;
    }
    
    this.identifier = `${typePrefix}-${timestamp.substring(0, 4)}-${String(sequence).padStart(4, '0')}`;
  }
  next();
});

// Virtuals
ItemSchema.virtual('isOwner').get(function() {
  return function(userId) {
    return this.access.owner.toString() === userId.toString();
  };
});

ItemSchema.virtual('hasAccess').get(function() {
  return function(userId, permission = 'read') {
    // Vérifier si l'utilisateur est le propriétaire
    if (this.access.owner.toString() === userId.toString()) {
      return true;
    }
    
    // Vérifier les collaborateurs
    const collaborator = this.access.collaborators.find(c => 
      c.user.toString() === userId.toString()
    );
    
    if (!collaborator) {
      return this.access.visibility === 'public';
    }
    
    // Vérifier les permissions spécifiques
    return collaborator.permissions.includes(permission);
  };
});

ItemSchema.virtual('displayVersion').get(function() {
  return `v${this.version}`;
});

ItemSchema.virtual('isActive').get(function() {
  return this.status === 'active';
});

ItemSchema.virtual('isDeprecated').get(function() {
  return this.status === 'deprecated';
});

ItemSchema.virtual('hasChildren').get(function() {
  return this.relationships.children && this.relationships.children.length > 0;
});

ItemSchema.virtual('hasDependencies').get(function() {
  return this.relationships.dependencies && this.relationships.dependencies.length > 0;
});

ItemSchema.virtual('totalFileSize').get(function() {
  if (!this.files || this.files.length === 0) return 0;
  return this.files.reduce((total, file) => total + (file.size || 0), 0);
});

// Méthodes d'instance
ItemSchema.methods.incrementViews = async function(userId) {
  this.usage.views += 1;
  this.usage.lastAccessed = new Date();
  
  if (userId) {
    this.usage.accessHistory.push({
      user: userId,
      action: 'view'
    });
  }
  
  await this.save();
  return this;
};

ItemSchema.methods.addCollaborator = async function(userId, role = 'viewer', permissions = ['read']) {
  // Vérifier si l'utilisateur est déjà collaborateur
  const existingIndex = this.access.collaborators.findIndex(c => 
    c.user.toString() === userId.toString()
  );
  
  if (existingIndex !== -1) {
    // Mettre à jour les permissions
    this.access.collaborators[existingIndex].role = role;
    this.access.collaborators[existingIndex].permissions = permissions;
  } else {
    // Ajouter nouveau collaborateur
    this.access.collaborators.push({
      user: userId,
      role,
      permissions
    });
  }
  
  await this.save();
  return this;
};

ItemSchema.methods.removeCollaborator = async function(userId) {
  this.access.collaborators = this.access.collaborators.filter(c => 
    c.user.toString() !== userId.toString()
  );
  
  await this.save();
  return this;
};

ItemSchema.methods.addDependency = async function(itemId, type = 'uses', version = null) {
  // Vérifier si la dépendance existe déjà
  const existingIndex = this.relationships.dependencies.findIndex(d => 
    d.item.toString() === itemId.toString()
  );
  
  if (existingIndex !== -1) {
    // Mettre à jour la dépendance existante
    this.relationships.dependencies[existingIndex].type = type;
    if (version) {
      this.relationships.dependencies[existingIndex].version = version;
    }
  } else {
    // Ajouter nouvelle dépendance
    this.relationships.dependencies.push({
      item: itemId,
      type,
      version
    });
  }
  
  await this.save();
  return this;
};

ItemSchema.methods.removeDependency = async function(itemId) {
  this.relationships.dependencies = this.relationships.dependencies.filter(d => 
    d.item.toString() !== itemId.toString()
  );
  
  await this.save();
  return this;
};

ItemSchema.methods.addFile = async function(fileData, userId) {
  this.files.push({
    ...fileData,
    uploadedBy: userId,
    uploadedAt: new Date()
  });
  
  if (userId) {
    this.usage.accessHistory.push({
      user: userId,
      action: 'edit',
      details: `Fichier ajouté: ${fileData.name}`
    });
  }
  
  await this.save();
  return this;
};

ItemSchema.methods.removeFile = async function(fileId, userId) {
  this.files = this.files.filter(f => f._id.toString() !== fileId.toString());
  
  if (userId) {
    this.usage.accessHistory.push({
      user: userId,
      action: 'edit',
      details: 'Fichier supprimé'
    });
  }
  
  await this.save();
  return this;
};

ItemSchema.methods.validate = async function() {
  const errors = [];
  
  if (!this.validation.rules || this.validation.rules.length === 0) {
    this.validation.isValid = true;
    this.validation.validationErrors = [];
    this.validation.lastValidated = new Date();
    return true;
  }
  
  // Appliquer les règles de validation
  for (const rule of this.validation.rules) {
    const fieldValue = this.data[rule.field];
    
    switch (rule.rule) {
    case 'required':
      if (!fieldValue) {
        errors.push({
          field: rule.field,
          message: rule.message || `Le champ ${rule.field} est requis`,
          code: 'REQUIRED'
        });
      }
      break;
      
    case 'format':
      if (fieldValue && rule.value && !new RegExp(rule.value).test(fieldValue)) {
        errors.push({
          field: rule.field,
          message: rule.message || `Le format du champ ${rule.field} est invalide`,
          code: 'FORMAT'
        });
      }
      break;
      
    case 'range':
      if (fieldValue && rule.value) {
        const { min, max } = rule.value;
        if ((min !== undefined && fieldValue < min) || (max !== undefined && fieldValue > max)) {
          errors.push({
            field: rule.field,
            message: rule.message || `La valeur du champ ${rule.field} est hors limite`,
            code: 'RANGE'
          });
        }
      }
      break;
    }
  }
  
  this.validation.isValid = errors.length === 0;
  this.validation.validationErrors = errors;
  this.validation.lastValidated = new Date();
  
  return this.validation.isValid;
};

ItemSchema.methods.archive = async function(userId, reason) {
  this.status = 'archived';
  this.lifecycle.archived = {
    by: userId,
    at: new Date(),
    reason
  };
  
  this.usage.accessHistory.push({
    user: userId,
    action: 'delete',
    details: `Item archivé: ${reason}`
  });
  
  await this.save();
  return this;
};

ItemSchema.methods.duplicate = async function(userId, newName) {
  const ItemModel = this.constructor;
  
  const duplicatedData = this.toObject();
  delete duplicatedData._id;
  delete duplicatedData.identifier;
  delete duplicatedData.createdAt;
  delete duplicatedData.updatedAt;
  
  duplicatedData.name = newName || `${this.name} (Copie)`;
  duplicatedData.lifecycle.created = {
    by: userId,
    at: new Date(),
    reason: `Dupliqué depuis ${this.identifier}`
  };
  
  const duplicatedItem = new ItemModel(duplicatedData);
  await duplicatedItem.save();
  
  return duplicatedItem;
};

ItemSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  
  // Masquer les informations sensibles selon les permissions
  // Cette logique pourrait être améliorée selon les besoins
  return obj;
};

// Méthodes statiques
ItemSchema.statics.findByType = function(type, options = {}) {
  const query = { type };
  
  if (options.status) {
    query.status = options.status;
  } else {
    query.status = 'active';
  }
  
  return this.find(query).sort({ name: 1 });
};

ItemSchema.statics.findByOwner = function(userId, options = {}) {
  const query = { 'access.owner': userId };
  
  if (options.type) {
    query.type = options.type;
  }
  
  if (options.status) {
    query.status = options.status;
  }
  
  return this.find(query).sort({ 'lifecycle.created.at': -1 });
};

ItemSchema.statics.findAccessible = function(userId, permission = 'read') {
  return this.find({
    $or: [
      { 'access.owner': userId },
      { 'access.visibility': 'public' },
      {
        'access.collaborators': {
          $elemMatch: {
            user: userId,
            permissions: permission
          }
        }
      }
    ],
    status: 'active'
  }).sort({ 'usage.lastAccessed': -1 });
};

ItemSchema.statics.searchItems = function(query, options = {}) {
  const searchQuery = {
    $or: [
      { name: new RegExp(query, 'i') },
      { description: new RegExp(query, 'i') },
      { identifier: new RegExp(query, 'i') },
      { tags: new RegExp(query, 'i') }
    ],
    status: 'active'
  };
  
  if (options.type) {
    searchQuery.type = options.type;
  }
  
  if (options.category) {
    searchQuery.category = options.category;
  }
  
  if (options.owner) {
    searchQuery['access.owner'] = options.owner;
  }
  
  return this.find(searchQuery).sort({ 'usage.views': -1 });
};

ItemSchema.statics.getStatistics = async function(options = {}) {
  const matchQuery = {};
  
  if (options.type) {
    matchQuery.type = options.type;
  }
  
  if (options.dateFrom) {
    matchQuery['lifecycle.created.at'] = { $gte: options.dateFrom };
  }
  
  const [totalItems, byType, byStatus, usage] = await Promise.all([
    this.countDocuments(matchQuery),
    this.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]),
    this.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    this.aggregate([
      { $match: matchQuery },
      { $group: {
        _id: null,
        totalViews: { $sum: '$usage.views' },
        totalDownloads: { $sum: '$usage.downloads' },
        avgViews: { $avg: '$usage.views' }
      }}
    ])
  ]);
  
  return {
    total: totalItems,
    byType: byType.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    byStatus: byStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    usage: usage[0] || { totalViews: 0, totalDownloads: 0, avgViews: 0 }
  };
};

ItemSchema.statics.findDependents = function(itemId) {
  return this.find({
    'relationships.dependencies.item': itemId
  }).select('name identifier type relationships.dependencies');
};

ItemSchema.statics.findOrphans = function() {
  return this.find({
    'relationships.parent': { $exists: false },
    'relationships.dependencies': { $size: 0 },
    status: 'active'
  });
};

// Middleware pre-save
ItemSchema.pre('save', async function(next) {
  // Mettre à jour les métadonnées de modification
  if (!this.isNew) {
    this.lifecycle.modified = {
      by: this._currentUser,
      at: new Date()
    };
  }
  
  // Normaliser les tags
  if (this.tags && this.tags.length > 0) {
    this.tags = this.tags.map(tag => tag.toLowerCase().trim()).filter(tag => tag.length > 0);
    this.tags = [...new Set(this.tags)];
  }
  
  // Générer le nom d'affichage s'il n'est pas fourni
  if (!this.displayName) {
    this.displayName = this.name;
  }
  
  // Valider les données si des règles existent
  if (this.validation.rules && this.validation.rules.length > 0) {
    await this.validate();
  }
  
  next();
});

// Middleware post-save
ItemSchema.post('save', async function(doc) {
  // Mettre à jour les relations parent-enfant
  if (doc.relationships.parent) {
    await doc.constructor.updateOne(
      { _id: doc.relationships.parent },
      { $addToSet: { 'relationships.children': doc._id } }
    );
  }
});

// Middleware pre-remove
ItemSchema.pre('remove', async function(next) {
  // Nettoyer les relations
  if (this.relationships.parent) {
    await this.constructor.updateOne(
      { _id: this.relationships.parent },
      { $pull: { 'relationships.children': this._id } }
    );
  }
  
  // Supprimer les références dans les dépendances d'autres items
  await this.constructor.updateMany(
    { 'relationships.dependencies.item': this._id },
    { $pull: { 'relationships.dependencies': { item: this._id } } }
  );
  
  next();
});

// Plugin de pagination
ItemSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Item', ItemSchema);
