import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  correo: { type: String, required: true, unique: true, trim: true, lowercase: true },
  contrasena: { type: String, required: true },
  rol: { type: String, enum: ['administrador', 'cliente'], default: 'cliente' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.URI_MONGO, { serverSelectionTimeoutMS: 5000 });
    console.log('Conectado a MongoDB');

    const existing = await User.findOne({ correo: 'admin@ksports.local' });
    if (existing) {
      console.log('El usuario admin ya existe');
    } else {
      const hashedPassword = await bcrypt.hash('Admin1234!', 10);
      await User.create({
        nombre: 'Admin',
        correo: 'admin@ksports.local',
        contrasena: hashedPassword,
        rol: 'administrador',
      });
      console.log('Usuario admin creado exitosamente');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

seed();
