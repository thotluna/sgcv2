import { ListPermissionsUseCase } from '@permissions/application/list-permissions.use-case';
import { GetPermissions } from '@permissions/domain/get-permissions.service';
import { ListPermissionsService } from '@permissions/domain/list-permissions.service';
import { PermissionRepository } from '@permissions/domain/permission.repository';
import { PermissionsController } from '@permissions/infrastructure/http/permissions.controller';
import { PermissionsRoutes } from '@permissions/infrastructure/http/permissions.routes';
import { PermissionsService } from '@permissions/infrastructure/http/permissions.service';
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
      .bind<ListPermissionsUseCase>(TYPES.ListPermissionsUseCase)
      .to(ListPermissionsUseCase)
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

    options
      .bind<PermissionsController>(TYPES.PermissionsController)
      .to(PermissionsController)
      .inSingletonScope();

    options
      .bind<PermissionsRoutes>(TYPES.PermissionsRoutes)
      .to(PermissionsRoutes)
      .inSingletonScope();
  }
);
