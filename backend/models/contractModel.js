const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContractSchema = new Schema({
  client: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isB2B: { type: Boolean, default: false },
  contractType: { type: String, required: true }
}, { timestamps: true });

ContractSchema.pre('save', function(next) {
  if (this.startDate > this.endDate) {
    return next(new Error('Start date must be before end date'));
  }
  next();
});

module.exports = mongoose.model('Contract', ContractSchema);
