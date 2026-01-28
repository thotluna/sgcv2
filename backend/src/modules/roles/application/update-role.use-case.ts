import { TYPES as PERMISSION_TYPES } from '@permissions/di/types';
import { PermissionNotFoundException } from '@permissions/domain/exceptions/permission-not-found-exception';
import { GetPermissions } from '@permissions/domain/get-permissions.service';
import { PermissionEntity } from '@permissions/domain/permissions.entity';
import { TYPES } from '@roles/di/types';
import { RoleAlreadyExistsException } from '@roles/domain/exceptions/role-already-exists-exception';
import { RoleNotFoundException } from '@roles/domain/exceptions/role-not-found-exception';
import { GetRoleService } from '@roles/domain/get.role.service';
import { UpdateRoleInput } from '@roles/domain/inputs/roles.input';
import { RoleEntity } from '@roles/domain/roles.entity';
import { UpdateRoleService } from '@roles/domain/update.role.service';
import { inject, injectable } from 'inversify';

@injectable()
export class UpdateRoleUseCase {
  constructor(
    @inject(TYPES.UpdateRoleService) private readonly service: UpdateRoleService,
    @inject(TYPES.GetRoleService) private readonly getService: GetRoleService,
    @inject(PERMISSION_TYPES.GetPermissionsService)
    private readonly getPermissionsService: GetPermissions
  ) {}

  async execute(id: number, data: UpdateRoleInput): Promise<RoleEntity> {
    const role = await this.getService.getRole(id);
    if (!role) {
      throw new RoleNotFoundException(id);
    }

    if (data.name && data.name !== role.name) {
      const existingRole = await this.service.findByName(data.name);
      if (existingRole) {
        throw new RoleAlreadyExistsException(data.name);
      }
    }

    if (data.permissionIds && data.permissionIds.length > 0) {
      const permissionsResults = await Promise.all(
        data.permissionIds.map(pid => this.getPermissionsService.findPermissionById(pid))
      );
      const missingIndex = permissionsResults.findIndex((p: PermissionEntity | null) => p === null);
      if (missingIndex !== -1) {
        throw new PermissionNotFoundException(data.permissionIds[missingIndex]);
      }
    }

    return this.service.update(id, data);
  }
}
