import { HealthStatus } from '@sgcv2/shared';

export interface HealthService {
  checkHealth(): Promise<HealthStatus>;
}
