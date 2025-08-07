// backend/models/movementModel.js

const mongoose = require('mongoose');

const MovementSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['entrée', 'sortie'],
    required: true
  },
  // Sous-type pour les sorties (définitive ou locative)
  subType: {
    type: String,
    enum: ['definitive', 'locative'],
    default: 'definitive'
  },
  reference: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    min: 0,
    default: 0
  },
  eventDate: {
    type: Date,
    default: Date.now
  },
  // Projet lié (optional) - peut être un ObjectId ou une chaîne
  project: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  // Champ renommé depuis 'commentaire' vers 'note'
  note: {
    type: String,
    trim: true,
    default: ''
  },
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  // Concepteur responsable de l'entrée/sortie
  concepteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Concepteur',
    default: null
  },
  // Image de la plante
  image: {
    type: String,
    trim: true,
    default: ''
  },
  // Coefficient multiplicateur (pour le mode multiple)
  coef: {
    type: Number,
    min: 0.1,
    max: 10,
    default: 1
  },
  // Indique si c'est une nouvelle plante (pas encore en stock)
  isNewPlant: {
    type: Boolean,
    default: false
  },
  // Dimensions de la plante
  height: {
    type: Number,
    min: 0,
    default: 0
  },
  diameter: {
    type: Number,
    min: 0,
    default: 0
  },
  // Catégorie de la plante
  category: {
    type: String,
    enum: ['floral', 'vert', 'plante', 'arbuste', 'arbre', 'autre'],
    default: 'autre',
    trim: true
  },
  // Pour le workflow validation/retour
  validated: {
    type: Boolean,
    default: false
  },
  returned: {
    type: Boolean,
    default: false
  },
  // Dates pour les sorties locatives
  departureDate: {
    type: Date,
    default: null
  },
  returnPlannedAt: {
    type: Date,
    default: null
  },
  returnedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movement', MovementSchema);
