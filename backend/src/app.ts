import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import { container } from './container';
import { JwtStrategy } from './modules/auth/infrastructure/http/strategies/jwt.strategy';
import { LocalStrategy } from './modules/auth/infrastructure/http/strategies/local.strategy';
import { TYPES as AuthTypes } from './modules/auth/di/types';
import { prisma } from './config/prisma';
import { loadRoutes } from 'routes';
import { requestLogger } from '@shared/middleware/requestLogger';
import { errorLogger } from '@shared/middleware/errorLogger';
import logger from '@config/logger';
import { globalErrorHandler } from '@shared/middleware/global-error.middleware';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@config/swagger.config';

// Load environment variables
dotenv.config();

const app: Application = express();

// ---------- Middleware ----------
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.CORS_ORIGIN || 'http://localhost:3000',
        'http://localhost:3000',
        'http://localhost:3001',
      ];
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(express.urlencoded({ extended: true }));

// ---------- Passport ----------
const jwtStrategy = container.get<JwtStrategy>(AuthTypes.JwtStrategy);
const localStrategy = container.get<LocalStrategy>(AuthTypes.LocalStrategy);
passport.use(jwtStrategy);
passport.use(localStrategy);
app.use(passport.initialize());

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check de la API y base de datos
 *     tags: [Soporte]
 *     responses:
 *       200:
 *         description: El servidor está funcionando y la base de datos está conectada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: ok }
 *                 timestamp: { type: string, format: date-time }
 *                 environment: { type: string, example: development }
 *                 database: { type: string, example: connected }
 *       500:
 *         description: Error en el servidor o base de datos desconectada
 */
app.get('/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ---------- API ----------
const API_PREFIX = process.env.API_PREFIX || '/api';

// Mount routes
loadRoutes(app, API_PREFIX);

// ---------- Swagger Documentation ----------
app.use(`${API_PREFIX}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get(`${API_PREFIX}/`, (_req: Request, res: Response) => {
  res.json({
    message: 'SGCV2 API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: API_PREFIX,
      auth: `${API_PREFIX}/auth`,
      users: `${API_PREFIX}/users`,
    },
  });
});

// ---------- Testing Endpoints ----------
if (process.env.NODE_ENV !== 'production') {
  app.post(`${API_PREFIX}/testing/cleanup-customers`, async (_req: Request, res: Response) => {
    try {
      // Delete customers created by E2E tests
      const { count } = await prisma.customer.deleteMany({
        where: {
          OR: [{ legalName: { startsWith: 'E2E ' } }, { businessName: { startsWith: 'E2E ' } }],
        },
      });
      logger.info(`🧹 E2E Cleanup: Deleted ${count} test customers`);
      res.json({ success: true, count });
    } catch {
      res.status(500).json({ error: 'Failed to cleanup' });
    }
  });
}

// ---------- 404 handler ----------
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
});
app.use(errorLogger);
// ---------- Error handler ----------
app.use(globalErrorHandler);

export default app;
