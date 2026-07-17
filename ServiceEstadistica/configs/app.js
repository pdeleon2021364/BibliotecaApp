import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { dbConnection } from './db.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';

import statisticsRoutes    from '../src/routes/statistics.routes.js';
import recommendationRoutes from '../src/routes/recommendations.routes.js';

const BASE_PATH = '/estadisticas/v1';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors(corsOptions));
    app.use(helmet(helmetConfiguration));
    app.use(morgan('dev'));
};

const routes = (app) => {
    app.use(`${BASE_PATH}/statistics`,    statisticsRoutes);
    app.use(`${BASE_PATH}/recommendations`, recommendationRoutes);

    app.get(`${BASE_PATH}/summary`, async (req, res) => {
        try {
            const Book = (await import('../src/models/book.model.js')).default;
            const Loan = (await import('../src/models/loan.model.js')).default;
            const Return = (await import('../src/models/return.model.js')).default;

            const totalBooks = await Book.countDocuments();
            const totalLoans = await Loan.countDocuments();
            const activeLoans = await Loan.countDocuments({ estado: 'activo' });
            const returnedLoans = await Loan.countDocuments({ estado: 'devuelto' });
            const totalReturns = await Return.countDocuments();
            const availableBooks = await Book.countDocuments({ disponible: true });
            const categories = await Book.distinct('categoria');

            const topCategories = await Loan.aggregate([
                { $lookup: { from: 'books', localField: 'libroId', foreignField: '_id', as: 'book' } },
                { $unwind: '$book' },
                { $group: { _id: '$book.categoria', totalPrestamos: { $sum: 1 } } },
                { $sort: { totalPrestamos: -1 } },
            ]);

            res.status(200).json({
                success: true,
                data: {
                    totalBooks,
                    totalLoans,
                    activeLoans,
                    returnedLoans,
                    totalReturns,
                    availableBooks,
                    totalCategories: categories.length,
                    categories,
                    topCategories,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    });

    app.get(`${BASE_PATH}/latest`, async (req, res) => {
        try {
            const Book = (await import('../src/models/book.model.js')).default;
            const { limit = 5 } = req.query;
            const books = await Book.find()
                .sort({ createdAt: -1 })
                .limit(Number(limit));
            res.status(200).json({ success: true, data: books });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    });

    app.get(`${BASE_PATH}/Health`, (req, res) => {
        res.status(200).json({
            status: 'Healthy',
            timestamp: new Date().toISOString(),
            service: 'estadisticas-servicio-b'
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint no encontrado en Servicio B - Estadísticas'
        });
    });
};

export const createApp = async () => {
    const app = express();
    const PORT = process.env.PORT || 3007;

    app.set('trust proxy', 1);

    await dbConnection();
    middlewares(app);
    routes(app);

    return app;
};

export const initServer = async () => {
    try {
        const app = await createApp();
        const PORT = process.env.PORT || 3007;

        app.listen(PORT, () => {
            console.log(`[Servicio B] Estadísticas corriendo en puerto ${PORT}`);
            console.log(`[Servicio B] Health: http://localhost:${PORT}${BASE_PATH}/Health`);
        });
    } catch (error) {
        console.error(`Error starting Servicio B: ${error.message}`);
        process.exit(1);
    }
};
