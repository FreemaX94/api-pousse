const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

/**
 * Schéma Mongoose pour l'entité Événement
 * Gère les événements avec validation complète et fonctionnalités avancées
 */
const evenementSchema = new Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de l\'événement est requis'],
    trim: true,
    minlength: [3, 'Le nom doit contenir au moins 3 caractères'],
    maxlength: [200, 'Le nom ne peut dépasser 200 caractères'],
    index: true
  },
  type: {
    type: String,
    required: [true, 'Le type d\'événement est requis'],
    enum: {
      values: ['mariage', 'anniversaire', 'corporate', 'salon', 'fête', 'funérailles', 'autre'],
      message: 'Type d\'événement invalide'
    },
    default: 'autre'
  },
  dateDebut: {
    type: Date,
    required: [true, 'La date de début est requise'],
    index: true,
    validate: {
      validator: function(value) {
        // Permettre les dates passées pour l'historique
        return value instanceof Date;
      },
      message: 'Date de début invalide'
    }
  },
  dateFin: {
    type: Date,
    required: [true, 'La date de fin est requise'],
    validate: {
      validator: function(value) {
        return value >= this.dateDebut;
      },
      message: 'La date de fin doit être après la date de début'
    }
  },
  lieu: {
    nom: {
      type: String,
      required: [true, 'Le nom du lieu est requis'],
      trim: true,
      maxlength: [200, 'Le nom du lieu ne peut dépasser 200 caractères']
    },
    adresse: {
      rue: { type: String, trim: true, maxlength: 200 },
      codePostal: { 
        type: String, 
        trim: true, 
        match: [/^\d{5}$/, 'Code postal invalide (5 chiffres requis)']
      },
      ville: { type: String, trim: true, maxlength: 100 },
      pays: { type: String, trim: true, default: 'France', maxlength: 100 }
    },
    coordonnees: {
      latitude: { 
        type: Number, 
        min: [-90, 'Latitude invalide'], 
        max: [90, 'Latitude invalide'] 
      },
      longitude: { 
        type: Number, 
        min: [-180, 'Longitude invalide'], 
        max: [180, 'Longitude invalide'] 
      }
    },
    capacite: {
      type: Number,
      min: [0, 'La capacité ne peut être négative']
    }
  },
  client: {
    nom: {
      type: String,
      required: [true, 'Le nom du client est requis'],
      trim: true,
      maxlength: [200, 'Le nom du client ne peut dépasser 200 caractères']
    },
    entreprise: {
      type: String,
      trim: true,
      maxlength: [200, 'Le nom de l\'entreprise ne peut dépasser 200 caractères']
    },
    email: {
      type: String,
      required: [true, 'L\'email du client est requis'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Format d\'email invalide'],
      index: true
    },
    telephone: {
      type: String,
      required: [true, 'Le téléphone du client est requis'],
      trim: true,
      match: [/^[+\d\s-.()]+$/, 'Format de téléphone invalide']
    },
    telephoneSecondaire: {
      type: String,
      trim: true,
      match: [/^[+\d\s-.()]+$/, 'Format de téléphone invalide']
    }
  },
  details: {
    nombreInvites: {
      type: Number,
      min: [0, 'Le nombre d\'invités ne peut être négatif'],
      default: 0
    },
    budget: {
      montant: {
        type: Number,
        min: [0, 'Le budget ne peut être négatif']
      },
      devise: {
        type: String,
        default: 'EUR',
        enum: ['EUR', 'USD', 'GBP']
      }
    },
    theme: {
      type: String,
      trim: true,
      maxlength: [200, 'Le thème ne peut dépasser 200 caractères']
    },
    couleurs: [{
      type: String,
      trim: true,
      match: [/^#[0-9A-Fa-f]{6}$/, 'Format de couleur hexadécimal invalide']
    }],
    prestations: [{
      type: String,
      enum: ['fleurs', 'décoration', 'livraison', 'installation', 'location', 'autre']
    }]
  },
  statut: {
    type: String,
    required: true,
    enum: {
      values: ['proposition', 'confirmé', 'en_preparation', 'terminé', 'annulé'],
      message: 'Statut invalide'
    },
    default: 'proposition',
    index: true
  },
  equipe: [{
    membre: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['responsable', 'assistant', 'livreur', 'installateur'],
      default: 'assistant'
    },
    heuresEstimees: {
      type: Number,
      min: [0, 'Les heures estimées ne peuvent être négatives']
    }
  }],
  produits: [{
    item: {
      type: Schema.Types.ObjectId,
      ref: 'CatalogueItem',
      required: true
    },
    quantite: {
      type: Number,
      required: true,
      min: [1, 'La quantité doit être au moins 1']
    },
    prixUnitaire: {
      type: Number,
      required: true,
      min: [0, 'Le prix ne peut être négatif']
    },
    notes: {
      type: String,
      maxlength: [500, 'Les notes ne peuvent dépasser 500 caractères']
    }
  }],
  documents: [{
    type: {
      type: String,
      required: true,
      enum: ['devis', 'contrat', 'facture', 'photo', 'plan', 'autre']
    },
    nom: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Le nom du document ne peut dépasser 200 caractères']
    },
    url: {
      type: String,
      required: true
    },
    dateAjout: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
    type: String,
    maxlength: [2000, 'Les notes ne peuvent dépasser 2000 caractères']
  },
  rappels: [{
    date: {
      type: Date,
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [500, 'Le message ne peut dépasser 500 caractères']
    },
    envoye: {
      type: Boolean,
      default: false
    }
  }],
  metadata: {
    creePar: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    modifiePar: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    dateAnnulation: Date,
    raisonAnnulation: {
      type: String,
      maxlength: [500, 'La raison d\'annulation ne peut dépasser 500 caractères']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composés pour les recherches fréquentes
evenementSchema.index({ dateDebut: 1, statut: 1 });
evenementSchema.index({ 'client.email': 1, dateDebut: -1 });
evenementSchema.index({ type: 1, statut: 1 });
evenementSchema.index({ 'lieu.ville': 1, dateDebut: 1 });

// Virtuals
evenementSchema.virtual('duree').get(function() {
  if (!this.dateDebut || !this.dateFin) return 0;
  return Math.round((this.dateFin - this.dateDebut) / (1000 * 60 * 60)); // en heures
});

evenementSchema.virtual('estPasse').get(function() {
  return this.dateFin < new Date();
});

evenementSchema.virtual('estEnCours').get(function() {
  const maintenant = new Date();
  return this.dateDebut <= maintenant && this.dateFin >= maintenant;
});

evenementSchema.virtual('joursRestants').get(function() {
  if (this.estPasse) return 0;
  const maintenant = new Date();
  const dateReference = this.dateDebut > maintenant ? this.dateDebut : maintenant;
  return Math.ceil((this.dateFin - dateReference) / (1000 * 60 * 60 * 24));
});

evenementSchema.virtual('montantTotal').get(function() {
  if (!this.produits || this.produits.length === 0) return 0;
  return this.produits.reduce((total, produit) => {
    return total + (produit.quantite * produit.prixUnitaire);
  }, 0);
});

evenementSchema.virtual('adresseComplete').get(function() {
  if (!this.lieu || !this.lieu.adresse) return this.lieu?.nom || '';
  const parts = [this.lieu.nom];
  if (this.lieu.adresse.rue) parts.push(this.lieu.adresse.rue);
  if (this.lieu.adresse.codePostal && this.lieu.adresse.ville) {
    parts.push(`${this.lieu.adresse.codePostal} ${this.lieu.adresse.ville}`);
  }
  return parts.join(', ');
});

// Méthodes d'instance
evenementSchema.methods.peutEtreModifie = function() {
  return !['terminé', 'annulé'].includes(this.statut);
};

evenementSchema.methods.annuler = async function(raison, userId) {
  if (!this.peutEtreModifie()) {
    throw new Error('Cet événement ne peut plus être annulé');
  }
  
  this.statut = 'annulé';
  this.metadata.dateAnnulation = new Date();
  this.metadata.raisonAnnulation = raison;
  this.metadata.modifiePar = userId;
  
  return await this.save();
};

evenementSchema.methods.ajouterProduit = async function(produitData) {
  this.produits.push(produitData);
  return await this.save();
};

evenementSchema.methods.ajouterRappel = async function(date, message) {
  this.rappels.push({ date, message });
  return await this.save();
};

evenementSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Méthodes statiques
evenementSchema.statics.findProchains = function(limite = 10) {
  return this.find({
    dateDebut: { $gte: new Date() },
    statut: { $in: ['confirmé', 'en_preparation'] }
  })
    .sort({ dateDebut: 1 })
    .limit(limite)
    .populate('equipe.membre', 'nom prenom email');
};

evenementSchema.statics.findParPeriode = function(dateDebut, dateFin) {
  return this.find({
    $or: [
      { dateDebut: { $gte: dateDebut, $lte: dateFin } },
      { dateFin: { $gte: dateDebut, $lte: dateFin } },
      { dateDebut: { $lte: dateDebut }, dateFin: { $gte: dateFin } }
    ]
  }).sort({ dateDebut: 1 });
};

evenementSchema.statics.rechercherParClient = function(terme) {
  const regex = new RegExp(terme, 'i');
  return this.find({
    $or: [
      { 'client.nom': regex },
      { 'client.entreprise': regex },
      { 'client.email': regex }
    ]
  }).sort({ dateDebut: -1 });
};

evenementSchema.statics.getStatistiques = async function() {
  const maintenant = new Date();
  const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
  const finMois = new Date(maintenant.getFullYear(), maintenant.getMonth() + 1, 0);
  
  const [total, ceMonth, parType, parStatut] = await Promise.all([
    this.countDocuments(),
    this.countDocuments({
      dateDebut: { $gte: debutMois, $lte: finMois }
    }),
    this.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]),
    this.aggregate([
      { $group: { _id: '$statut', count: { $sum: 1 } } }
    ])
  ]);
  
  return {
    total,
    ceMois: ceMonth,
    parType: parType.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    parStatut: parStatut.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {})
  };
};

// Middleware pre-save
evenementSchema.pre('save', function(next) {
  // Validation supplémentaire des dates
  if (this.isNew && this.dateDebut < new Date() && this.statut === 'proposition') {
    this.statut = 'confirmé';
  }
  
  // Normaliser les données
  if (this.client && this.client.email) {
    this.client.email = this.client.email.toLowerCase().trim();
  }
  
  // Mettre à jour les métadonnées
  if (!this.isNew) {
    this.metadata.modifiePar = this._req?.user?._id;
  }
  
  next();
});

// Middleware post-save pour les notifications
evenementSchema.post('save', async function() {
  // Ici on pourrait implémenter l'envoi de notifications
  // par exemple lors d'un changement de statut
});

// Plugin de pagination
evenementSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Evenement', evenementSchema);
