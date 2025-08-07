const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const DeliverySchema = new Schema({
  numeroLivraison: {
    type: String,
    required: [true, 'Le numéro de livraison est requis'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^LIV-\d{4}-\d{2}-\d{4}$/, 'Format invalide. Utilisez LIV-AAAA-MM-XXXX']
  },
  commande: {
    type: Schema.Types.ObjectId,
    ref: 'Invoice',
    required: [true, 'La commande associée est requise'],
    index: true
  },
  client: {
    nom: {
      type: String,
      required: [true, 'Le nom du client est requis'],
      trim: true,
      maxlength: [200, 'Le nom ne peut dépasser 200 caractères']
    },
    telephone: {
      type: String,
      required: [true, 'Le téléphone est requis'],
      trim: true,
      match: [/^[+\d\s\-.()]+$/, 'Format de téléphone invalide']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Format d\'email invalide']
    }
  },
  adresseLivraison: {
    rue: {
      type: String,
      required: [true, 'La rue est requise'],
      trim: true,
      maxlength: [300, 'L\'adresse ne peut dépasser 300 caractères']
    },
    complement: {
      type: String,
      trim: true,
      maxlength: [200, 'Le complément ne peut dépasser 200 caractères']
    },
    codePostal: {
      type: String,
      required: [true, 'Le code postal est requis'],
      trim: true,
      match: [/^\d{5}$/, 'Code postal invalide (5 chiffres)']
    },
    ville: {
      type: String,
      required: [true, 'La ville est requise'],
      trim: true,
      maxlength: [100, 'La ville ne peut dépasser 100 caractères']
    },
    pays: {
      type: String,
      default: 'France',
      trim: true,
      maxlength: [100, 'Le pays ne peut dépasser 100 caractères']
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
    instructions: {
      type: String,
      maxlength: [500, 'Les instructions ne peuvent dépasser 500 caractères']
    }
  },
  dateLivraison: {
    prevue: {
      type: Date,
      required: [true, 'La date de livraison prévue est requise'],
      index: true,
      validate: {
        validator: function(value) {
          // Permettre les dates passées pour l'historique
          return value instanceof Date;
        },
        message: 'Date de livraison invalide'
      }
    },
    creneauHoraire: {
      debut: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:MM)']
      },
      fin: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:MM)']
      }
    },
    effective: {
      type: Date,
      validate: {
        validator: function(value) {
          if (!value) return true;
          return value instanceof Date;
        },
        message: 'Date effective invalide'
      }
    }
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['pending', 'confirmed', 'preparing', 'in_transit', 'delivered', 'failed', 'cancelled', 'returned'],
      message: 'Statut invalide : {VALUE}'
    },
    default: 'pending',
    index: true
  },
  livreur: {
    nom: {
      type: String,
      trim: true,
      maxlength: [200, 'Le nom du livreur ne peut dépasser 200 caractères']
    },
    telephone: {
      type: String,
      trim: true,
      match: [/^[+\d\s\-.()]+$/, 'Format de téléphone invalide']
    },
    vehicule: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle'
    },
    societe: {
      type: String,
      enum: ['interne', 'chronopost', 'colissimo', 'ups', 'dhl', 'tnt', 'autre'],
      default: 'interne'
    }
  },
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
    etat: {
      type: String,
      enum: ['parfait', 'bon', 'acceptable', 'endommage'],
      default: 'parfait'
    },
    notes: {
      type: String,
      maxlength: [200, 'Les notes ne peuvent dépasser 200 caractères']
    }
  }],
  colis: {
    nombre: {
      type: Number,
      default: 1,
      min: [1, 'Le nombre de colis doit être au moins 1']
    },
    poids: {
      total: {
        type: Number,
        min: [0, 'Le poids ne peut être négatif']
      },
      unite: {
        type: String,
        enum: ['kg', 'g'],
        default: 'kg'
      }
    },
    dimensions: [{
      longueur: { type: Number, min: 0 },
      largeur: { type: Number, min: 0 },
      hauteur: { type: Number, min: 0 },
      unite: {
        type: String,
        enum: ['cm', 'm'],
        default: 'cm'
      }
    }],
    fragile: {
      type: Boolean,
      default: false
    },
    valeurDeclaree: {
      type: Number,
      min: [0, 'La valeur déclarée ne peut être négative']
    }
  },
  tarification: {
    fraisLivraison: {
      type: Number,
      default: 0,
      min: [0, 'Les frais ne peuvent être négatifs']
    },
    gratuite: {
      type: Boolean,
      default: false
    },
    modePaiement: {
      type: String,
      enum: ['prepaye', 'contre_remboursement', 'facture'],
      default: 'prepaye'
    }
  },
  suivi: {
    numeroSuivi: {
      type: String,
      trim: true,
      index: true
    },
    urlSuivi: {
      type: String,
      trim: true
    },
    etapes: [{
      statut: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      lieu: {
        type: String,
        trim: true
      },
      commentaire: {
        type: String,
        maxlength: [300, 'Le commentaire ne peut dépasser 300 caractères']
      }
    }]
  },
  signature: {
    requise: {
      type: Boolean,
      default: false
    },
    nom: {
      type: String,
      trim: true,
      maxlength: [200, 'Le nom ne peut dépasser 200 caractères']
    },
    date: Date,
    imageUrl: String,
    relation: {
      type: String,
      enum: ['destinataire', 'voisin', 'gardien', 'famille', 'autre']
    }
  },
  problemes: [{
    type: {
      type: String,
      required: true,
      enum: ['absent', 'adresse_incorrecte', 'refus', 'colis_endommage', 'retard', 'autre']
    },
    date: {
      type: Date,
      default: Date.now
    },
    description: {
      type: String,
      required: true,
      maxlength: [500, 'La description ne peut dépasser 500 caractères']
    },
    resolu: {
      type: Boolean,
      default: false
    },
    resolution: {
      type: String,
      maxlength: [500, 'La résolution ne peut dépasser 500 caractères']
    }
  }],
  photos: [{
    type: {
      type: String,
      required: true,
      enum: ['colis', 'livraison', 'probleme', 'signature']
    },
    url: {
      type: String,
      required: true
    },
    description: {
      type: String,
      maxlength: [200, 'La description ne peut dépasser 200 caractères']
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  evaluations: {
    client: {
      note: {
        type: Number,
        min: [1, 'La note minimale est 1'],
        max: [5, 'La note maximale est 5']
      },
      commentaire: {
        type: String,
        maxlength: [500, 'Le commentaire ne peut dépasser 500 caractères']
      },
      date: Date
    },
    livreur: {
      difficulte: {
        type: Number,
        min: [1, 'La difficulté minimale est 1'],
        max: [5, 'La difficulté maximale est 5']
      },
      commentaire: {
        type: String,
        maxlength: [500, 'Le commentaire ne peut dépasser 500 caractères']
      }
    }
  },
  metadata: {
    source: {
      type: String,
      enum: ['web', 'telephone', 'magasin', 'api'],
      default: 'web'
    },
    priorite: {
      type: String,
      enum: ['normale', 'urgente', 'express'],
      default: 'normale'
    },
    notes: {
      type: String,
      maxlength: [1000, 'Les notes ne peuvent dépasser 1000 caractères']
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [50, 'Un tag ne peut dépasser 50 caractères']
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composés pour les recherches fréquentes
DeliverySchema.index({ 'dateLivraison.prevue': 1, status: 1 });
DeliverySchema.index({ 'client.nom': 1, 'dateLivraison.prevue': -1 });
DeliverySchema.index({ 'livreur.nom': 1, 'dateLivraison.prevue': 1 });
DeliverySchema.index({ 'adresseLivraison.ville': 1, status: 1 });

// Génération automatique du numéro de livraison
DeliverySchema.pre('validate', async function(next) {
  if (this.isNew && !this.numeroLivraison) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const lastDelivery = await this.constructor.findOne({
      numeroLivraison: new RegExp(`^LIV-${year}-${month}-`)
    }).sort({ numeroLivraison: -1 });
    
    let sequence = 1;
    if (lastDelivery) {
      const lastSequence = parseInt(lastDelivery.numeroLivraison.split('-').pop());
      sequence = lastSequence + 1;
    }
    
    this.numeroLivraison = `LIV-${year}-${month}-${String(sequence).padStart(4, '0')}`;
  }
  next();
});

// Virtuals
DeliverySchema.virtual('adresseComplete').get(function() {
  const parts = [this.adresseLivraison.rue];
  if (this.adresseLivraison.complement) parts.push(this.adresseLivraison.complement);
  parts.push(`${this.adresseLivraison.codePostal} ${this.adresseLivraison.ville}`);
  if (this.adresseLivraison.pays !== 'France') parts.push(this.adresseLivraison.pays);
  return parts.join(', ');
});

DeliverySchema.virtual('estEnRetard').get(function() {
  if (this.status === 'delivered' || this.status === 'cancelled') return false;
  return new Date() > this.dateLivraison.prevue;
});

DeliverySchema.virtual('dureeEstimee').get(function() {
  if (!this.dateLivraison.prevue || !this.createdAt) return null;
  const diff = this.dateLivraison.prevue - this.createdAt;
  return Math.round(diff / (1000 * 60 * 60)); // en heures
});

DeliverySchema.virtual('peutEtreModifiee').get(function() {
  return ['pending', 'confirmed'].includes(this.status);
});

DeliverySchema.virtual('estLivree').get(function() {
  return this.status === 'delivered';
});

// Méthodes d'instance
DeliverySchema.methods.confirmer = async function() {
  if (this.status !== 'pending') {
    throw new Error('Seule une livraison en attente peut être confirmée');
  }
  
  this.status = 'confirmed';
  this.suivi.etapes.push({
    statut: 'confirmed',
    commentaire: 'Livraison confirmée'
  });
  
  return await this.save();
};

DeliverySchema.methods.marquerEnTransit = async function(livreurData) {
  if (!['confirmed', 'preparing'].includes(this.status)) {
    throw new Error('La livraison doit être confirmée ou en préparation');
  }
  
  this.status = 'in_transit';
  if (livreurData) {
    this.livreur = livreurData;
  }
  
  this.suivi.etapes.push({
    statut: 'in_transit',
    commentaire: 'Livraison en cours'
  });
  
  return await this.save();
};

DeliverySchema.methods.marquerLivree = async function(signatureData) {
  if (this.status !== 'in_transit') {
    throw new Error('La livraison doit être en transit');
  }
  
  this.status = 'delivered';
  this.dateLivraison.effective = new Date();
  
  if (signatureData) {
    this.signature = { ...this.signature, ...signatureData, date: new Date() };
  }
  
  this.suivi.etapes.push({
    statut: 'delivered',
    commentaire: 'Livraison effectuée avec succès'
  });
  
  return await this.save();
};

DeliverySchema.methods.marquerEchouee = async function(probleme) {
  if (!['in_transit', 'preparing'].includes(this.status)) {
    throw new Error('Statut de livraison invalide pour marquer comme échouée');
  }
  
  this.status = 'failed';
  this.problemes.push(probleme);
  
  this.suivi.etapes.push({
    statut: 'failed',
    commentaire: probleme.description
  });
  
  return await this.save();
};

DeliverySchema.methods.annuler = async function(raison) {
  if (!this.peutEtreModifiee) {
    throw new Error('Cette livraison ne peut plus être annulée');
  }
  
  this.status = 'cancelled';
  this.suivi.etapes.push({
    statut: 'cancelled',
    commentaire: raison
  });
  
  return await this.save();
};

DeliverySchema.methods.ajouterProbleme = async function(problemeData) {
  this.problemes.push(problemeData);
  return await this.save();
};

DeliverySchema.methods.resoudreProbleme = async function(problemeId, resolution) {
  const probleme = this.problemes.id(problemeId);
  if (!probleme) {
    throw new Error('Problème non trouvé');
  }
  
  probleme.resolu = true;
  probleme.resolution = resolution;
  
  return await this.save();
};

DeliverySchema.methods.ajouterPhoto = async function(photoData) {
  this.photos.push(photoData);
  return await this.save();
};

DeliverySchema.methods.calculerDistanceEstimee = function() {
  // Implémentation simplifiée - en production, utiliser une API de géolocalisation
  if (!this.adresseLivraison.coordonnees.latitude || !this.adresseLivraison.coordonnees.longitude) {
    return null;
  }
  
  // Coordonnées du magasin (exemple)
  const magasinLat = 48.8566;
  const magasinLon = 2.3522;
  
  const R = 6371; // Rayon de la Terre en km
  const dLat = (this.adresseLivraison.coordonnees.latitude - magasinLat) * Math.PI / 180;
  const dLon = (this.adresseLivraison.coordonnees.longitude - magasinLon) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(magasinLat * Math.PI / 180) * Math.cos(this.adresseLivraison.coordonnees.latitude * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // en km
};

DeliverySchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Méthodes statiques
DeliverySchema.statics.findLivraisonsJour = function(date = new Date()) {
  const debut = new Date(date);
  debut.setHours(0, 0, 0, 0);
  const fin = new Date(date);
  fin.setHours(23, 59, 59, 999);
  
  return this.find({
    'dateLivraison.prevue': { $gte: debut, $lte: fin }
  }).sort({ 'dateLivraison.prevue': 1 });
};

DeliverySchema.statics.findEnRetard = function() {
  return this.find({
    status: { $in: ['pending', 'confirmed', 'preparing', 'in_transit'] },
    'dateLivraison.prevue': { $lt: new Date() }
  }).sort({ 'dateLivraison.prevue': 1 });
};

DeliverySchema.statics.findParLivreur = function(livreurNom, dateDebut, dateFin) {
  const query = { 'livreur.nom': livreurNom };
  
  if (dateDebut && dateFin) {
    query['dateLivraison.prevue'] = { $gte: dateDebut, $lte: dateFin };
  }
  
  return this.find(query).sort({ 'dateLivraison.prevue': 1 });
};

DeliverySchema.statics.getStatistiques = async function(dateDebut, dateFin) {
  const query = {};
  if (dateDebut && dateFin) {
    query['dateLivraison.prevue'] = { $gte: dateDebut, $lte: dateFin };
  }
  
  const [total, parStatut, parLivreur, tauxReussite] = await Promise.all([
    this.countDocuments(query),
    this.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    this.aggregate([
      { $match: { ...query, 'livreur.nom': { $exists: true } } },
      { $group: { _id: '$livreur.nom', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    this.aggregate([
      { $match: query },
      { $group: {
        _id: null,
        total: { $sum: 1 },
        livrees: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } }
      }}
    ])
  ]);
  
  return {
    total,
    parStatut: parStatut.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    topLivreurs: parLivreur,
    tauxReussite: tauxReussite[0] ? (tauxReussite[0].livrees / tauxReussite[0].total * 100).toFixed(2) : 0
  };
};

// Middleware pre-save
DeliverySchema.pre('save', function(next) {
  // Validation du créneau horaire
  if (this.dateLivraison.creneauHoraire.debut && this.dateLivraison.creneauHoraire.fin) {
    const debut = this.dateLivraison.creneauHoraire.debut.split(':').map(Number);
    const fin = this.dateLivraison.creneauHoraire.fin.split(':').map(Number);
    
    if (debut[0] > fin[0] || (debut[0] === fin[0] && debut[1] >= fin[1])) {
      return next(new Error('Le créneau horaire est invalide'));
    }
  }
  
  // Mise à jour automatique du suivi
  if (this.isModified('status') && !this.isNew) {
    const dernierSuivi = this.suivi.etapes[this.suivi.etapes.length - 1];
    if (!dernierSuivi || dernierSuivi.statut !== this.status) {
      this.suivi.etapes.push({
        statut: this.status,
        date: new Date()
      });
    }
  }
  
  next();
});

// Plugin de pagination
DeliverySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Delivery', DeliverySchema);
