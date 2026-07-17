import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BibliotecaApp API',
      version: '1.0.0',
      description: 'API para el sistema de gestión bibliotecaria con Node.js, Express y MongoDB.',
      contact: {
        name: 'BibliotecaApp Dev',
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3006}`,
        description: 'Servidor de desarrollo local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese su token JWT en el formato: Bearer <token>'
        }
      }
    },
    tags: [
      { name: 'Auth',              description: 'Autenticación y registro de usuarios' },
      { name: 'Usuarios',          description: 'Gestión de usuarios del sistema' },
      { name: 'Books',             description: 'Catálogo de libros de la biblioteca' },
      { name: 'Loans',             description: 'Préstamos de libros' },
      { name: 'Returns',           description: 'Devoluciones de libros' },
      { name: 'Statistics',        description: 'Estadísticas e historial de lectura' },
      { name: 'Recommendations',   description: 'Recomendaciones personalizadas' },
    ]
  },
  apis: [
    './src/fields/auth/*.js',
    './src/fields/Usuarios/*.js',
    './src/fields/books/*.js',
    './src/fields/loans/*.js',
    './src/fields/returns/*.js',
    './src/fields/statistics/*.js',
    './src/fields/recommendations/*.js',
  ]
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { font-size: 28px; font-weight: 700; color: #1a3c5e; }
      .swagger-ui .scheme-container { background: #f0f4f8; padding: 15px; border-radius: 8px; }
    `,
    customSiteTitle: 'BibliotecaApp API - Documentación',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true
    }
  }));

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`Swagger UI disponible en → http://localhost:${process.env.PORT || 3006}/api-docs`);
};

export { swaggerSpec };
