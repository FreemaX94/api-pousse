const mongoose = require('mongoose');
const { Schema } = mongoose;
const { getNextSequenceValue } = require('./Counter');

const StockEntrySchema = new Schema({
  stockId: { type: String, unique: true, index: true },
  product: { type: Schema.Types.ObjectId, ref: 'CatalogueItem', required: true, index: true },
  categorie: { type: String, enum: ['Plantes','Contenants','Décor','Artificiels','Séchés'], required: true, index: true },
  quantity: { type: Number, required: true },
  type: { type: String, enum: ['in', 'out', 'adjust'], required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// Générer un ID unique logique avant la sauvegarde
StockEntrySchema.pre('save', async function(next) {
  if (this.isNew && !this.stockId) {
    try {
      const sequenceValue = await getNextSequenceValue('stockEntry');
      
      // Format: ST-YYYY-NNNN (ST = Stock, YYYY = année, NNNN = numéro séquentiel)
      const year = new Date().getFullYear();
      const paddedSequence = sequenceValue.toString().padStart(4, '0');
      this.stockId = `ST-${year}-${paddedSequence}`;
      
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.models.StockEntry || mongoose.model('StockEntry', StockEntrySchema);