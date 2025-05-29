const mongoose = require('mongoose');
const { Schema } = mongoose;

const InvoiceSchema = new Schema({
  client: { type: String, required: true, trim: true },
  employee: { type: String, required: true, trim: true },
  pole: { type: String, required: true, trim: true },
  details: { type: String, trim: true },
  amount: { type: Number, required: true, min: 0 },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['paid', 'unpaid', 'overdue'], default: 'unpaid' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
