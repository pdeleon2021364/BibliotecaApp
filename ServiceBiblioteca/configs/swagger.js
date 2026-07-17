import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Servicio A - Gestión de Biblioteca',
      version: '1.0.0',
      description: 'Microservicio de gestión de catálogo y préstamos de la biblioteca.',
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
    ]
  },
  apis: [
    './src/fields/auth/*.js',
    './src/fields/Usuarios/*.js',
    './src/fields/books/*.js',
    './src/fields/loans/*.js',
    './src/fields/returns/*.js',
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
    customSiteTitle: 'Servicio A - Biblioteca API',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true
    }
  }));

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`[Servicio A] Swagger → http://localhost:${process.env.PORT || 3006}/api-docs`);
};

export { swaggerSpec };
