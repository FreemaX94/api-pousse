// backend/models/Price.js
const mongoose = require('mongoose')
const { Schema } = mongoose

const PriceSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Produit',
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    uppercase: true,
    match: /^[A-Z]{3}$/
  },
  validFrom: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Index pour récupérer rapidement les tarifs les plus récents
PriceSchema.index({ product: 1, validFrom: -1 })

module.exports = mongoose.model('Price', PriceSchema)
