import Loan from './loan.model.js';
import Book from '../books/book.model.js';
import UserBookHistory from './userBookHistory.model.js';

export const createLoan = async (req, res) => {
  try {
    const { libroId, fechaDevolucionEstimada } = req.body;
    const usuarioId = req.user.id;

    const book = await Book.findById(libroId);
    if (!book) return res.status(404).json({ success: false, message: 'Libro no encontrado' });
    if (!book.disponible || book.stock < 1)
      return res.status(400).json({ success: false, message: 'Libro no disponible para préstamo' });

    const loan = await Loan.create({ libroId, usuarioId, fechaDevolucionEstimada });

    book.stock -= 1;
    if (book.stock === 0) book.disponible = false;
    await book.save();

    await UserBookHistory.findOneAndUpdate(
      { libroId },
      { $inc: { totalPrestamos: 1 }, $setOnInsert: { categoria: book.categoria } },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, message: 'Préstamo registrado exitosamente', data: loan });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getLoans = async (req, res) => {
  try {
    const { page = 1, limit = 10, estado } = req.query;
    const filter = {};
    if (estado) filter.estado = estado;

    const loans = await Loan.find(filter)
      .populate('libroId', 'titulo autor')
      .populate('usuarioId', 'nombre correo')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Loan.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: loans,
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

export const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('libroId', 'titulo autor categoria')
      .populate('usuarioId', 'nombre correo');
    if (!loan) return res.status(404).json({ success: false, message: 'Préstamo no encontrado' });
    res.status(200).json({ success: true, data: loan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyLoans = async (req, res) => {
  try {
    const { page = 1, limit = 10, estado } = req.query;
    const filter = { usuarioId: req.user.id };
    if (estado) filter.estado = estado;

    const loans = await Loan.find(filter)
      .populate('libroId', 'titulo autor')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Loan.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: loans,
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

export const updateLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!loan) return res.status(404).json({ success: false, message: 'Préstamo no encontrado' });
    res.status(200).json({ success: true, message: 'Préstamo actualizado correctamente', data: loan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);
    if (!loan) return res.status(404).json({ success: false, message: 'Préstamo no encontrado' });

    const book = await Book.findById(loan.libroId);
    if (book) {
      book.stock += 1;
      book.disponible = true;
      await book.save();
    }

    res.status(200).json({ success: true, message: 'Préstamo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
