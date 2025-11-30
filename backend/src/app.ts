import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import { jwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { localStrategy } from './modules/auth/strategies/local.strategy';
import authRouter from './modules/auth/auth.routes';
import usersRouter from './modules/users/users.routes';
import customersRouter from './modules/customer/customer.routes';
import { prisma } from './config/prisma';

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
app.use(express.urlencoded({ extended: true }));

// ---------- Passport ----------
passport.use(jwtStrategy);
passport.use(localStrategy);
app.use(passport.initialize());

// ---------- Health check ----------
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
app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/users`, usersRouter);
app.use(`${API_PREFIX}/customers`, customersRouter);

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

// ---------- 404 handler ----------
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
});

// ---------- Error handler ----------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString(),
  });
});

export default app;
