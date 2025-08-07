const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const EntretienSchema = new Schema({
  numeroEntretien: {
    type: String,
    required: [true, 'Le numéro d\'entretien est requis'],
    unique: true,
    trim: true,
    uppercase: true
  },
  contrat: {
    type: Schema.Types.ObjectId,
    ref: 'Contract',
    index: true
  },
  client: {
    nom: {
      type: String,
      required: [true, 'Le nom du client est requis'],
      trim: true,
      maxlength: [200, 'Le nom ne peut dépasser 200 caractères']
    },
    typeClient: {
      type: String,
      required: [true, 'Le type de client est requis'],
      enum: {
        values: ['Professionnel', 'Particulier'],
        message: 'Type de client invalide : {VALUE}'
      },
      index: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email invalide']
    },
    telephone: {
      type: String,
      trim: true,
      match: [/^(?:\+33|0)[1-9](?:[.-]?\d{2}){4}$/, 'Numéro de téléphone invalide']
    },
    adresse: {
      rue: String,
      ville: String,
      codePostal: {
        type: String,
        match: [/^\d{5}$/, 'Code postal invalide']
      },
      pays: {
        type: String,
        default: 'France'
      }
    }
  },
  typeContrat: {
    type: String,
    required: [true, 'Le type de contrat est requis'],
    enum: {
      values: ['Entretien', 'Abonnement', 'Ponctuel'],
      message: 'Type de contrat invalide : {VALUE}'
    },
    index: true
  },
  titre: {
    type: String,
    trim: true,
    maxlength: [200, 'Le titre ne peut dépasser 200 caractères']
  },
  description: {
    type: String,
    maxlength: [2000, 'La description ne peut dépasser 2000 caractères']
  },
  planification: {
    dateDebut: {
      type: Date,
      required: [true, 'La date de début est requise'],
      index: true
    },
    dateFin: {
      type: Date,
      required: [true, 'La date de fin est requise'],
      index: true,
      validate: {
        validator: function(value) {
          return value > this.planification.dateDebut;
        },
        message: 'La date de fin doit être après la date de début'
      }
    },
    duree: {
      heures: {
        type: Number,
        min: [0, 'Les heures ne peuvent être négatives'],
        max: [23, 'Les heures ne peuvent dépasser 23']
      },
      minutes: {
        type: Number,
        min: [0, 'Les minutes ne peuvent être négatives'],
        max: [59, 'Les minutes ne peuvent dépasser 59']
      }
    },
    frequence: {
      type: String,
      enum: ['unique', 'hebdomadaire', 'bimensuel', 'mensuel', 'trimestriel', 'semestriel', 'annuel'],
      default: 'unique'
    },
    joursRecurrence: [{
      type: String,
      enum: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
    }]
  },
  statut: {
    type: String,
    required: true,
    enum: {
      values: ['planifie', 'en_cours', 'termine', 'annule', 'reporte', 'facture'],
      message: 'Statut invalide : {VALUE}'
    },
    default: 'planifie',
    index: true
  },
  priorite: {
    type: String,
    enum: ['basse', 'normale', 'haute', 'urgente'],
    default: 'normale',
    index: true
  },
  techniciens: [{
    nom: {
      type: String,
      required: true,
      trim: true
    },
    specialite: String,
    heuresAssignees: {
      type: Number,
      min: [0, 'Les heures assignées ne peuvent être négatives']
    },
    tauxHoraire: {
      type: Number,
      min: [0, 'Le taux horaire ne peut être négatif']
    }
  }],
  materiel: [{
    designation: {
      type: String,
      required: true,
      trim: true
    },
    quantite: {
      type: Number,
      required: true,
      min: [1, 'La quantité doit être au moins 1']
    },
    prixUnitaire: {
      type: Number,
      min: [0, 'Le prix unitaire ne peut être négatif']
    },
    fournisseur: String,
    reference: String
  }],
  tarification: {
    budget: {
      type: Number,
      min: [0, 'Le budget ne peut être négatif']
    },
    montantEstime: {
      type: Number,
      min: [0, 'Le montant estimé ne peut être négatif']
    },
    montantFacture: {
      type: Number,
      min: [0, 'Le montant facturé ne peut être négatif']
    },
    devise: {
      type: String,
      default: 'EUR',
      enum: ['EUR', 'USD', 'GBP']
    },
    tva: {
      taux: {
        type: Number,
        default: 20,
        min: [0, 'Le taux de TVA ne peut être négatif'],
        max: [100, 'Le taux de TVA ne peut dépasser 100%']
      }
    },
    modePaiement: {
      type: String,
      enum: ['especes', 'cheque', 'virement', 'carte', 'prelevement'],
      default: 'virement'
    }
  },
  execution: {
    dateRealisation: Date,
    heuresReelles: {
      type: Number,
      min: [0, 'Les heures réelles ne peuvent être négatives']
    },
    compteRendu: {
      type: String,
      maxlength: [5000, 'Le compte-rendu ne peut dépasser 5000 caractères']
    },
    problemes: [{
      description: {
        type: String,
        required: true,
        maxlength: [1000, 'La description du problème ne peut dépasser 1000 caractères']
      },
      gravite: {
        type: String,
        enum: ['mineure', 'modere', 'majeure', 'critique'],
        default: 'mineure'
      },
      resolu: {
        type: Boolean,
        default: false
      },
      solution: String,
      dateResolution: Date
    }],
    photos: [{
      nom: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      description: String,
      datePrise: {
        type: Date,
        default: Date.now
      }
    }],
    documentsGeneres: [{
      type: {
        type: String,
        enum: ['rapport', 'facture', 'bon_travail', 'certificat', 'autre'],
        required: true
      },
      nom: String,
      url: String,
      dateGeneration: {
        type: Date,
        default: Date.now
      }
    }]
  },
  rapportPersonnalise: {
    modele: {
      type: String,
      default: 'Modèle générique'
    },
    sections: [{
      titre: String,
      contenu: String,
      ordre: {
        type: Number,
        default: 0
      }
    }],
    signature: {
      technicien: String,
      client: String,
      dateTechnicien: Date,
      dateClient: Date
    }
  },
  ferme: {
    type: Boolean,
    default: false,
    index: true
  },
  commentaires: [{
    auteur: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, 'Le commentaire ne peut dépasser 1000 caractères']
    },
    dateCreation: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['interne', 'client', 'technique'],
      default: 'interne'
    }
  }],
  notifications: {
    rappelAvant: {
      type: Number,
      default: 24, // heures avant l'intervention
      min: [0, 'Le rappel ne peut être négatif']
    },
    emailClient: {
      type: Boolean,
      default: true
    },
    emailTechnicien: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
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
    dateArchivage: Date,
    creePar: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    modifiePar: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composés pour les recherches fréquentes
EntretienSchema.index({ 'client.nom': 'text', titre: 'text', description: 'text' });
EntretienSchema.index({ 'client.typeClient': 1, typeContrat: 1 });
EntretienSchema.index({ 'planification.dateDebut': 1, 'planification.dateFin': 1 });
EntretienSchema.index({ statut: 1, priorite: 1 });
EntretienSchema.index({ ferme: 1, 'metadata.archive': 1 });

// Génération automatique du numéro d'entretien
EntretienSchema.pre('validate', async function(next) {
  if (this.isNew && !this.numeroEntretien) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Trouver le dernier numéro pour ce mois
    const lastEntretien = await this.constructor.findOne({
      numeroEntretien: new RegExp(`^ENT-${year}${month}-`)
    }).sort({ numeroEntretien: -1 });
    
    let sequence = 1;
    if (lastEntretien) {
      const lastSequence = parseInt(lastEntretien.numeroEntretien.split('-').pop());
      sequence = lastSequence + 1;
    }
    
    this.numeroEntretien = `ENT-${year}${month}-${String(sequence).padStart(4, '0')}`;
  }
  next();
});

// Virtuals
EntretienSchema.virtual('dureeEstimee').get(function() {
  if (!this.planification.duree) return 0;
  return (this.planification.duree.heures || 0) * 60 + (this.planification.duree.minutes || 0);
});

EntretienSchema.virtual('montantTotal').get(function() {
  const montantHT = this.tarification.montantEstime || this.tarification.budget || 0;
  const tauxTVA = this.tarification.tva?.taux || 0;
  return montantHT * (1 + tauxTVA / 100);
});

EntretienSchema.virtual('estEnRetard').get(function() {
  if (this.statut === 'termine' || this.statut === 'annule') return false;
  const maintenant = new Date();
  return this.planification.dateFin < maintenant;
});

EntretienSchema.virtual('progression').get(function() {
  switch (this.statut) {
    case 'planifie': return 0;
    case 'en_cours': return 50;
    case 'termine': return 100;
    case 'annule': return 0;
    case 'reporte': return 0;
    case 'facture': return 100;
    default: return 0;
  }
});

EntretienSchema.virtual('coutMateriel').get(function() {
  if (!this.materiel || this.materiel.length === 0) return 0;
  return this.materiel.reduce((total, item) => {
    return total + (item.quantite * (item.prixUnitaire || 0));
  }, 0);
});

EntretienSchema.virtual('coutMainOeuvre').get(function() {
  if (!this.techniciens || this.techniciens.length === 0) return 0;
  return this.techniciens.reduce((total, tech) => {
    return total + ((tech.heuresAssignees || 0) * (tech.tauxHoraire || 0));
  }, 0);
});

// Méthodes d'instance
EntretienSchema.methods.calculerMontantEstime = function() {
  const coutMateriel = this.coutMateriel;
  const coutMainOeuvre = this.coutMainOeuvre;
  const sousTotal = coutMateriel + coutMainOeuvre;
  
  // Ajout d'une marge de 15% par défaut
  const marge = sousTotal * 0.15;
  const montantHT = sousTotal + marge;
  
  this.tarification.montantEstime = Math.round(montantHT * 100) / 100;
  return this.tarification.montantEstime;
};

EntretienSchema.methods.demarrer = async function(technicienId) {
  if (this.statut !== 'planifie') {
    throw new Error('Seul un entretien planifié peut être démarré');
  }
  
  this.statut = 'en_cours';
  this.execution.dateRealisation = new Date();
  
  this.commentaires.push({
    auteur: technicienId,
    message: 'Début de l\'intervention',
    type: 'technique'
  });
  
  return await this.save();
};

EntretienSchema.methods.terminer = async function(technicienId, compteRendu = '') {
  if (this.statut !== 'en_cours') {
    throw new Error('Seul un entretien en cours peut être terminé');
  }
  
  this.statut = 'termine';
  this.execution.compteRendu = compteRendu;
  
  this.commentaires.push({
    auteur: technicienId,
    message: 'Fin de l\'intervention',
    type: 'technique'
  });
  
  return await this.save();
};

EntretienSchema.methods.reporter = async function(nouvelleDate, raison, userId) {
  if (!['planifie', 'en_cours'].includes(this.statut)) {
    throw new Error('Cet entretien ne peut pas être reporté');
  }
  
  const ancienneDateDebut = this.planification.dateDebut;
  this.planification.dateDebut = nouvelleDate;
  
  // Calculer la nouvelle date de fin en gardant la même durée
  const dureeMs = this.planification.dateFin - ancienneDateDebut;
  this.planification.dateFin = new Date(nouvelleDate.getTime() + dureeMs);
  
  this.statut = 'reporte';
  
  this.commentaires.push({
    auteur: userId,
    message: `Report de l'intervention. Raison: ${raison}`,
    type: 'interne'
  });
  
  return await this.save();
};

EntretienSchema.methods.annuler = async function(raison, userId) {
  if (this.statut === 'termine' || this.statut === 'facture') {
    throw new Error('Un entretien terminé ou facturé ne peut pas être annulé');
  }
  
  this.statut = 'annule';
  this.ferme = true;
  
  this.commentaires.push({
    auteur: userId,
    message: `Annulation de l'intervention. Raison: ${raison}`,
    type: 'interne'
  });
  
  return await this.save();
};

EntretienSchema.methods.ajouterProbleme = async function(problemeData) {
  this.execution.problemes.push({
    description: problemeData.description,
    gravite: problemeData.gravite || 'mineure',
    resolu: false
  });
  
  return await this.save();
};

EntretienSchema.methods.resoudreProbleme = async function(problemeId, solution) {
  const probleme = this.execution.problemes.id(problemeId);
  if (!probleme) {
    throw new Error('Problème non trouvé');
  }
  
  probleme.resolu = true;
  probleme.solution = solution;
  probleme.dateResolution = new Date();
  
  return await this.save();
};

EntretienSchema.methods.genererRapport = async function() {
  // Génération automatique du rapport basé sur le modèle
  const rapport = {
    type: 'rapport',
    nom: `Rapport_${this.numeroEntretien}_${new Date().toISOString().split('T')[0]}.pdf`,
    dateGeneration: new Date()
  };
  
  this.execution.documentsGeneres.push(rapport);
  
  // Si tous les problèmes sont résolus et le rapport généré, marquer comme terminé
  const problemesNonResolus = this.execution.problemes.filter(p => !p.resolu);
  if (problemesNonResolus.length === 0 && this.statut === 'termine') {
    // Prêt pour facturation
    this.statut = 'facture';
  }
  
  return await this.save();
};

// Méthodes statiques
EntretienSchema.statics.findPlanifies = function() {
  const maintenant = new Date();
  return this.find({
    statut: 'planifie',
    'planification.dateDebut': { $gte: maintenant },
    'metadata.archive': false
  }).populate('contrat').sort({ 'planification.dateDebut': 1 });
};

EntretienSchema.statics.findEnCours = function() {
  return this.find({
    statut: 'en_cours',
    'metadata.archive': false
  }).populate('contrat').sort({ 'planification.dateDebut': 1 });
};

EntretienSchema.statics.findEnRetard = function() {
  const maintenant = new Date();
  return this.find({
    statut: { $in: ['planifie', 'en_cours'] },
    'planification.dateFin': { $lt: maintenant },
    'metadata.archive': false
  }).populate('contrat').sort({ 'planification.dateFin': 1 });
};

EntretienSchema.statics.findParClient = function(clientNom) {
  const regex = new RegExp(clientNom, 'i');
  return this.find({
    'client.nom': regex,
    'metadata.archive': false
  }).sort({ 'planification.dateDebut': -1 });
};

EntretienSchema.statics.getStatistiques = async function() {
  const maintenant = new Date();
  const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
  const finMois = new Date(maintenant.getFullYear(), maintenant.getMonth() + 1, 0);
  
  const [total, planifies, enCours, termines, enRetard, chiffreAffaire] = await Promise.all([
    this.countDocuments({ 'metadata.archive': false }),
    this.countDocuments({ statut: 'planifie', 'metadata.archive': false }),
    this.countDocuments({ statut: 'en_cours', 'metadata.archive': false }),
    this.countDocuments({ 
      statut: 'termine',
      'planification.dateDebut': { $gte: debutMois, $lte: finMois }
    }),
    this.countDocuments({
      statut: { $in: ['planifie', 'en_cours'] },
      'planification.dateFin': { $lt: maintenant }
    }),
    this.aggregate([
      {
        $match: {
          statut: { $in: ['termine', 'facture'] },
          'planification.dateDebut': { $gte: debutMois, $lte: finMois }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$tarification.montantFacture' }
        }
      }
    ])
  ]);
  
  return {
    total,
    planifies,
    enCours,
    termines,
    enRetard,
    chiffreAffaireMois: chiffreAffaire[0]?.total || 0
  };
};

// Plugin de pagination
EntretienSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Entretien', EntretienSchema);