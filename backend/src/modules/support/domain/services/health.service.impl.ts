import { TYPES } from '@modules/support/di/types';
import { inject, injectable } from 'inversify';

import { HealthStatus } from '@sgcv2/shared';

import { HealthCheckRepository } from '../repositories/health-check.repository';
import { HealthService } from './health.service';

@injectable()
export class HealthServiceImpl implements HealthService {
  constructor(
    @inject(TYPES.HealthCheckRepository)
    private readonly repository: HealthCheckRepository
  ) {}

  async checkHealth(): Promise<HealthStatus> {
    const isDbConnected = await this.repository.checkDatabase();

    return {
      status: isDbConnected ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: isDbConnected ? 'connected' : 'disconnected',
    };
  }
}
