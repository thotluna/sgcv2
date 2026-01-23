import { inject, injectable } from 'inversify';
import { HealthService } from '../domain/services/health.service';
import { TYPES } from '@modules/support/di/types';
import { HealthStatus } from '@sgcv2/shared';

@injectable()
export class GetHealthUseCase {
  constructor(
    @inject(TYPES.HealthService)
    private readonly healthService: HealthService
  ) {}

  async execute(): Promise<HealthStatus> {
    return this.healthService.checkHealth();
  }
}
