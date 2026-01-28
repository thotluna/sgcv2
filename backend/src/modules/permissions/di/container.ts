import { PermissionRepository } from '@permissions/domain/permission.repository';
import { PermissionsService } from '@permissions/domain/permissions.service';
import { PermissionsPrismaRepository } from '@permissions/infrastructure/persist/permissions-prisma.repository';
import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';

import { TYPES } from './types';

export const permissionsContainerModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options
      .bind<PermissionRepository>(TYPES.PermissionRepository)
      .to(PermissionsPrismaRepository)
      .inSingletonScope();
    options
      .bind<PermissionsService>(TYPES.PermissionsService)
      .to(PermissionsService)
      .inSingletonScope();
  }
);
