const mongoose = require('mongoose');

const LivraisonSchema = new mongoose.Schema({
  // Date de la livraison
  date: {
    type: Date,
    required: true,
    index: true
  },
  
  // Mois de référence (juin, juillet, etc.)
  mois: {
    type: String,
    required: true,
    enum: ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'],
    index: true
  },
  
  // Horaire de livraison
  horaire: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Qui fait la demande
  demandeur: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Type d'activité / Code activité
  codeActivite: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Nombre de colis
  nbColis: {
    type: Number,
    default: 0
  },
  
  // Référence devis
  referenceDevis: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Nom du client
  client: {
    type: String,
    trim: true,
    default: '',
    index: true
  },
  
  // Entreprise
  entreprise: {
    type: String,
    trim: true,
    default: '',
    index: true
  },
  
  // Adresse de destination
  adresse: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Accès livraison
  accesLivraison: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Infos diverses
  infos: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Téléphone
  telephone: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Client prévenu
  clientPrevenu: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Prix à facturer
  prix: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Statut fait/terminé
  fait: {
    type: Boolean,
    default: false,
    index: true
  },
  
  // Métadonnées d'import
  source: {
    type: String,
    default: 'liva-excel'
  },
  
  importedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composé pour les recherches fréquentes
LivraisonSchema.index({ date: 1, mois: 1 });
LivraisonSchema.index({ client: 1, entreprise: 1 });
LivraisonSchema.index({ fait: 1, date: 1 });

// Virtuals
LivraisonSchema.virtual('dateFormatted').get(function() {
  return this.date.toLocaleDateString('fr-FR');
});

LivraisonSchema.virtual('prixFormatted').get(function() {
  return this.prix > 0 ? `${this.prix.toFixed(2)} €` : 'Non facturé';
});

LivraisonSchema.virtual('statusText').get(function() {
  return this.fait ? 'Terminé' : 'En cours';
});

// Méthodes statiques
LivraisonSchema.statics.findByMonth = function(mois) {
  return this.find({ mois }).sort({ date: 1 });
};

LivraisonSchema.statics.findByClient = function(client) {
  return this.find({ client: new RegExp(client, 'i') }).sort({ date: -1 });
};

LivraisonSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$mois',
        total: { $sum: 1 },
        termine: { $sum: { $cond: ['$fait', 1, 0] } },
        chiffreAffaires: { $sum: '$prix' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

module.exports = mongoose.model('Livraison', LivraisonSchema);