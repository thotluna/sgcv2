import { RbacPrismaRepository } from '@modules/rbac/infrastructure/persist/rbac-prisma.repository';
import { RbacService } from '@modules/rbac/rbac.service';
import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';

import { TYPES } from './types';

export const rbacContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
  options.bind<RbacService>(TYPES.RbacService).to(RbacService).inSingletonScope();
  options
    .bind<RbacPrismaRepository>(TYPES.RbacRepository)
    .to(RbacPrismaRepository)
    .inSingletonScope();
});
