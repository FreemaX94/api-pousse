import mongoose from 'mongoose';
const { Schema } = mongoose;

const ConcepteurSchema = new Schema({
  nom: { type: String, required: true, unique: true, trim: true }
}, { timestamps: true });

export default mongoose.model('Concepteur', ConcepteurSchema);
