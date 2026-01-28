import { TYPES as PERMISSION_TYPES } from '@permissions/di/types';
import { PermissionNotFoundException } from '@permissions/domain/exceptions/permission-not-found-exception';
import { GetPermissions } from '@permissions/domain/get-permissions.service';
import { PermissionEntity } from '@permissions/domain/permissions.entity';
import { TYPES } from '@roles/di/types';
import { RoleNotFoundException } from '@roles/domain/exceptions/role-not-found-exception';
import { GetRoleService } from '@roles/domain/get.role.service';
import { PermissionAssignmentService } from '@roles/domain/permission-assignment.service';
import { inject, injectable } from 'inversify';

@injectable()
export class AddPermissionsToRoleUseCase {
  constructor(
    @inject(TYPES.PermissionAssignmentService)
    private readonly service: PermissionAssignmentService,
    @inject(TYPES.GetRoleService) private readonly getRoleService: GetRoleService,
    @inject(PERMISSION_TYPES.GetPermissionsService)
    private readonly getPermissionsService: GetPermissions
  ) {}

  async execute(roleId: number, permissionIds: number[]): Promise<void> {
    const role = await this.getRoleService.getRole(roleId);
    if (!role) {
      throw new RoleNotFoundException(roleId);
    }

    const permissionsResults = await Promise.all(
      permissionIds.map(id => this.getPermissionsService.findPermissionById(id))
    );

    const missingIndex = permissionsResults.findIndex((p: PermissionEntity | null) => p === null);
    if (missingIndex !== -1) {
      throw new PermissionNotFoundException(permissionIds[missingIndex]);
    }

    await this.service.addPermissions(roleId, permissionIds);
  }
}
