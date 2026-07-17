import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3007,
  jwtSecret: process.env.JWT_SECRET || 'changeme',
  servicioA: {
    url: process.env.SERVICIO_A_URL || 'http://localhost:3006/biblioteca/v1',
  }
};
