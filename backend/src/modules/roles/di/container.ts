import { AddPermissionsToRoleUseCase } from '@roles/application/add-permissions-to-role.use-case';
import { DeleteRoleUseCase } from '@roles/application/delete-role.use-case';
import { GetRoleUseCase } from '@roles/application/get-role.use-case';
import { ListRolesUseCase } from '@roles/application/list-roles.use-case';
import { RemovePermissionsFromRoleUseCase } from '@roles/application/remove-permissions-from-role.use-case';
import { UpdateRoleUseCase } from '@roles/application/update-role.use-case';
import { TYPES } from '@roles/di/types';
import { CreateService } from '@roles/domain/create.service';
import { DeleteRoleService } from '@roles/domain/delete.role.service';
import { GetRoleService } from '@roles/domain/get.role.service';
import { ListService } from '@roles/domain/list.service';
import { PermissionAssignmentService } from '@roles/domain/permission-assignment.service';
import { RoleRepository } from '@roles/domain/role.repository';
import { UpdateRoleService } from '@roles/domain/update.role.service';
import { RolesController } from '@roles/infrastructure/http/roles.controller';
import { RolesRoutes } from '@roles/infrastructure/http/roles.routes';
import { RolesService } from '@roles/infrastructure/http/roles.service';
import { RolesPrismaRepository } from '@roles/infrastructure/persist/roles-prisma.repository';
import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';

import { CreateRoleUseCase } from '../application/create.use-case';

export const rolesContainerModule = new ContainerModule((option: ContainerModuleLoadOptions) => {
  option.bind<RoleRepository>(TYPES.RoleRepository).to(RolesPrismaRepository);
  option.bind<RolesController>(TYPES.RolesController).to(RolesController);
  option.bind<RolesRoutes>(TYPES.RolesRoutes).to(RolesRoutes);

  option.bind<ListRolesUseCase>(TYPES.ListRoleUseCase).to(ListRolesUseCase);
  option.bind<ListService>(TYPES.ListService).to(RolesService);

  option.bind<CreateRoleUseCase>(TYPES.CreateRoleUseCase).to(CreateRoleUseCase);

  option.bind<GetRoleUseCase>(TYPES.GetRoleUseCase).to(GetRoleUseCase);
  option.bind<GetRoleService>(TYPES.GetRoleService).to(RolesService);

  option.bind<UpdateRoleUseCase>(TYPES.UpdateRoleUseCase).to(UpdateRoleUseCase);
  option.bind<UpdateRoleService>(TYPES.UpdateRoleService).to(RolesService);

  option.bind<DeleteRoleUseCase>(TYPES.DeleteRoleUseCase).to(DeleteRoleUseCase);
  option.bind<DeleteRoleService>(TYPES.DeleteRoleService).to(RolesService);

  option.bind<CreateService>(TYPES.CreateService).to(RolesService);

  option
    .bind<AddPermissionsToRoleUseCase>(TYPES.AddPermissionsToRoleUseCase)
    .to(AddPermissionsToRoleUseCase);
  option
    .bind<RemovePermissionsFromRoleUseCase>(TYPES.RemovePermissionsFromRoleUseCase)
    .to(RemovePermissionsFromRoleUseCase);
  option.bind<PermissionAssignmentService>(TYPES.PermissionAssignmentService).to(RolesService);
});
