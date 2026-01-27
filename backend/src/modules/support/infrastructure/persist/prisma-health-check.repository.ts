import { prisma } from '@config/prisma';
import { HealthCheckRepository } from '@modules/support/domain/repositories/health-check.repository';
import { injectable } from 'inversify';

@injectable()
export class PrismaHealthCheckRepository implements HealthCheckRepository {
  async checkDatabase(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
