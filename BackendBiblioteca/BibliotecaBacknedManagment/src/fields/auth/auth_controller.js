import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../Usuarios/usuarios.model.js';

const emailTemplate = ({ title, message, buttonText, link, color }) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table width="500" style="background:#ffffff; border-radius:12px; padding:30px; box-shadow:0 6px 18px rgba(0,0,0,0.08);">
          <tr><td align="center">
            <h2 style="margin:0; color:#1e293b;">BibliotecaApp</h2>
            <p style="color:#64748b; margin-top:5px;">${title}</p>
          </td></tr>
          <tr><td style="padding:20px 0; color:#334155; font-size:15px; line-height:1.6;">${message}</td></tr>
          <tr><td align="center">
            <a href="${link}" style="background:${color}; color:#ffffff; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:bold; display:inline-block; font-size:14px;">${buttonText}</a>
          </td></tr>
          <tr><td style="padding-top:25px; font-size:13px; color:#94a3b8;">Si el botón no funciona copia este enlace:<br><span style="word-break:break-all;">${link}</span></td></tr>
          <tr><td style="padding-top:30px; font-size:12px; color:#94a3b8; text-align:center;">© ${new Date().getFullYear()} BibliotecaApp - Todos los derechos reservados</td></tr>
        </table>
      </td></tr>
    </table>
  </div>`;
};

export const register = async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
    }

    const encryptedPassword = await bcrypt.hash(contrasena, 10);
    const emailToken = crypto.randomBytes(32).toString('hex');

    const totalUsers = await User.countDocuments();
    const rol = totalUsers === 0 ? 'administrador' : 'cliente';

    await User.create({ nombre, correo, contrasena: encryptedPassword, rol });

    const verifyLink = `http://localhost:${process.env.PORT}/biblioteca/v1/auth/verify-email?token=${emailToken}`;

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
