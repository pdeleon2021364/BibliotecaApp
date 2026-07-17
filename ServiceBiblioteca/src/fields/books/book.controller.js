import Book from './book.model.js';

export const createBook = async (req, res) => {
  try {
    const data = req.body;
    const book = await Book.create(data);
    res.status(201).json({ success: true, message: 'Libro creado exitosamente', data: book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoria, disponible, titulo, autor } = req.query;
    const filter = {};
    if (categoria) filter.categoria = { $regex: categoria, $options: 'i' };
    if (disponible !== undefined) filter.disponible = disponible === 'true';
    if (titulo) filter.titulo = { $regex: titulo, $options: 'i' };
    if (autor) filter.autor = { $regex: autor, $options: 'i' };

    const books = await Book.find(filter)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: books,
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

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Libro no encontrado' });
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ success: false, message: 'Libro no encontrado' });
    res.status(200).json({ success: true, message: 'Libro actualizado correctamente', data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Libro no encontrado' });
    res.status(200).json({ success: true, message: 'Libro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
