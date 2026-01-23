import { ContainerModule } from 'inversify';
import { TYPES } from './types';
import { HealthCheckRepository } from '../domain/repositories/health-check.repository';
import { PrismaHealthCheckRepository } from '../infrastructure/persist/prisma-health-check.repository';
import { GetHealthUseCase } from '../application/get-health.use-case';
import { HealthService } from '../domain/services/health.service';
import { HealthServiceImpl } from '../domain/services/health.service.impl';
import { HealthController } from '../infrastructure/http/health.controller';
import { SupportRoutes } from '../infrastructure/http/support.routes';

export const supportContainerModule = new ContainerModule(options => {
  options.bind<HealthCheckRepository>(TYPES.HealthCheckRepository).to(PrismaHealthCheckRepository);
  options.bind<HealthService>(TYPES.HealthService).to(HealthServiceImpl);
  options.bind<GetHealthUseCase>(TYPES.GetHealthUseCase).to(GetHealthUseCase);
  options.bind<HealthController>(TYPES.HealthController).to(HealthController);
  options.bind<SupportRoutes>(TYPES.SupportRoutes).to(SupportRoutes);
});
