export interface IHealthCheckRepository {
  checkDatabase(): Promise<boolean>;
}
