const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const ProduitSchema = new Schema({
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
    required: [true, 'Le nom du produit est requis'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    maxlength: [200, 'Le nom ne peut dépasser 200 caractères'],
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'La description ne peut dépasser 2000 caractères'],
    default: ''
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'La description courte ne peut dépasser 500 caractères']
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: {
      values: ['fleurs', 'plantes', 'contenants', 'decoration', 'outils', 'engrais', 'semences', 'accessoires', 'autre'],
      message: 'Catégorie invalide : {VALUE}'
    },
    index: true
  },
  subcategory: {
    type: String,
    trim: true,
    maxlength: [100, 'La sous-catégorie ne peut dépasser 100 caractères'],
    index: true
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [100, 'La marque ne peut dépasser 100 caractères'],
    index: true
  },
  pricing: {
    price: {
      type: Number,
      required: [true, 'Le prix est requis'],
      min: [0, 'Le prix ne peut être négatif'],
      index: true
    },
    currency: {
      type: String,
      default: 'EUR',
      enum: ['EUR', 'USD', 'GBP'],
      uppercase: true
    },
    costPrice: {
      type: Number,
      min: [0, 'Le prix de revient ne peut être négatif']
    },
    wholesalePrice: {
      type: Number,
      min: [0, 'Le prix de gros ne peut être négatif']
    },
    tva: {
      taux: {
        type: Number,
        default: 20,
        min: [0, 'Le taux de TVA ne peut être négatif'],
        max: [100, 'Le taux de TVA ne peut dépasser 100%']
      },
      montant: {
        type: Number,
        default: 0,
        min: [0, 'Le montant de TVA ne peut être négatif']
      }
    },
    priceHistory: [{
      price: {
        type: Number,
        required: true,
        min: [0, 'Le prix ne peut être négatif']
      },
      date: {
        type: Date,
        default: Date.now
      },
      reason: {
        type: String,
        maxlength: [200, 'La raison ne peut dépasser 200 caractères']
      }
    }],
    promotions: [{
      type: {
        type: String,
        enum: ['percentage', 'fixed', 'bulk'],
        default: 'percentage'
      },
      value: {
        type: Number,
        required: true,
        min: [0, 'La valeur de promotion ne peut être négative']
      },
      startDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
        required: true,
        validate: {
          validator: function(value) {
            return value > this.startDate;
          },
          message: 'La date de fin doit être après la date de début'
        }
      },
      active: {
        type: Boolean,
        default: true
      },
      minimumQuantity: {
        type: Number,
        default: 1,
        min: [1, 'La quantité minimale doit être au moins 1']
      }
    }]
  },
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
    minimumStock: {
      type: Number,
      default: 0,
      min: [0, 'Le stock minimum ne peut être négatif']
    },
    maxStock: {
      type: Number,
      min: [0, 'Le stock maximum ne peut être négatif']
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
    trackingEnabled: {
      type: Boolean,
      default: true
    },
    lastRestocked: {
      type: Date,
      default: Date.now
    },
    reorderPoint: {
      type: Number,
      default: 0,
      min: [0, 'Le point de recommande ne peut être négatif']
    }
  },
  dimensions: {
    length: {
      type: Number,
      min: [0, 'La longueur ne peut être négative']
    },
    width: {
      type: Number,
      min: [0, 'La largeur ne peut être négative']
    },
    height: {
      type: Number,
      min: [0, 'La hauteur ne peut être négative']
    },
    weight: {
      type: Number,
      min: [0, 'Le poids ne peut être négatif']
    },
    unit: {
      type: String,
      enum: ['cm', 'm', 'mm'],
      default: 'cm'
    },
    weightUnit: {
      type: String,
      enum: ['g', 'kg'],
      default: 'kg'
    }
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
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  specifications: {
    color: {
      type: String,
      trim: true,
      maxlength: [50, 'La couleur ne peut dépasser 50 caractères']
    },
    material: {
      type: String,
      trim: true,
      maxlength: [100, 'Le matériau ne peut dépasser 100 caractères']
    },
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Unique'],
      default: 'Unique'
    },
    season: {
      type: String,
      enum: ['printemps', 'ete', 'automne', 'hiver', 'toute_saison'],
      default: 'toute_saison'
    },
    careInstructions: {
      type: String,
      maxlength: [500, 'Les instructions d\'entretien ne peuvent dépasser 500 caractères']
    },
    isFragile: {
      type: Boolean,
      default: false
    },
    isPerishable: {
      type: Boolean,
      default: false
    },
    shelfLife: {
      type: Number,
      min: [0, 'La durée de conservation ne peut être négative']
    },
    shelfLifeUnit: {
      type: String,
      enum: ['days', 'weeks', 'months', 'years'],
      default: 'days'
    }
  },
  supplier: {
    name: {
      type: String,
      trim: true,
      maxlength: [200, 'Le nom du fournisseur ne peut dépasser 200 caractères']
    },
    reference: {
      type: String,
      trim: true,
      maxlength: [100, 'La référence fournisseur ne peut dépasser 100 caractères']
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
    },
    minimumOrderQuantity: {
      type: Number,
      default: 1,
      min: [1, 'La quantité minimale doit être au moins 1']
    }
  },
  seo: {
    title: {
      type: String,
      trim: true,
      maxlength: [60, 'Le titre SEO ne peut dépasser 60 caractères']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [160, 'La description SEO ne peut dépasser 160 caractères']
    },
    keywords: [{
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [50, 'Un mot-clé ne peut dépasser 50 caractères']
    }],
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets']
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Un tag ne peut dépasser 50 caractères']
  }],
  availability: {
    status: {
      type: String,
      enum: ['available', 'low_stock', 'out_of_stock', 'discontinued', 'preorder'],
      default: 'available',
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    visibleOnWebsite: {
      type: Boolean,
      default: true
    },
    launchDate: {
      type: Date,
      default: Date.now
    },
    discontinuedDate: {
      type: Date,
      validate: {
        validator: function(value) {
          if (!value) return true;
          return value >= this.launchDate;
        },
        message: 'La date d\'arrêt doit être après la date de lancement'
      }
    }
  },
  sales: {
    totalSold: {
      type: Number,
      default: 0,
      min: [0, 'Le total vendu ne peut être négatif']
    },
    totalRevenue: {
      type: Number,
      default: 0,
      min: [0, 'Le chiffre d\'affaires ne peut être négatif']
    },
    averageRating: {
      type: Number,
      min: [0, 'La note moyenne ne peut être négative'],
      max: [5, 'La note moyenne ne peut dépasser 5']
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, 'Le nombre d\'avis ne peut être négatif']
    },
    lastSold: {
      type: Date
    }
  },
  reviews: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'La note minimale est 1'],
      max: [5, 'La note maximale est 5']
    },
    comment: {
      type: String,
      maxlength: [1000, 'Le commentaire ne peut dépasser 1000 caractères']
    },
    verified: {
      type: Boolean,
      default: false
    },
    helpful: {
      type: Number,
      default: 0,
      min: [0, 'Le nombre d\'avis utiles ne peut être négatif']
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  relatedProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Produit'
  }],
  variants: [{
    type: Schema.Types.ObjectId,
    ref: 'Produit'
  }],
  crossSells: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Produit',
      required: true
    },
    relevance: {
      type: Number,
      min: [0, 'La pertinence ne peut être négative'],
      max: [100, 'La pertinence ne peut dépasser 100']
    }
  }],
  metadata: {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
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
      enum: ['manual', 'import', 'api'],
      default: 'manual'
    },
    notes: {
      type: String,
      maxlength: [1000, 'Les notes ne peuvent dépasser 1000 caractères']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composés pour les recherches fréquentes
ProduitSchema.index({ name: 'text', description: 'text', shortDescription: 'text' });
ProduitSchema.index({ category: 1, 'availability.status': 1 });
ProduitSchema.index({ 'stock.quantity': 1, 'availability.status': 1 });
ProduitSchema.index({ 'pricing.price': 1, category: 1 });
ProduitSchema.index({ brand: 1, category: 1 });
ProduitSchema.index({ tags: 1 });
ProduitSchema.index({ 'seo.keywords': 1 });

// Génération automatique de la référence
ProduitSchema.pre('validate', async function(next) {
  if (this.isNew && !this.reference) {
    const categoryPrefix = this.category.substring(0, 3).toUpperCase();
    
    const lastProduct = await this.constructor.findOne({
      reference: new RegExp(`^${categoryPrefix}-`)
    }).sort({ reference: -1 });
    
    let sequence = 1;
    if (lastProduct) {
      const lastSequence = parseInt(lastProduct.reference.split('-').pop());
      sequence = lastSequence + 1;
    }
    
    this.reference = `${categoryPrefix}-${String(sequence).padStart(4, '0')}`;
  }
  next();
});

// Virtuals
ProduitSchema.virtual('availableQuantity').get(function() {
  return Math.max(0, this.stock.quantity - this.stock.reservedQuantity);
});

ProduitSchema.virtual('isLowStock').get(function() {
  return this.stock.quantity <= this.stock.minimumStock;
});

ProduitSchema.virtual('isOutOfStock').get(function() {
  return this.stock.quantity === 0;
});

ProduitSchema.virtual('priceWithVAT').get(function() {
  const vatAmount = this.pricing.price * (this.pricing.tva.taux / 100);
  return Math.round((this.pricing.price + vatAmount) * 100) / 100;
});

ProduitSchema.virtual('margin').get(function() {
  if (!this.pricing.costPrice) return 0;
  return Math.round(((this.pricing.price - this.pricing.costPrice) / this.pricing.price) * 100 * 100) / 100;
});

ProduitSchema.virtual('primaryImage').get(function() {
  if (!this.images || this.images.length === 0) return null;
  return this.images.find(img => img.isPrimary) || this.images[0];
});

ProduitSchema.virtual('currentPromotion').get(function() {
  if (!this.pricing.promotions || this.pricing.promotions.length === 0) return null;
  
  const now = new Date();
  return this.pricing.promotions.find(promo => 
    promo.active && promo.startDate <= now && promo.endDate >= now
  );
});

ProduitSchema.virtual('discountedPrice').get(function() {
  const promotion = this.currentPromotion;
  if (!promotion) return this.pricing.price;
  
  if (promotion.type === 'percentage') {
    return Math.round((this.pricing.price * (1 - promotion.value / 100)) * 100) / 100;
  } else if (promotion.type === 'fixed') {
    return Math.max(0, this.pricing.price - promotion.value);
  }
  
  return this.pricing.price;
});

ProduitSchema.virtual('dimensionsFormatted').get(function() {
  const dims = this.dimensions;
  if (!dims) return null;
  
  const parts = [];
  if (dims.length) parts.push(`L: ${dims.length}${dims.unit}`);
  if (dims.width) parts.push(`l: ${dims.width}${dims.unit}`);
  if (dims.height) parts.push(`H: ${dims.height}${dims.unit}`);
  if (dims.weight) parts.push(`${dims.weight}${dims.weightUnit}`);
  
  return parts.join(' x ');
});

ProduitSchema.virtual('stockStatus').get(function() {
  if (this.stock.quantity === 0) return 'out_of_stock';
  if (this.stock.quantity <= this.stock.minimumStock) return 'low_stock';
  return 'available';
});

// Méthodes d'instance
ProduitSchema.methods.updateStock = async function(quantity, operation = 'add') {
  if (operation === 'add') {
    this.stock.quantity += quantity;
    this.stock.lastRestocked = new Date();
  } else if (operation === 'remove') {
    if (this.stock.quantity < quantity) {
      throw new Error('Stock insuffisant');
    }
    this.stock.quantity -= quantity;
  } else if (operation === 'set') {
    this.stock.quantity = quantity;
  }
  
  // Mettre à jour le statut de disponibilité
  this.updateAvailabilityStatus();
  
  await this.save();
  return this;
};

ProduitSchema.methods.reserveStock = async function(quantity) {
  if (this.availableQuantity < quantity) {
    throw new Error('Stock disponible insuffisant');
  }
  
  this.stock.reservedQuantity += quantity;
  await this.save();
  return this;
};

ProduitSchema.methods.releaseStock = async function(quantity) {
  if (this.stock.reservedQuantity < quantity) {
    throw new Error('Quantité réservée insuffisante');
  }
  
  this.stock.reservedQuantity -= quantity;
  await this.save();
  return this;
};

ProduitSchema.methods.updateAvailabilityStatus = function() {
  if (this.stock.quantity === 0) {
    this.availability.status = 'out_of_stock';
  } else if (this.stock.quantity <= this.stock.minimumStock) {
    this.availability.status = 'low_stock';
  } else {
    this.availability.status = 'available';
  }
};

ProduitSchema.methods.addReview = async function(reviewData) {
  this.reviews.push(reviewData);
  
  // Recalculer la note moyenne
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.sales.averageRating = Math.round((totalRating / this.reviews.length) * 100) / 100;
  this.sales.reviewCount = this.reviews.length;
  
  await this.save();
  return this;
};

ProduitSchema.methods.updatePrice = async function(newPrice, reason) {
  // Ajouter à l'historique des prix
  this.pricing.priceHistory.push({
    price: this.pricing.price,
    reason: reason || 'Mise à jour manuelle'
  });
  
  this.pricing.price = newPrice;
  
  // Recalculer le montant de TVA
  this.pricing.tva.montant = Math.round((newPrice * this.pricing.tva.taux / 100) * 100) / 100;
  
  await this.save();
  return this;
};

ProduitSchema.methods.addPromotion = async function(promotionData) {
  // Désactiver les promotions existantes si nécessaire
  if (promotionData.active) {
    this.pricing.promotions.forEach(promo => {
      if (promo.active) promo.active = false;
    });
  }
  
  this.pricing.promotions.push(promotionData);
  await this.save();
  return this;
};

ProduitSchema.methods.setPrimaryImage = async function(imageIndex) {
  if (!this.images || imageIndex >= this.images.length) {
    throw new Error('Index d\'image invalide');
  }
  
  this.images.forEach(img => img.isPrimary = false);
  this.images[imageIndex].isPrimary = true;
  
  await this.save();
  return this;
};

ProduitSchema.methods.generateSlug = function() {
  if (!this.name) return '';
  
  return this.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

ProduitSchema.methods.recordSale = async function(quantity, price) {
  this.sales.totalSold += quantity;
  this.sales.totalRevenue += quantity * price;
  this.sales.lastSold = new Date();
  
  // Retirer du stock
  await this.updateStock(quantity, 'remove');
  
  return this;
};

ProduitSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Méthodes statiques
ProduitSchema.statics.findByCategory = function(category, options = {}) {
  const query = { 
    category,
    'availability.isActive': true
  };
  
  if (options.inStock) {
    query['stock.quantity'] = { $gt: 0 };
  }
  
  return this.find(query).sort({ name: 1 });
};

ProduitSchema.statics.findLowStock = function() {
  return this.find({
    'availability.isActive': true,
    $expr: { $lte: ['$stock.quantity', '$stock.minimumStock'] }
  }).sort({ 'stock.quantity': 1 });
};

ProduitSchema.statics.findOutOfStock = function() {
  return this.find({
    'availability.isActive': true,
    'stock.quantity': 0
  }).sort({ name: 1 });
};

ProduitSchema.statics.searchProducts = function(query, options = {}) {
  const searchQuery = {
    'availability.isActive': true,
    $or: [
      { name: new RegExp(query, 'i') },
      { description: new RegExp(query, 'i') },
      { reference: new RegExp(query, 'i') },
      { brand: new RegExp(query, 'i') },
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

ProduitSchema.statics.getTopSellers = function(limit = 10) {
  return this.find({
    'availability.isActive': true,
    'sales.totalSold': { $gt: 0 }
  })
    .sort({ 'sales.totalSold': -1 })
    .limit(limit)
    .select('name reference sales.totalSold sales.totalRevenue pricing.price');
};

ProduitSchema.statics.getInventoryValue = async function() {
  const result = await this.aggregate([
    { $match: { 'availability.isActive': true } },
    { $group: {
      _id: null,
      totalItems: { $sum: '$stock.quantity' },
      totalValue: { $sum: { $multiply: ['$stock.quantity', '$pricing.price'] } },
      totalProducts: { $sum: 1 }
    }}
  ]);
  
  return result[0] || { totalItems: 0, totalValue: 0, totalProducts: 0 };
};

ProduitSchema.statics.getStockAlerts = function() {
  return this.find({
    'availability.isActive': true,
    $or: [
      { 'stock.quantity': 0 },
      { $expr: { $lte: ['$stock.quantity', '$stock.reorderPoint'] } }
    ]
  }).sort({ 'stock.quantity': 1 });
};

// Middleware pre-save
ProduitSchema.pre('save', function(next) {
  // Générer le slug automatiquement
  if (!this.seo.slug || this.isModified('name')) {
    this.seo.slug = this.generateSlug();
  }
  
  // Mettre à jour le statut de disponibilité
  this.updateAvailabilityStatus();
  
  // Calculer le montant de TVA
  if (this.pricing.price && this.pricing.tva.taux) {
    this.pricing.tva.montant = Math.round((this.pricing.price * this.pricing.tva.taux / 100) * 100) / 100;
  }
  
  // Valider qu'il y a au moins une image primaire
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter(img => img.isPrimary);
    if (primaryImages.length === 0) {
      this.images[0].isPrimary = true;
    } else if (primaryImages.length > 1) {
      this.images.forEach((img, index) => {
        img.isPrimary = index === 0;
      });
    }
  }
  
  // Normaliser les tags
  if (this.tags && this.tags.length > 0) {
    this.tags = this.tags.map(tag => tag.toLowerCase().trim()).filter(tag => tag.length > 0);
    this.tags = [...new Set(this.tags)];
  }
  
  // Valider les promotions
  if (this.pricing.promotions && this.pricing.promotions.length > 0) {
    const now = new Date();
    this.pricing.promotions.forEach(promo => {
      if (promo.endDate < now) {
        promo.active = false;
      }
    });
  }
  
  next();
});

// Middleware pre-remove
ProduitSchema.pre('remove', async function(next) {
  // Vérifier s'il y a des commandes en cours
  const Invoice = mongoose.model('Invoice');
  const invoicesCount = await Invoice.countDocuments({
    'items.product': this._id,
    status: { $in: ['pending', 'confirmed', 'processing'] }
  });
  
  if (invoicesCount > 0) {
    throw new Error(`Impossible de supprimer ce produit car ${invoicesCount} commande(s) en cours y sont associées`);
  }
  
  next();
});

// Plugin de pagination
ProduitSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Produit', ProduitSchema);
