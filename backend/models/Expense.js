const mongoose = require('mongoose');
const { Schema } = mongoose;

const ExpenseSchema = new Schema({
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, trim: true },
  date: { type: Date, required: true, default: Date.now },
  currency: { type: String, required: true, uppercase: true, match: /^[A-Z]{3}$/ }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
