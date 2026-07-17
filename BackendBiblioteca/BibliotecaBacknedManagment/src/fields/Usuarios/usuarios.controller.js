import bcrypt from 'bcryptjs';
import User from './usuarios.model.js';

export const createField = async (req, res) => {
  try {
    const { contrasena, ...data } = req.body;
    const encryptedPassword = await bcrypt.hash(contrasena, 10);
    const user = await User.create({ ...data, contrasena: encryptedPassword });
    res.status(201).json({ success: true, message: 'Usuario creado exitosamente', data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getFields = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await User.find()
      .select('-contrasena')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });
    const total = await User.countDocuments();
    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalRecords: total,
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo } = req.body;
    const user = await User.findByIdAndUpdate(id, { nombre, correo }, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, message: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
