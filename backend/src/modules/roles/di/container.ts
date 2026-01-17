import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';
import { RoleRepository } from '@roles/domain/role.repository';
import { TYPES } from '@roles/di/types';
import { RolesPrismaRepository } from '@roles/infrastructure/persist/roles-prisma.repository';
import { PermissionRepository } from '@roles/domain/permission.repository';
import { PermissionsPrismaRepository } from '@roles/infrastructure/persist/permissions-prisma.repository';
import { CreateService } from '@roles/domain/create.service';
import { RolesService } from '@roles/infrastructure/http/roles.service';
import { CreateRoleUseCase } from '@roles/application/create.use-case';
import { RolesController } from '@roles/infrastructure/http/roles.controller';

export const rolesContainerModule = new ContainerModule((option: ContainerModuleLoadOptions) => {
  option.bind<RoleRepository>(TYPES.RoleRepository).to(RolesPrismaRepository);
  option.bind<PermissionRepository>(TYPES.PermissionRepository).to(PermissionsPrismaRepository);
  option.bind<CreateService>(TYPES.CreateService).to(RolesService);
  option.bind<CreateRoleUseCase>(TYPES.CreateRoleUseCase).to(CreateRoleUseCase);
  option.bind<RolesController>(TYPES.RolesController).to(RolesController);
});
