import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  correo: { type: String, required: true, unique: true, trim: true, lowercase: true },
  contrasena: { type: String, required: true },
  rol: { type: String, enum: ['administrador', 'cliente'], default: 'cliente' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
