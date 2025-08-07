// backend/models/movementModel.js

const mongoose = require('mongoose');

const MovementSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['entrée', 'sortie'],
    required: true
  },
  subType: {
    type: String,
    enum: ['definitive', 'locative'],
    required: function() { return this.type === 'sortie'; },
    default: null
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
  // Image de la plante
  image: {
    type: String,
    trim: true,
    default: ''
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
