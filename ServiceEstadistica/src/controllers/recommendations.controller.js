import Book from '../models/book.model.js';
import UserBookHistory from '../models/userBookHistory.model.js';
import Recommendation from '../models/recommendation.model.js';

export const generateRecommendations = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const userHistory = await UserBookHistory.aggregate([
      { $group: { _id: '$categoria', total: { $sum: '$totalPrestamos' } } },
      { $sort: { total: -1 } },
      { $limit: 3 },
    ]);

    const topCategories = userHistory.map((h) => h._id).filter(Boolean);

    let recommendedBooks = [];
    if (topCategories.length > 0) {
      const books = await Book.aggregate([
        { $match: { disponible: true } },
        { $sample: { size: 5 } },
      ]);
      recommendedBooks = books.map((b) => b._id);
    } else {
      const randomBooks = await Book.aggregate([{ $sample: { size: 5 } }]);
      recommendedBooks = randomBooks.map((b) => b._id);
    }

    const existing = await Recommendation.findOne({ usuarioId });
    if (existing) {
      existing.librosSugeridos = recommendedBooks;
      existing.fechaGeneracion = new Date();
      await existing.save();
    } else {
      await Recommendation.create({ usuarioId, librosSugeridos: recommendedBooks });
    }

    res.status(200).json({ success: true, message: 'Recomendaciones generadas', data: recommendedBooks.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecommendationsByUser = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId || req.user.id;
    const recommendation = await Recommendation.findOne({ usuarioId }).populate('librosSugeridos');

    if (!recommendation)
      return res.status(404).json({ success: false, message: 'No hay recomendaciones para este usuario' });

    res.status(200).json({ success: true, data: recommendation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const recommendByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 5 } = req.query;

    if (!category) {
      return res.status(400).json({ success: false, message: 'Debe especificar una categoría' });
    }

    const books = await Book.find({
      categoria: { $regex: category, $options: 'i' },
      disponible: true
    })
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: books,
      total: books.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
