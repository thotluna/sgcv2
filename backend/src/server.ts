import dotenv from 'dotenv';
import 'reflect-metadata';
dotenv.config();

import app from './app';
import logger from '@config/logger';

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || 'localhost';

const server = app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`, {
    environment: process.env.NODE_ENV,
    logLevel: process.env.LOG_LEVEL
  });
  console.log('🚀 SGCV2 Backend Server');
  console.log(`📡 Server running on http://${HOST}:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 API Prefix: ${process.env.API_PREFIX || '/api'}`);
  console.log(`✅ Health check: http://${HOST}:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});
