import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { dbConnection } from './db.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import { setupSwagger } from './swagger.js';

import usuariosRoutes        from '../src/fields/Usuarios/usuarios.routes.js';
import authRoutes            from '../src/fields/auth/auth_routes.js';
import bookRoutes            from '../src/fields/books/book.routes.js';
import loanRoutes            from '../src/fields/loans/loan.routes.js';
import returnRoutes          from '../src/fields/returns/return.routes.js';
import statisticsRoutes      from '../src/fields/statistics/userBookHistory.routes.js';
import recommendationRoutes  from '../src/fields/recommendations/recommendation.routes.js';

const BASE_PATH = '/biblioteca/v1';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors(corsOptions));
    app.use(helmet(helmetConfiguration));
    app.use(morgan('dev'));
};

const routes = (app) => {
    setupSwagger(app);

    app.use(`${BASE_PATH}/auth`,          authRoutes);
    app.use(`${BASE_PATH}/Usuarios`,      usuariosRoutes);
    app.use(`${BASE_PATH}/books`,         bookRoutes);
    app.use(`${BASE_PATH}/loans`,         loanRoutes);
    app.use(`${BASE_PATH}/returns`,       returnRoutes);
    app.use(`${BASE_PATH}/statistics`,    statisticsRoutes);
    app.use(`${BASE_PATH}/recommendations`, recommendationRoutes);

    app.get(`${BASE_PATH}/Health`, (req, res) => {
        res.status(200).json({
            status: 'Healthy',
            timestamp: new Date().toISOString(),
            service: 'biblioteca'
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint no encontrado en Biblioteca API'
        });
    });
};

export const createApp = async () => {
    const app = express();
    const PORT = process.env.PORT || 3006;

    app.set('trust proxy', 1);

    await dbConnection();
    middlewares(app);
    routes(app);

    return app;
};

export const initServer = async () => {
    try {
        const app = await createApp();
        const PORT = process.env.PORT || 3006;

        app.listen(PORT, () => {
            console.log(`Biblioteca Server running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/Health`);
        });
    } catch (error) {
        console.error(`Error starting Server: ${error.message}`);
        process.exit(1);
    }
};
