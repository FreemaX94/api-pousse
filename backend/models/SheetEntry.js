import mongoose from 'mongoose';
const { Schema } = mongoose;

const SheetEntrySchema = new Schema({
  sheetId: { type: String, required: true, index: true },
  data: { type: Schema.Types.Mixed, required: true },
  source: { type: String, default: 'manual' }
}, { timestamps: true });

export default mongoose.model('SheetEntry', SheetEntrySchema);
