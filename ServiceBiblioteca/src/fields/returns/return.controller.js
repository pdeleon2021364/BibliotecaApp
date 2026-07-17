import Return from './return.model.js';
import Loan from '../loans/loan.model.js';
import Book from '../books/book.model.js';

export const createReturn = async (req, res) => {
  try {
    const { prestamoId, observaciones } = req.body;

    const loan = await Loan.findById(prestamoId);
    if (!loan) return res.status(404).json({ success: false, message: 'Préstamo no encontrado' });
    if (loan.estado === 'devuelto')
      return res.status(400).json({ success: false, message: 'Este préstamo ya fue devuelto' });

    const returnRecord = await Return.create({ prestamoId, observaciones });

    loan.estado = 'devuelto';
    await loan.save();

    const book = await Book.findById(loan.libroId);
    if (book) {
      book.stock += 1;
      book.disponible = true;
      await book.save();
    }

    res.status(201).json({ success: true, message: 'Devolución registrada exitosamente', data: returnRecord });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getReturns = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const returns = await Return.find()
      .populate({ path: 'prestamoId', populate: { path: 'libroId', select: 'titulo autor' } })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Return.countDocuments();

    res.status(200).json({
      success: true,
      data: returns,
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

export const getReturnById = async (req, res) => {
  try {
    const returnRecord = await Return.findById(req.params.id)
      .populate({ path: 'prestamoId', populate: { path: 'libroId', select: 'titulo autor categoria' } });
    if (!returnRecord) return res.status(404).json({ success: false, message: 'Devolución no encontrada' });
    res.status(200).json({ success: true, data: returnRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReturn = async (req, res) => {
  try {
    const returnRecord = await Return.findByIdAndDelete(req.params.id);
    if (!returnRecord) return res.status(404).json({ success: false, message: 'Devolución no encontrada' });

    const loan = await Loan.findById(returnRecord.prestamoId);
    if (loan) {
      loan.estado = 'activo';
      await loan.save();
    }

    res.status(200).json({ success: true, message: 'Devolución eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
