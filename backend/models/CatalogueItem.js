const mongoose = require('mongoose');
const { Schema } = mongoose;
const { getNextSequenceValue } = require('./Counter');

const CatalogueItemSchema = new Schema({
  itemId: { 
    type: String, 
    unique: true, 
    index: true 
  },
  categorie: { 
    type: String, 
    required: true, 
    enum: ['Plantes', 'Contenants', 'Décor', 'Artificiels', 'Séchés', 'Outils', 'Accessoires'],
    index: true 
  },
  nom: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 200,
    index: 'text'
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  infos: { 
    type: Schema.Types.Mixed,
    default: {}
  },
  price: {
    buyPrice: { type: Number, min: 0 },
    sellPrice: { type: Number, min: 0 },
    currency: { type: String, default: 'EUR' }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    unit: { type: String, default: 'cm' }
  },
  stock: {
    quantity: { type: Number, default: 0, min: 0 },
    minQuantity: { type: Number, default: 0, min: 0 },
    maxQuantity: { type: Number, min: 0 },
    location: String,
    reserved: { type: Number, default: 0, min: 0 }
  },
  supplier: {
    name: String,
    reference: String,
    contactInfo: {
      email: String,
      phone: String,
      address: String
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued', 'seasonal'],
    default: 'active',
    index: true
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  tags: [{ 
    type: String, 
    trim: true,
    lowercase: true 
  }],
  metadata: {
    source: { type: String, default: 'manual' },
    lastSyncDate: Date,
    externalId: String,
    quality: {
      type: String,
      enum: ['premium', 'standard', 'economy'],
      default: 'standard'
    }
  },
  seo: {
    slug: { 
      type: String, 
      unique: true, 
      sparse: true,
      index: true 
    },
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  availability: {
    isAvailable: { type: Boolean, default: true },
    seasonalStart: Date,
    seasonalEnd: Date,
    expectedRestockDate: Date
  },
  ratings: {
    average: { type: Number, min: 0, max: 5, default: 0 },
    count: { type: Number, default: 0 },
    reviews: [{
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      author: { type: Schema.Types.ObjectId, ref: 'User' },
      date: { type: Date, default: Date.now }
    }]
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Générer un ID unique logique avant la sauvegarde
CatalogueItemSchema.pre('save', async function(next) {
  if (this.isNew && !this.itemId) {
    try {
      const sequenceValue = await getNextSequenceValue('catalogueItem');
      const paddedSequence = sequenceValue.toString().padStart(6, '0');
      this.itemId = `CAT-${paddedSequence}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Générer un slug automatiquement
CatalogueItemSchema.pre('save', function(next) {
  if (this.isModified('nom') && !this.seo.slug) {
    this.seo.slug = this.nom
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Calculer la quantité disponible (virtuel)
CatalogueItemSchema.virtual('stock.available').get(function() {
  return Math.max(0, (this.stock.quantity || 0) - (this.stock.reserved || 0));
});

// Calculer le statut de stock (virtuel)
CatalogueItemSchema.virtual('stock.status').get(function() {
  const available = this.stock.available;
  const minQuantity = this.stock.minQuantity || 0;
  
  if (available === 0) return 'out_of_stock';
  if (available <= minQuantity) return 'low_stock';
  return 'in_stock';
});

// Calculer la marge (virtuel)
CatalogueItemSchema.virtual('profit.margin').get(function() {
  const buy = this.price?.buyPrice || 0;
  const sell = this.price?.sellPrice || 0;
  if (buy === 0) return 0;
  return ((sell - buy) / buy) * 100;
});

// Index composés pour optimiser les requêtes
CatalogueItemSchema.index({ categorie: 1, nom: 1 });
CatalogueItemSchema.index({ status: 1, categorie: 1 });
CatalogueItemSchema.index({ 'stock.quantity': 1, 'stock.minQuantity': 1 });
CatalogueItemSchema.index({ 'price.sellPrice': 1 });
CatalogueItemSchema.index({ tags: 1 });
CatalogueItemSchema.index({ 'supplier.name': 1 });
CatalogueItemSchema.index({ createdAt: -1 });

// Index de recherche textuelle
CatalogueItemSchema.index({ 
  nom: 'text', 
  description: 'text', 
  tags: 'text' 
}, {
  weights: { nom: 3, description: 2, tags: 1 }
});

// Méthodes d'instance
CatalogueItemSchema.methods.updateStock = function(quantity, operation = 'set') {
  switch (operation) {
  case 'add':
    this.stock.quantity = (this.stock.quantity || 0) + quantity;
    break;
  case 'subtract':
    this.stock.quantity = Math.max(0, (this.stock.quantity || 0) - quantity);
    break;
  case 'set':
  default:
    this.stock.quantity = Math.max(0, quantity);
    break;
  }
  return this.save();
};

CatalogueItemSchema.methods.reserve = function(quantity) {
  const available = this.stock.available;
  if (quantity > available) {
    throw new Error('Quantité insuffisante en stock');
  }
  this.stock.reserved = (this.stock.reserved || 0) + quantity;
  return this.save();
};

CatalogueItemSchema.methods.releaseReservation = function(quantity) {
  this.stock.reserved = Math.max(0, (this.stock.reserved || 0) - quantity);
  return this.save();
};

CatalogueItemSchema.methods.addReview = function(rating, comment, authorId) {
  this.ratings.reviews.push({
    rating,
    comment,
    author: authorId
  });
  
  // Recalculer la moyenne
  const totalRating = this.ratings.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.ratings.average = totalRating / this.ratings.reviews.length;
  this.ratings.count = this.ratings.reviews.length;
  
  return this.save();
};

// Méthodes statiques
CatalogueItemSchema.statics.findByCategory = function(category, options = {}) {
  const query = { categorie: category, status: 'active' };
  return this.find(query, null, options);
};

CatalogueItemSchema.statics.searchItems = function(searchTerm, filters = {}) {
  const query = {
    $text: { $search: searchTerm },
    status: 'active',
    ...filters
  };
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

CatalogueItemSchema.statics.getLowStockItems = function() {
  return this.find({
    $expr: {
      $lte: [
        { $subtract: ['$stock.quantity', '$stock.reserved'] },
        '$stock.minQuantity'
      ]
    },
    status: 'active'
  });
};

CatalogueItemSchema.statics.getItemStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$categorie',
        count: { $sum: 1 },
        totalValue: { $sum: { $multiply: ['$stock.quantity', '$price.sellPrice'] } },
        avgPrice: { $avg: '$price.sellPrice' },
        lowStock: {
          $sum: {
            $cond: [
              { $lte: [{ $subtract: ['$stock.quantity', '$stock.reserved'] }, '$stock.minQuantity'] },
              1,
              0
            ]
          }
        }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Protection contre les suppressions accidentelles
CatalogueItemSchema.pre('deleteMany', function (next) {
  const filter = this.getFilter();
  if (!filter || Object.keys(filter).length === 0) {
    return next(new Error('❌ Suppression globale interdite sur CatalogueItem'));
  }
  next();
});

CatalogueItemSchema.pre('deleteOne', function (next) {
  const filter = this.getFilter?.() || this._conditions;
  if (!filter || Object.keys(filter).length === 0) {
    return next(new Error('❌ Suppression sans filtre interdite sur CatalogueItem'));
  }
  next();
});

module.exports = mongoose.model('CatalogueItem', CatalogueItemSchema);

