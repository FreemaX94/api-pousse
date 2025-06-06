const mongoose = require('mongoose');
const { Schema } = mongoose;

const ConcepteurSchema = new Schema({
  nom: { type: String, required: true, unique: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Concepteur', ConcepteurSchema);
