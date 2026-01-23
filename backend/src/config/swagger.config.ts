import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SGCV2 Backend API',
      version,
      description: 'API para el Sistema de Gestión y Control (SGCV2) para XTEL Comunicaciones',
      contact: {
        name: 'XTEL Comunicaciones Dev Team',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:4000/api',
        description: 'Servidor de Desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.controller.ts', './src/app.ts', './src/config/swagger.schemas.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
