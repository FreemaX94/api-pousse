const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const nieuwkoopItemSchema = new Schema({
  reference: {
    type: String,
    required: [true, 'La référence est requise'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^[A-Z0-9\-_]+$/, 'La référence ne peut contenir que des lettres majuscules, chiffres, tirets et underscores'],
    maxlength: [50, 'La référence ne peut dépasser 50 caractères'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    maxlength: [200, 'Le nom ne peut dépasser 200 caractères'],
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La description ne peut dépasser 1000 caractères']
  },
  dimensions: {
    height: {
      type: Number,
      min: [0, 'La hauteur ne peut être négative'],
      max: [1000, 'La hauteur ne peut dépasser 1000 cm']
    },
    diameter: {
      type: Number,
      min: [0, 'Le diamètre ne peut être négatif'],
      max: [1000, 'Le diamètre ne peut dépasser 1000 cm']
    },
    width: {
      type: Number,
      min: [0, 'La largeur ne peut être négative'],
      max: [1000, 'La largeur ne peut dépasser 1000 cm']
    },
    depth: {
      type: Number,
      min: [0, 'La profondeur ne peut être négative'],
      max: [1000, 'La profondeur ne peut dépasser 1000 cm']
    },
    unit: {
      type: String,
      enum: ['cm', 'm', 'mm'],
      default: 'cm'
    }
  },
  pricing: {
    price: {
      type: Number,
      required: [true, 'Le prix est requis'],
      min: [0, 'Le prix ne peut être négatif']
    },
    currency: {
      type: String,
      default: 'EUR',
      enum: ['EUR', 'USD', 'GBP'],
      uppercase: true
    },
    pricePerUnit: {
      type: Number,
      min: [0, 'Le prix unitaire ne peut être négatif']
    },
    minimumOrder: {
      type: Number,
      default: 1,
      min: [1, 'La quantité minimale doit être au moins 1']
    },
    priceRanges: [{
      minQuantity: {
        type: Number,
        required: true,
        min: [1, 'La quantité minimale doit être au moins 1']
      },
      maxQuantity: {
        type: Number,
        validate: {
          validator: function(v) {
            return v >= this.minQuantity;
          },
          message: 'La quantité maximale doit être supérieure à la quantité minimale'
        }
      },
      unitPrice: {
        type: Number,
        required: true,
        min: [0, 'Le prix unitaire ne peut être négatif']
      }
    }]
  },
  images: [{
    url: {
      type: String,
      required: true,
      trim: true
    },
    alt: {
      type: String,
      trim: true,
      maxlength: [200, 'Le texte alternatif ne peut dépasser 200 caractères']
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      enum: ['product', 'detail', 'context', 'technical'],
      default: 'product'
    }
  }],
  stock: {
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'La quantité ne peut être négative'],
      index: true
    },
    reservedQuantity: {
      type: Number,
      default: 0,
      min: [0, 'La quantité réservée ne peut être négative']
    },
    availableQuantity: {
      type: Number,
      default: 0,
      min: [0, 'La quantité disponible ne peut être négative']
    },
    location: {
      warehouse: {
        type: String,
        trim: true,
        maxlength: [100, 'Le nom de l\'entrepôt ne peut dépasser 100 caractères']
      },
      section: {
        type: String,
        trim: true,
        maxlength: [50, 'La section ne peut dépasser 50 caractères']
      },
      shelf: {
        type: String,
        trim: true,
        maxlength: [50, 'L\'étagère ne peut dépasser 50 caractères']
      }
    },
    minimumAlert: {
      type: Number,
      default: 0,
      min: [0, 'Le seuil d\'alerte ne peut être négatif']
    },
    lastRestocked: {
      type: Date,
      default: Date.now
    }
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: {
      values: ['plante', 'contenant', 'noel', 'artificiel', 'seche', 'entretien', 'decoration', 'outil', 'externe', 'autre'],
      message: 'Catégorie invalide : {VALUE}'
    },
    default: 'autre',
    index: true
  },
  subcategory: {
    type: String,
    trim: true,
    maxlength: [100, 'La sous-catégorie ne peut dépasser 100 caractères']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Un tag ne peut dépasser 50 caractères']
  }],
  specifications: {
    season: {
      type: String,
      enum: ['printemps', 'ete', 'automne', 'hiver', 'toute_saison'],
      default: 'toute_saison'
    },
    careLevel: {
      type: String,
      enum: ['facile', 'moyen', 'difficile'],
      default: 'moyen'
    },
    lightRequirement: {
      type: String,
      enum: ['plein_soleil', 'mi_ombre', 'ombre', 'indirect'],
      default: 'indirect'
    },
    waterRequirement: {
      type: String,
      enum: ['faible', 'moyen', 'eleve'],
      default: 'moyen'
    },
    color: {
      type: String,
      trim: true,
      maxlength: [50, 'La couleur ne peut dépasser 50 caractères']
    },
    material: {
      type: String,
      enum: ['ceramique', 'plastique', 'metal', 'bois', 'verre', 'terre_cuite', 'resine', 'autre'],
      default: 'autre'
    },
    isOutdoor: {
      type: Boolean,
      default: false
    },
    isIndoor: {
      type: Boolean,
      default: true
    },
    isFragile: {
      type: Boolean,
      default: false
    }
  },
  supplier: {
    name: {
      type: String,
      default: 'Nieuwkoop',
      trim: true,
      maxlength: [200, 'Le nom du fournisseur ne peut dépasser 200 caractères']
    },
    code: {
      type: String,
      trim: true,
      maxlength: [50, 'Le code fournisseur ne peut dépasser 50 caractères']
    },
    contact: {
      email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Format d\'email invalide']
      },
      phone: {
        type: String,
        trim: true,
        match: [/^[+\d\s-.()]+$/, 'Format de téléphone invalide']
      }
    },
    leadTime: {
      type: Number,
      default: 7,
      min: [0, 'Le délai de livraison ne peut être négatif']
    }
  },
  availability: {
    status: {
      type: String,
      enum: ['available', 'low_stock', 'out_of_stock', 'discontinued', 'preorder'],
      default: 'available',
      index: true
    },
    seasonalAvailability: [{
      type: String,
      enum: ['printemps', 'ete', 'automne', 'hiver']
    }],
    expectedRestockDate: {
      type: Date,
      validate: {
        validator: function(v) {
          if (!v) return true;
          return v >= new Date();
        },
        message: 'La date de réapprovisionnement ne peut être dans le passé'
      }
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Les notes ne peuvent dépasser 1000 caractères']
  },
  salesHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'La quantité vendue doit être au moins 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Le prix ne peut être négatif']
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice'
    }
  }],
  lastSync: {
    type: Date,
    default: Date.now
  },
  metadata: {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    importBatch: {
      type: String,
      trim: true
    },
    source: {
      type: String,
      enum: ['manual', 'import', 'api', 'external'],
      default: 'import'
    },
    isExternal: {
      type: Boolean,
      default: false,
      index: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composés pour les recherches fréquentes
nieuwkoopItemSchema.index({ name: 'text', description: 'text' });
nieuwkoopItemSchema.index({ category: 1, 'availability.status': 1 });
nieuwkoopItemSchema.index({ 'stock.quantity': 1, 'availability.status': 1 });
nieuwkoopItemSchema.index({ 'pricing.price': 1, category: 1 });
nieuwkoopItemSchema.index({ tags: 1 });

// Virtuals
nieuwkoopItemSchema.virtual('isLowStock').get(function() {
  return this.stock.quantity <= this.stock.minimumAlert;
});

nieuwkoopItemSchema.virtual('isOutOfStock').get(function() {
  return this.stock.quantity === 0;
});

nieuwkoopItemSchema.virtual('actualAvailableQuantity').get(function() {
  return Math.max(0, this.stock.quantity - this.stock.reservedQuantity);
});

nieuwkoopItemSchema.virtual('priceFormatted').get(function() {
  if (!this.pricing || typeof this.pricing.price !== 'number') {
    return '0.00 EUR';
  }
  return `${this.pricing.price.toFixed(2)} ${this.pricing.currency || 'EUR'}`;
});

nieuwkoopItemSchema.virtual('primaryImage').get(function() {
  if (!this.images || this.images.length === 0) return null;
  return this.images.find(img => img.isPrimary) || this.images[0];
});

nieuwkoopItemSchema.virtual('dimensionsFormatted').get(function() {
  const dims = this.dimensions;
  if (!dims) return null;
  
  const parts = [];
  if (dims.height) parts.push(`H: ${dims.height}${dims.unit}`);
  if (dims.diameter) parts.push(`Ø: ${dims.diameter}${dims.unit}`);
  if (dims.width) parts.push(`L: ${dims.width}${dims.unit}`);
  if (dims.depth) parts.push(`P: ${dims.depth}${dims.unit}`);
  
  return parts.join(' x ');
});

// Méthodes d'instance
nieuwkoopItemSchema.methods.reserveStock = async function(quantity) {
  if (quantity <= 0) {
    throw new Error('La quantité à réserver doit être positive');
  }
  
  if (this.actualAvailableQuantity < quantity) {
    throw new Error('Stock insuffisant pour la réservation');
  }
  
  this.stock.reservedQuantity += quantity;
  this.stock.availableQuantity = this.actualAvailableQuantity;
  
  await this.save();
  return this;
};

nieuwkoopItemSchema.methods.releaseStock = async function(quantity) {
  if (quantity <= 0) {
    throw new Error('La quantité à libérer doit être positive');
  }
  
  if (this.stock.reservedQuantity < quantity) {
    throw new Error('Quantité réservée insuffisante');
  }
  
  this.stock.reservedQuantity -= quantity;
  this.stock.availableQuantity = this.actualAvailableQuantity;
  
  await this.save();
  return this;
};

nieuwkoopItemSchema.methods.removeFromStock = async function(quantity) {
  if (quantity <= 0) {
    throw new Error('La quantité à retirer doit être positive');
  }
  
  if (this.stock.quantity < quantity) {
    throw new Error('Stock insuffisant');
  }
  
  this.stock.quantity -= quantity;
  this.stock.availableQuantity = this.actualAvailableQuantity;
  
  // Mettre à jour le statut de disponibilité
  this.updateAvailabilityStatus();
  
  await this.save();
  return this;
};

nieuwkoopItemSchema.methods.addToStock = async function(quantity) {
  if (quantity <= 0) {
    throw new Error('La quantité à ajouter doit être positive');
  }
  
  this.stock.quantity += quantity;
  this.stock.availableQuantity = this.actualAvailableQuantity;
  this.stock.lastRestocked = new Date();
  
  // Mettre à jour le statut de disponibilité
  this.updateAvailabilityStatus();
  
  await this.save();
  return this;
};

nieuwkoopItemSchema.methods.updateAvailabilityStatus = function() {
  if (this.stock.quantity === 0) {
    this.availability.status = 'out_of_stock';
  } else if (this.isLowStock) {
    this.availability.status = 'low_stock';
  } else {
    this.availability.status = 'available';
  }
};

nieuwkoopItemSchema.methods.getPriceForQuantity = function(quantity) {
  if (!this.pricing.priceRanges || this.pricing.priceRanges.length === 0) {
    return this.pricing.price;
  }
  
  // Trouver la tranche de prix appropriée
  const ranges = this.pricing.priceRanges.sort((a, b) => a.minQuantity - b.minQuantity);
  
  let applicableRange = null;
  for (const range of ranges) {
    if (quantity >= range.minQuantity && (!range.maxQuantity || quantity <= range.maxQuantity)) {
      applicableRange = range;
      break;
    }
  }
  
  return applicableRange ? applicableRange.unitPrice : this.pricing.price;
};

nieuwkoopItemSchema.methods.addSale = async function(quantity, price, customer, invoice) {
  this.salesHistory.push({
    quantity,
    price,
    customer,
    invoice
  });
  
  await this.removeFromStock(quantity, 'sale');
  return this;
};

nieuwkoopItemSchema.methods.setPrimaryImage = async function(imageIndex) {
  if (!this.images || imageIndex >= this.images.length) {
    throw new Error('Index d\'image invalide');
  }
  
  // Retirer le statut primary de toutes les images
  this.images.forEach(img => img.isPrimary = false);
  
  // Définir la nouvelle image primaire
  this.images[imageIndex].isPrimary = true;
  
  await this.save();
  return this;
};

nieuwkoopItemSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Méthodes statiques
nieuwkoopItemSchema.statics.findByCategory = function(category) {
  return this.find({ 
    category, 
    'availability.isActive': true 
  }).sort({ name: 1 });
};

nieuwkoopItemSchema.statics.findLowStock = function() {
  return this.find({
    'availability.isActive': true,
    $expr: { $lte: ['$stock.quantity', '$stock.minimumAlert'] }
  }).sort({ 'stock.quantity': 1 });
};

nieuwkoopItemSchema.statics.findOutOfStock = function() {
  return this.find({
    'availability.isActive': true,
    'stock.quantity': 0
  }).sort({ name: 1 });
};

nieuwkoopItemSchema.statics.searchItems = function(query, options = {}) {
  const searchQuery = {
    'availability.isActive': true,
    $or: [
      { name: new RegExp(query, 'i') },
      { description: new RegExp(query, 'i') },
      { reference: new RegExp(query, 'i') },
      { tags: new RegExp(query, 'i') }
    ]
  };
  
  if (options.category) {
    searchQuery.category = options.category;
  }
  
  if (options.priceRange) {
    searchQuery['pricing.price'] = {
      $gte: options.priceRange.min || 0,
      $lte: options.priceRange.max || Number.MAX_VALUE
    };
  }
  
  if (options.inStock) {
    searchQuery['stock.quantity'] = { $gt: 0 };
  }
  
  return this.find(searchQuery).sort({ name: 1 });
};

nieuwkoopItemSchema.statics.getTopSellers = function(limit = 10, dateFrom) {
  const matchStage = {};
  if (dateFrom) {
    matchStage['salesHistory.date'] = { $gte: dateFrom };
  }
  
  return this.aggregate([
    { $unwind: '$salesHistory' },
    { $match: matchStage },
    { $group: {
      _id: '$_id',
      name: { $first: '$name' },
      reference: { $first: '$reference' },
      totalSold: { $sum: '$salesHistory.quantity' },
      totalRevenue: { $sum: { $multiply: ['$salesHistory.quantity', '$salesHistory.price'] } }
    }},
    { $sort: { totalSold: -1 } },
    { $limit: limit }
  ]);
};

nieuwkoopItemSchema.statics.getInventoryValue = async function() {
  const result = await this.aggregate([
    { $match: { 'availability.isActive': true } },
    { $group: {
      _id: null,
      totalItems: { $sum: '$stock.quantity' },
      totalValue: { $sum: { $multiply: ['$stock.quantity', '$pricing.price'] } }
    }}
  ]);
  
  return result[0] || { totalItems: 0, totalValue: 0 };
};

// Middleware pre-save
nieuwkoopItemSchema.pre('save', function(next) {
  // Calculer la quantité disponible
  this.stock.availableQuantity = Math.max(0, this.stock.quantity - this.stock.reservedQuantity);
  
  // Mettre à jour le statut de disponibilité
  this.updateAvailabilityStatus();
  
  // Valider qu'il y a au moins une image primaire
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter(img => img.isPrimary);
    if (primaryImages.length === 0) {
      this.images[0].isPrimary = true;
    } else if (primaryImages.length > 1) {
      // S'assurer qu'il n'y a qu'une seule image primaire
      this.images.forEach((img, index) => {
        img.isPrimary = index === 0;
      });
      this.images[0].isPrimary = true;
    }
  }
  
  // Normaliser les tags
  if (this.tags && this.tags.length > 0) {
    this.tags = this.tags.map(tag => tag.toLowerCase().trim()).filter(tag => tag.length > 0);
    // Supprimer les doublons
    this.tags = [...new Set(this.tags)];
  }
  
  next();
});

// Middleware post-save pour les notifications de stock
nieuwkoopItemSchema.post('save', function(doc) {
  // Ici on pourrait implémenter l'envoi de notifications
  // pour les alertes de stock faible
  if (doc.isLowStock && doc.availability.status === 'low_stock') {
    // Envoyer une notification de stock faible
    console.log(`Alerte stock faible pour ${doc.name} (${doc.reference})`);
  }
});

// Plugin de pagination
nieuwkoopItemSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('NieuwkoopItem', nieuwkoopItemSchema);
