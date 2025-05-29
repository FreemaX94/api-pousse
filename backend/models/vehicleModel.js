const mongoose = require('mongoose');
const { Schema } = mongoose;

const VehicleSchema = new Schema({
  licensePlate: { type: String, required: true, unique: true, trim: true },
  model: { type: String, required: true, trim: true },
  capacity: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);
