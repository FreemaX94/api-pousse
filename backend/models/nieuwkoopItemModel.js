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
}, {
  timestamps: true
});

module.exports = mongoose.model('NieuwkoopItem', nieuwkoopItemSchema);
