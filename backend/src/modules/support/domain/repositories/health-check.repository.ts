export interface HealthCheckRepository {
  checkDatabase(): Promise<boolean>;
}
