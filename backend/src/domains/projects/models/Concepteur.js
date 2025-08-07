const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const ConcepteurSchema = new Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du concepteur est requis'],
    unique: true,
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    maxlength: [100, 'Le nom ne peut dépasser 100 caractères'],
    match: [/^[a-zA-ZÀ-ÿ\s-']+$/, 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes']
  },
  entreprise: {
    type: String,
    trim: true,
    maxlength: [200, 'Le nom de l\'entreprise ne peut dépasser 200 caractères']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Format d\'email invalide'],
    index: true
  },
  telephone: {
    type: String,
    trim: true,
    match: [/^[+\d\s-.()]+$/, 'Format de téléphone invalide']
  },
  adresse: {
    rue: { type: String, trim: true, maxlength: 200 },
    codePostal: { type: String, trim: true, match: [/^\d{5}$/, 'Code postal invalide'] },
    ville: { type: String, trim: true, maxlength: 100 },
    pays: { type: String, trim: true, default: 'France', maxlength: 100 }
  },
  specialites: [{
    type: String,
    trim: true,
    enum: ['floral', 'paysage', 'intérieur', 'événementiel', 'autre'],
    default: 'floral'
  }],
  tauxCommission: {
    type: Number,
    min: [0, 'Le taux de commission ne peut être négatif'],
    max: [100, 'Le taux de commission ne peut dépasser 100%'],
    default: 10
  },
  actif: {
    type: Boolean,
    default: true,
    index: true
  },
  projets: [{
    type: Schema.Types.ObjectId,
    ref: 'Projet'
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Les notes ne peuvent dépasser 1000 caractères']
  },
  documents: [{
    nom: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    type: { type: String, enum: ['contrat', 'portfolio', 'autre'], default: 'autre' },
    dateAjout: { type: Date, default: Date.now }
  }],
  statistiques: {
    nombreProjets: { type: Number, default: 0, min: 0 },
    chiffreAffaireTotal: { type: Number, default: 0, min: 0 },
    dernierProjet: { type: Date },
    evaluationMoyenne: { type: Number, min: 0, max: 5 }
  },
  metadata: {
    dateCreation: { type: Date, default: Date.now },
    derniereModification: { type: Date },
    modifiePar: { type: Schema.Types.ObjectId, ref: 'User' }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composés pour les recherches fréquentes
ConcepteurSchema.index({ nom: 1, actif: 1 });
ConcepteurSchema.index({ email: 1, actif: 1 });
ConcepteurSchema.index({ 'specialites': 1, actif: 1 });

// Virtuals
ConcepteurSchema.virtual('nomComplet').get(function() {
  return this.entreprise ? `${this.nom} - ${this.entreprise}` : this.nom;
});

ConcepteurSchema.virtual('adresseComplete').get(function() {
  if (!this.adresse || !this.adresse.rue) return '';
  const parts = [this.adresse.rue];
  if (this.adresse.codePostal) parts.push(this.adresse.codePostal);
  if (this.adresse.ville) parts.push(this.adresse.ville);
  if (this.adresse.pays && this.adresse.pays !== 'France') parts.push(this.adresse.pays);
  return parts.join(', ');
});

// Méthodes d'instance
ConcepteurSchema.methods.calculerCommission = function(montant) {
  if (!montant || montant < 0) return 0;
  return Math.round((montant * this.tauxCommission / 100) * 100) / 100;
};

ConcepteurSchema.methods.ajouterProjet = async function(projetId) {
  if (!this.projets.includes(projetId)) {
    this.projets.push(projetId);
    this.statistiques.nombreProjets = this.projets.length;
    this.statistiques.dernierProjet = new Date();
    await this.save();
  }
};

ConcepteurSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Méthodes statiques
ConcepteurSchema.statics.findActifs = function() {
  return this.find({ actif: true }).sort({ nom: 1 });
};

ConcepteurSchema.statics.rechercher = function(terme) {
  if (!terme) return this.findActifs();
  
  const regex = new RegExp(terme, 'i');
  return this.find({
    actif: true,
    $or: [
      { nom: regex },
      { entreprise: regex },
      { email: regex },
      { 'adresse.ville': regex }
    ]
  }).sort({ nom: 1 });
};

ConcepteurSchema.statics.findBySpecialite = function(specialite) {
  return this.find({
    actif: true,
    specialites: specialite
  }).sort({ nom: 1 });
};

// Middleware pre-save
ConcepteurSchema.pre('save', function(next) {
  // Mettre à jour la date de dernière modification
  this.metadata.derniereModification = new Date();
  
  // Valider l'email uniquement s'il est fourni
  if (this.email && this.email.trim() === '') {
    this.email = undefined;
  }
  
  // Normaliser le nom
  if (this.nom) {
    this.nom = this.nom.trim().replace(/\s+/g, ' ');
  }
  
  next();
});

// Middleware pre-remove
ConcepteurSchema.pre('remove', async function(next) {
  // Vérifier s'il y a des projets associés
  const Projet = mongoose.model('Projet');
  const projetsCount = await Projet.countDocuments({ concepteur: this._id });
  
  if (projetsCount > 0) {
    throw new Error(`Impossible de supprimer ce concepteur car ${projetsCount} projet(s) y sont associés`);
  }
  
  next();
});

// Plugin de pagination
ConcepteurSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Concepteur', ConcepteurSchema);
