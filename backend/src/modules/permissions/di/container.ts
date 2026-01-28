import { GetPermissions } from '@permissions/domain/get-permissions.service';
import { ListPermissionsService } from '@permissions/domain/list-permissions.service';
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

    // Bind the same service to multiple interfaces if needed
    options
      .bind<ListPermissionsService>(TYPES.ListPermissionsService)
      .to(PermissionsService)
      .inSingletonScope();

    options
      .bind<GetPermissions>(TYPES.GetPermissionsService)
      .to(PermissionsService)
      .inSingletonScope();
  }
);
