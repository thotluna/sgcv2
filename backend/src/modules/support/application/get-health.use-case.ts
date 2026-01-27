import { TYPES } from '@modules/support/di/types';
import { inject, injectable } from 'inversify';

import { HealthStatus } from '@sgcv2/shared';

import { HealthService } from '../domain/services/health.service';

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
