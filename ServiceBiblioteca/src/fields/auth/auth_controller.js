import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../Usuarios/usuarios.model.js';

export const register = async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
    }

    const encryptedPassword = await bcrypt.hash(contrasena, 10);

    const totalUsers = await User.countDocuments();
    const rol = totalUsers === 0 ? 'administrador' : 'cliente';

    await User.create({ nombre, correo, contrasena: encryptedPassword, rol });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(contrasena, user.contrasena);
    if (!validPassword) {
      return res.status(400).json({ success: false, message: 'Credenciales inválidas' });
    }

    const payload = { sub: user._id, role: user.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ success: true, token, rol: user.rol, nombre: user.nombre });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en login', error: error.message });
  }
};

export const listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const safeLimit = Math.max(parseInt(limit, 10) || 10, 1);

    const users = await User.find()
      .select('-contrasena')
      .limit(safeLimit)
      .skip((safePage - 1) * safeLimit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: safePage,
        totalPages: Math.ceil(total / safeLimit),
        totalRecords: total,
        limit: safeLimit,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
