import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { sequelize } from '../configs/db.js';
import '../src/users/user.model.js';
import '../src/auth/role.model.js';
import '../src/auth/refreshToken.model.js';
import { corsOptions } from '../configs/cors-configuration.js';
import { helmetConfiguration } from '../configs/helmet-configuration.js';
import {
  errorHandler,
  notFound,
} from '../middlewares/server-genericError-handler.js';
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';
import { seedRoles } from '../helpers/role-seed.js';

const BASE_PATH = '/api/v1';

let app = null;

export const buildApp = async () => {
  if (app) return app;

  await sequelize.authenticate();
  await sequelize.sync({ alter: true, logging: false });
  await seedRoles();

  app = express();
  app.set('trust proxy', 1);
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));
  app.use(express.json({ limit: '10mb' }));
  app.use(cors(corsOptions));
  app.use(helmet(helmetConfiguration));
  app.use(morgan('combined'));

  app.use(`${BASE_PATH}/auth`, authRoutes);
  app.use(`${BASE_PATH}/users`, userRoutes);

  app.get(`${BASE_PATH}/health`, (req, res) => {
    res.status(200).json({
      status: 'Healthy',
      timestamp: new Date().toISOString(),
      service: 'KinalSports Authentication Service',
    });
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export const closeDb = async () => {
  if (sequelize) {
    await sequelize.close();
  }
};
