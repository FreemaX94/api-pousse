import mongoose from 'mongoose';
const { Schema } = mongoose;

const InvoiceSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'SalesOrder', required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['paid', 'unpaid', 'overdue'], default: 'unpaid' }
}, { timestamps: true });

export default mongoose.model('Invoice', InvoiceSchema);
