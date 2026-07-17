import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  libroId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fechaPrestamo: { type: Date, default: Date.now },
  fechaDevolucionEstimada: { type: Date, required: true },
  estado: { type: String, enum: ['activo', 'devuelto'], default: 'activo' },
}, { timestamps: true });

export default mongoose.model('Loan', loanSchema);
