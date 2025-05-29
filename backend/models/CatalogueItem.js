const mongoose = require('mongoose');
const { Schema } = mongoose;

const CatalogueItemSchema = new Schema({
  categorie: { type: String, required: true, index: true },
  nom: { type: String, required: true, trim: true },
  infos: { type: Schema.Types.Mixed }
}, { timestamps: true });

CatalogueItemSchema.index({ categorie: 1, nom: 1 });

CatalogueItemSchema.pre('deleteMany', function (next) {
  const filter = this.getFilter();
  if (!filter || Object.keys(filter).length === 0) {
    return next(new Error('❌ Suppression globale interdite sur CatalogueItem'));
  }
  next();
});

CatalogueItemSchema.pre('deleteOne', function (next) {
  const filter = this.getFilter?.() || this._conditions;
  if (!filter || Object.keys(filter).length === 0) {
    return next(new Error('❌ Suppression sans filtre interdite sur CatalogueItem'));
  }
  next();
});

module.exports = mongoose.model('CatalogueItem', CatalogueItemSchema);

