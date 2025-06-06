// backend/models/Item.js
const mongoose = require('mongoose')
const { Schema } = mongoose

const ItemSchema = new Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  data: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
})

// Index pour optimiser les recherches par type et nom
ItemSchema.index({ type: 1, name: 1 })

module.exports = mongoose.model('Item', ItemSchema)
