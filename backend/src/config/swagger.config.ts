import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SGCV2 Backend API',
      version,
      description: 'API for the Management and Control System (SGCV2) for XTEL Comunicaciones',
      contact: {
        name: 'XTEL Comunicaciones Dev Team',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:4000/api',
        description: 'Development Server',
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
  apis: [
    './src/modules/**/*.controller.ts',
    './src/app.ts',
    './src/shared/utils/response.helpers.ts',
    './src/shared/middleware/global-error.middleware.ts',
  ], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
