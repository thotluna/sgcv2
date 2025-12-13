import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import logger from '@config/logger';

const globalForPrisma = global as unknown as { prisma: PrismaClient; pool: Pool };

const pool = globalForPrisma.pool || new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

function setupPrismaLogging(client: PrismaClient) {
  const prismaAny = client as any;

  // Queries (solo en desarrollo)
  if (process.env.NODE_ENV !== 'production') {
    prismaAny.$on('query', (e: Prisma.QueryEvent) => {
      logger.debug('Prisma Query', {
        query: e.query,
        params: e.params,
        duration: `${e.duration}ms`,
        target: e.target,
      });
    });
  }

  prismaAny.$on('error', (e: Prisma.LogEvent) => {
    logger.error('Prisma Error', {
      message: e.message,
      target: e.target,
    });
  });

  prismaAny.$on('info', (e: Prisma.LogEvent) => {
    logger.info('Prisma Info', {
      message: e.message,
      target: e.target,
    });
  });

  prismaAny.$on('warn', (e: Prisma.LogEvent) => {
    logger.warn('Prisma Warning', {
      message: e.message,
      target: e.target,
    });
  });
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' },
    ],
  });

setupPrismaLogging(prisma);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}
