import { inject, injectable } from 'inversify';
import { HealthCheckRepository } from '../domain/repositories/health-check.repository';
import { TYPES } from '@modules/support/di/types';

export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  environment: string;
  database: 'connected' | 'disconnected';
}

@injectable()
export class GetHealthUseCase {
  constructor(
    @inject(TYPES.HealthCheckRepository)
    private readonly repository: HealthCheckRepository
  ) {}

  async execute(): Promise<HealthStatus> {
    const isDbConnected = await this.repository.checkDatabase();

    return {
      status: isDbConnected ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: isDbConnected ? 'connected' : 'disconnected',
    };
  }
}
