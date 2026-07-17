import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  librosSugeridos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  fechaGeneracion: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Recommendation', recommendationSchema);
