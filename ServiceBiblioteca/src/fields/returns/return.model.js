import mongoose from 'mongoose';

const returnSchema = new mongoose.Schema({
  prestamoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  fechaDevolucionReal: { type: Date, default: Date.now },
  observaciones: { type: String, trim: true },
}, { timestamps: true });

export default mongoose.model('Return', returnSchema);
