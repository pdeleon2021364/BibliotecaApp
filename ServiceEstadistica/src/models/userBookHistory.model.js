import mongoose from 'mongoose';

const userBookHistorySchema = new mongoose.Schema({
  libroId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  categoria: { type: String, required: true },
  totalPrestamos: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('UserBookHistory', userBookHistorySchema);
