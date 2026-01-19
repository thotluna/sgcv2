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
import { RolesRoutes } from '@roles/infrastructure/http/roles.routes';
import { ListService } from '@roles/domain/list.service';
import { ListRolesUseCase } from '@roles/application/list-roles.use-case';
import { GetRoleUseCase } from '@roles/application/get-role.use-case';
import { GetRoleService } from '@roles/domain/get.role.service';
import { UpdateRoleUseCase } from '@roles/application/update-role.use-case';
import { UpdateRoleService } from '@roles/domain/update.role.service';
import { DeleteRoleUseCase } from '@roles/application/delete-role.use-case';
import { DeleteRoleService } from '@roles/domain/delete.role.service';
import { ListPermissionsUseCase } from '@roles/application/list-permissions.use-case';
import { ListPermissionsService } from '@roles/domain/list-permissions.service';
import { AddPermissionsToRoleUseCase } from '@roles/application/add-permissions-to-role.use-case';
import { RemovePermissionsFromRoleUseCase } from '@roles/application/remove-permissions-from-role.use-case';
import { PermissionAssignmentService } from '@roles/domain/permission-assignment.service';

export const rolesContainerModule = new ContainerModule((option: ContainerModuleLoadOptions) => {
  option.bind<RoleRepository>(TYPES.RoleRepository).to(RolesPrismaRepository);
  option.bind<PermissionRepository>(TYPES.PermissionRepository).to(PermissionsPrismaRepository);
  option.bind<CreateService>(TYPES.CreateService).to(RolesService);
  option.bind<CreateRoleUseCase>(TYPES.CreateRoleUseCase).to(CreateRoleUseCase);
  option.bind<RolesController>(TYPES.RolesController).to(RolesController);
  option.bind<RolesRoutes>(TYPES.RolesRoutes).to(RolesRoutes);
  option.bind<ListRolesUseCase>(TYPES.ListRoleUseCase).to(ListRolesUseCase);
  option.bind<ListService>(TYPES.ListService).to(RolesService);
  option.bind<GetRoleUseCase>(TYPES.GetRoleUseCase).to(GetRoleUseCase);
  option.bind<GetRoleService>(TYPES.GetRoleService).to(RolesService);
  option.bind<UpdateRoleUseCase>(TYPES.UpdateRoleUseCase).to(UpdateRoleUseCase);
  option.bind<UpdateRoleService>(TYPES.UpdateRoleService).to(RolesService);
  option.bind<DeleteRoleUseCase>(TYPES.DeleteRoleUseCase).to(DeleteRoleUseCase);
  option.bind<DeleteRoleService>(TYPES.DeleteRoleService).to(RolesService);
  option.bind<ListPermissionsUseCase>(TYPES.ListPermissionsUseCase).to(ListPermissionsUseCase);
  option.bind<ListPermissionsService>(TYPES.ListPermissionsService).to(RolesService);
  option
    .bind<AddPermissionsToRoleUseCase>(TYPES.AddPermissionsToRoleUseCase)
    .to(AddPermissionsToRoleUseCase);
  option
    .bind<RemovePermissionsFromRoleUseCase>(TYPES.RemovePermissionsFromRoleUseCase)
    .to(RemovePermissionsFromRoleUseCase);
  option.bind<PermissionAssignmentService>(TYPES.PermissionAssignmentService).to(RolesService);
});
