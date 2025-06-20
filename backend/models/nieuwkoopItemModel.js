const mongoose = require('mongoose');

const nieuwkoopItemSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  height: Number,
  diameter: Number,
  price: Number,
  image: String,
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  reservedQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  note: {
    type: String,
    default: "",
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NieuwkoopItem', nieuwkoopItemSchema);
