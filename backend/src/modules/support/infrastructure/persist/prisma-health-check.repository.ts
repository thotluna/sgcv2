import { injectable } from 'inversify';
import { prisma } from '@config/prisma';
import { IHealthCheckRepository } from '@modules/support/domain/repositories/health-check.repository';

@injectable()
export class PrismaHealthCheckRepository implements IHealthCheckRepository {
  async checkDatabase(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      return false;
    }
  }
}
