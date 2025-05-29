const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
  address: { type: String, required: true },
  date: { type: Date, required: false },
  status: { type: String, default: 'pending' }
});

module.exports = mongoose.model('Delivery', DeliverySchema);
