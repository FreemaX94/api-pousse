const mongoose = require('mongoose');
const { Schema } = mongoose;

const CounterSchema = new Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 }
});

// Vérifier si le modèle existe déjà avant de le créer
const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema);

const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequence_value;
};

module.exports = { Counter, getNextSequenceValue };