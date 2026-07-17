import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  autor: { type: String, required: true, trim: true },
  categoria: { type: String, required: true, trim: true },
  anio: { type: Number, required: true },
  disponible: { type: Boolean, default: true },
  stock: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);
