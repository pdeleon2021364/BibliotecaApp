import Recommendation from './recommendation.model.js';
import UserBookHistory from '../statistics/userBookHistory.model.js';
import Book from '../books/book.model.js';

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
      const loans = await Book.aggregate([
        { $match: { disponible: true } },
        { $sample: { size: 5 } },
      ]);
      recommendedBooks = loans.map((b) => b._id);
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

export const deleteRecommendation = async (req, res) => {
  try {
    const rec = await Recommendation.findByIdAndDelete(req.params.id);
    if (!rec) return res.status(404).json({ success: false, message: 'Recomendación no encontrada' });
    res.status(200).json({ success: true, message: 'Recomendación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
