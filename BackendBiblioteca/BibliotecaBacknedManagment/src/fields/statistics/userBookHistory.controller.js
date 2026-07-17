import UserBookHistory from './userBookHistory.model.js';

export const getStatistics = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const stats = await UserBookHistory.find()
      .populate('libroId', 'titulo autor anio')
      .sort({ totalPrestamos: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await UserBookHistory.countDocuments();

    res.status(200).json({
      success: true,
      data: stats,
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

export const getStatisticsByCategory = async (req, res) => {
  try {
    const stats = await UserBookHistory.aggregate([
      { $group: { _id: '$categoria', totalPrestamos: { $sum: '$totalPrestamos' }, libros: { $sum: 1 } } },
      { $sort: { totalPrestamos: -1 } },
    ]);

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTopBooks = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const top = await UserBookHistory.find()
      .populate('libroId', 'titulo autor anio categoria')
      .sort({ totalPrestamos: -1 })
      .limit(Number(limit));

    res.status(200).json({ success: true, data: top });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
