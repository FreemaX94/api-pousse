const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const ContractSchema = new Schema({
  numeroContrat: {
    type: String,
    required: [true, 'Le numéro de contrat est requis'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^[A-Z0-9-]+$/, 'Le numéro de contrat ne peut contenir que des lettres majuscules, chiffres et tirets']
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le client est requis'],
    index: true,
    validate: {
      validator: async function(value) {
        const User = mongoose.model('User');
        const user = await User.findById(value);
        return user !== null;
      },
      message: 'Client invalide'
    }
  },
  startDate: {
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
  endDate: {
    type: Date,
    required: [true, 'La date de fin est requise'],
    index: true,
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'La date de fin doit être après la date de début'
    }
  },
  isB2B: {
    type: Boolean,
    default: false,
    index: true
  },
  contractType: {
    type: String,
    required: [true, 'Le type de contrat est requis'],
    enum: {
      values: ['vente', 'location', 'maintenance', 'abonnement', 'prestation', 'cadre', 'autre'],
      message: 'Type de contrat invalide : {VALUE}'
    },
    index: true
  },
  statut: {
    type: String,
    required: true,
    enum: {
      values: ['brouillon', 'en_attente', 'actif', 'suspendu', 'expire', 'resilie'],
      message: 'Statut invalide : {VALUE}'
    },
    default: 'brouillon',
    index: true
  },
  montant: {
    total: {
      type: Number,
      required: [true, 'Le montant total est requis'],
      min: [0, 'Le montant ne peut être négatif']
    },
    devise: {
      type: String,
      default: 'EUR',
      enum: ['EUR', 'USD', 'GBP'],
      uppercase: true
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
    remise: {
      type: {
        type: String,
        enum: ['pourcentage', 'montant'],
        default: 'pourcentage'
      },
      valeur: {
        type: Number,
        default: 0,
        min: [0, 'La remise ne peut être négative']
      }
    }
  },
  facturation: {
    periodicite: {
      type: String,
      enum: ['unique', 'mensuelle', 'trimestrielle', 'semestrielle', 'annuelle'],
      default: 'unique'
    },
    prochainePeriode: {
      type: Date,
      validate: {
        validator: function(value) {
          if (!value) return true;
          return value >= this.startDate && value <= this.endDate;
        },
        message: 'La prochaine période doit être comprise entre les dates du contrat'
      }
    },
    factures: [{
      type: Schema.Types.ObjectId,
      ref: 'Invoice'
    }]
  },
  conditions: {
    paiement: {
      delai: {
        type: Number,
        default: 30,
        min: [0, 'Le délai de paiement ne peut être négatif']
      },
      penalites: {
        type: Number,
        default: 0,
        min: [0, 'Le taux de pénalités ne peut être négatif'],
        max: [100, 'Le taux de pénalités ne peut dépasser 100%']
      }
    },
    renouvellement: {
      automatique: {
        type: Boolean,
        default: false
      },
      duree: {
        type: Number,
        min: [1, 'La durée de renouvellement doit être au moins 1 mois']
      },
      preavis: {
        type: Number,
        default: 30,
        min: [0, 'Le préavis ne peut être négatif']
      }
    },
    clauses: [{
      titre: {
        type: String,
        required: true,
        trim: true,
        maxlength: [200, 'Le titre de la clause ne peut dépasser 200 caractères']
      },
      contenu: {
        type: String,
        required: true,
        maxlength: [5000, 'Le contenu de la clause ne peut dépasser 5000 caractères']
      },
      ordre: {
        type: Number,
        default: 0
      }
    }]
  },
  signataires: [{
    type: {
      type: String,
      required: true,
      enum: ['client', 'vendeur', 'temoin', 'garant']
    },
    nom: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Le nom du signataire ne peut dépasser 200 caractères']
    },
    fonction: {
      type: String,
      trim: true,
      maxlength: [100, 'La fonction ne peut dépasser 100 caractères']
    },
    dateSignature: {
      type: Date,
      validate: {
        validator: function(value) {
          if (!value) return true;
          return value <= new Date();
        },
        message: 'La date de signature ne peut être dans le futur'
      }
    },
    signatureElectronique: {
      hash: String,
      ip: String,
      navigateur: String
    }
  }],
  documents: [{
    nom: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Le nom du document ne peut dépasser 200 caractères']
    },
    type: {
      type: String,
      enum: ['contrat_principal', 'annexe', 'avenant', 'conditions_generales', 'autre'],
      default: 'autre'
    },
    url: {
      type: String,
      required: true
    },
    version: {
      type: Number,
      default: 1,
      min: [1, 'La version doit être au moins 1']
    },
    dateAjout: {
      type: Date,
      default: Date.now
    }
  }],
  historique: [{
    action: {
      type: String,
      required: true,
      enum: ['creation', 'modification', 'signature', 'suspension', 'reactivation', 'resiliation']
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    utilisateur: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    details: {
      type: String,
      maxlength: [500, 'Les détails ne peuvent dépasser 500 caractères']
    },
    anciennesValeurs: Schema.Types.Mixed
  }],
  notifications: {
    rappelExpiration: {
      active: {
        type: Boolean,
        default: true
      },
      delais: [{
        type: Number,
        default: [30, 15, 7] // jours avant expiration
      }],
      dernierEnvoi: Date
    },
    rappelFacturation: {
      active: {
        type: Boolean,
        default: true
      },
      dernierEnvoi: Date
    }
  },
  metadata: {
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [50, 'Un tag ne peut dépasser 50 caractères']
    }],
    notes: {
      type: String,
      maxlength: [2000, 'Les notes ne peuvent dépasser 2000 caractères']
    },
    visible: {
      type: Boolean,
      default: true
    },
    archive: {
      type: Boolean,
      default: false,
      index: true
    },
    dateArchivage: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composés pour les recherches fréquentes
ContractSchema.index({ client: 1, statut: 1 });
ContractSchema.index({ startDate: 1, endDate: 1 });
ContractSchema.index({ contractType: 1, statut: 1 });
ContractSchema.index({ numeroContrat: 'text', 'metadata.tags': 1 });

// Génération automatique du numéro de contrat
ContractSchema.pre('validate', async function(next) {
  if (this.isNew && !this.numeroContrat) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Trouver le dernier numéro pour ce mois
    const lastContract = await this.constructor.findOne({
      numeroContrat: new RegExp(`^CTR-${year}${month}-`)
    }).sort({ numeroContrat: -1 });
    
    let sequence = 1;
    if (lastContract) {
      const lastSequence = parseInt(lastContract.numeroContrat.split('-').pop());
      sequence = lastSequence + 1;
    }
    
    this.numeroContrat = `CTR-${year}${month}-${String(sequence).padStart(4, '0')}`;
  }
  next();
});

// Virtuals
ContractSchema.virtual('duree').get(function() {
  if (!this.startDate || !this.endDate) return 0;
  const diffTime = Math.abs(this.endDate - this.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // en jours
});

ContractSchema.virtual('estActif').get(function() {
  const maintenant = new Date();
  return this.statut === 'actif' && 
         this.startDate <= maintenant && 
         this.endDate >= maintenant;
});

ContractSchema.virtual('joursRestants').get(function() {
  if (this.statut !== 'actif') return 0;
  const maintenant = new Date();
  if (this.endDate < maintenant) return 0;
  const diffTime = this.endDate - maintenant;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

ContractSchema.virtual('montantHT').get(function() {
  if (!this.montant) return 0;
  return this.montant.total - (this.montant.tva?.montant || 0);
});

ContractSchema.virtual('estSigne').get(function() {
  if (!this.signataires || this.signataires.length === 0) return false;
  const signatairesRequis = this.signataires.filter(s => ['client', 'vendeur'].includes(s.type));
  return signatairesRequis.every(s => s.dateSignature !== null);
});

// Méthodes d'instance
ContractSchema.methods.calculerMontantTTC = function() {
  const montantHT = this.montantHT;
  const tauxTVA = this.montant.tva?.taux || 0;
  const montantTVA = montantHT * (tauxTVA / 100);
  return Math.round((montantHT + montantTVA) * 100) / 100;
};

ContractSchema.methods.appliquerRemise = function() {
  if (!this.montant.remise || this.montant.remise.valeur === 0) {
    return this.montant.total;
  }
  
  let montantRemise = 0;
  if (this.montant.remise.type === 'pourcentage') {
    montantRemise = this.montant.total * (this.montant.remise.valeur / 100);
  } else {
    montantRemise = this.montant.remise.valeur;
  }
  
  return Math.round((this.montant.total - montantRemise) * 100) / 100;
};

ContractSchema.methods.suspendre = async function(raison, userId) {
  if (this.statut !== 'actif') {
    throw new Error('Seul un contrat actif peut être suspendu');
  }
  
  this.statut = 'suspendu';
  this.historique.push({
    action: 'suspension',
    utilisateur: userId,
    details: raison
  });
  
  return await this.save();
};

ContractSchema.methods.reactiver = async function(userId) {
  if (this.statut !== 'suspendu') {
    throw new Error('Seul un contrat suspendu peut être réactivé');
  }
  
  const maintenant = new Date();
  if (this.endDate < maintenant) {
    throw new Error('Impossible de réactiver un contrat expiré');
  }
  
  this.statut = 'actif';
  this.historique.push({
    action: 'reactivation',
    utilisateur: userId
  });
  
  return await this.save();
};

ContractSchema.methods.resilier = async function(raison, userId, dateResiliation = new Date()) {
  if (!['actif', 'suspendu'].includes(this.statut)) {
    throw new Error('Ce contrat ne peut pas être résilié');
  }
  
  this.statut = 'resilie';
  this.endDate = dateResiliation;
  this.historique.push({
    action: 'resiliation',
    utilisateur: userId,
    details: raison,
    date: dateResiliation
  });
  
  return await this.save();
};

ContractSchema.methods.ajouterDocument = async function(documentData) {
  // Vérifier les versions pour les contrats principaux
  if (documentData.type === 'contrat_principal') {
    const dernierContrat = this.documents
      .filter(d => d.type === 'contrat_principal')
      .sort((a, b) => b.version - a.version)[0];
    
    if (dernierContrat) {
      documentData.version = dernierContrat.version + 1;
    }
  }
  
  this.documents.push(documentData);
  return await this.save();
};

ContractSchema.methods.signer = async function(signataireData) {
  const signataire = this.signataires.find(s => 
    s.type === signataireData.type && s.nom === signataireData.nom
  );
  
  if (!signataire) {
    throw new Error('Signataire non trouvé dans le contrat');
  }
  
  if (signataire.dateSignature) {
    throw new Error('Ce signataire a déjà signé le contrat');
  }
  
  signataire.dateSignature = new Date();
  if (signataireData.signatureElectronique) {
    signataire.signatureElectronique = signataireData.signatureElectronique;
  }
  
  // Vérifier si tous les signataires requis ont signé
  const tousSignes = this.signataires
    .filter(s => ['client', 'vendeur'].includes(s.type))
    .every(s => s.dateSignature || (s.type === signataireData.type && s.nom === signataireData.nom));
  
  if (tousSignes && this.statut === 'en_attente') {
    this.statut = 'actif';
  }
  
  this.historique.push({
    action: 'signature',
    utilisateur: signataireData.userId,
    details: `Signature de ${signataireData.nom} (${signataireData.type})`
  });
  
  return await this.save();
};

ContractSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  // Masquer les informations sensibles
  if (obj.signataires) {
    obj.signataires.forEach(s => {
      if (s.signatureElectronique) {
        delete s.signatureElectronique.hash;
      }
    });
  }
  return obj;
};

// Méthodes statiques
ContractSchema.statics.findActifs = function() {
  const maintenant = new Date();
  return this.find({
    statut: 'actif',
    startDate: { $lte: maintenant },
    endDate: { $gte: maintenant },
    'metadata.archive': false
  }).populate('client', 'nom prenom email');
};

ContractSchema.statics.findExpirantBientot = function(jours = 30) {
  const maintenant = new Date();
  const dateLimite = new Date(maintenant.getTime() + (jours * 24 * 60 * 60 * 1000));
  
  return this.find({
    statut: 'actif',
    endDate: { $gte: maintenant, $lte: dateLimite },
    'metadata.archive': false
  }).populate('client', 'nom prenom email');
};

ContractSchema.statics.rechercherParNumero = function(terme) {
  const regex = new RegExp(terme, 'i');
  return this.findOne({ numeroContrat: regex });
};

ContractSchema.statics.getStatistiques = async function() {
  const maintenant = new Date();
  const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
  
  const [total, actifs, expirantCeMois, parType] = await Promise.all([
    this.countDocuments({ 'metadata.archive': false }),
    this.countDocuments({ statut: 'actif', 'metadata.archive': false }),
    this.countDocuments({
      statut: 'actif',
      endDate: {
        $gte: debutMois,
        $lte: new Date(maintenant.getFullYear(), maintenant.getMonth() + 1, 0)
      }
    }),
    this.aggregate([
      { $match: { 'metadata.archive': false } },
      { $group: { _id: '$contractType', count: { $sum: 1 } } }
    ])
  ]);
  
  return {
    total,
    actifs,
    expirantCeMois,
    parType: parType.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {})
  };
};

// Middleware pre-save
ContractSchema.pre('save', function(next) {
  // Validation des dates
  if (this.startDate > this.endDate) {
    return next(new Error('La date de début doit être antérieure à la date de fin'));
  }
  
  // Calcul automatique du montant de TVA
  if (this.montant && this.montant.total && this.montant.tva) {
    const montantHT = this.montant.total / (1 + this.montant.tva.taux / 100);
    this.montant.tva.montant = Math.round((this.montant.total - montantHT) * 100) / 100;
  }
  
  // Mise à jour automatique du statut
  const maintenant = new Date();
  if (this.statut === 'actif' && this.endDate < maintenant) {
    this.statut = 'expire';
  }
  
  // Ajout à l'historique pour les modifications importantes
  if (!this.isNew && this.isModified()) {
    const modifications = this.modifiedPaths();
    if (modifications.some(path => ['statut', 'montant.total', 'endDate'].includes(path))) {
      this.historique.push({
        action: 'modification',
        utilisateur: this._req?.user?._id,
        details: `Modification de : ${modifications.join(', ')}`
      });
    }
  }
  
  next();
});

// Middleware pour vérifier les contrats expirés (peut être exécuté via un cron job)
ContractSchema.statics.verifierContratsExpires = async function() {
  const maintenant = new Date();
  const contratsExpires = await this.updateMany(
    {
      statut: 'actif',
      endDate: { $lt: maintenant }
    },
    {
      $set: { statut: 'expire' },
      $push: {
        historique: {
          action: 'modification',
          date: maintenant,
          details: 'Expiration automatique du contrat'
        }
      }
    }
  );
  
  return contratsExpires.nModified;
};

// Plugin de pagination
ContractSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Contract', ContractSchema);
