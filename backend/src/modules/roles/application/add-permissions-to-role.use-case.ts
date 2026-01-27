import { TYPES } from '@roles/di/types';
import { PermissionNotFoundException } from '@roles/domain/exceptions/permission-not-found-exception';
import { RoleNotFoundException } from '@roles/domain/exceptions/role-not-found-exception';
import { GetRoleService } from '@roles/domain/get.role.service';
import { PermissionAssignmentService } from '@roles/domain/permission-assignment.service';
import { inject, injectable } from 'inversify';

@injectable()
export class AddPermissionsToRoleUseCase {
  constructor(
    @inject(TYPES.PermissionAssignmentService)
    private readonly service: PermissionAssignmentService,
    @inject(TYPES.GetRoleService) private readonly getRoleService: GetRoleService
  ) {}

  async execute(roleId: number, permissionIds: number[]): Promise<void> {
    const role = await this.getRoleService.getRole(roleId);
    if (!role) {
      throw new RoleNotFoundException(roleId);
    }

    const permissionsResults = await Promise.all(
      permissionIds.map(id => this.service.findPermissionById(id))
    );

    const missingIndex = permissionsResults.findIndex(p => p === null);
    if (missingIndex !== -1) {
      throw new PermissionNotFoundException(permissionIds[missingIndex]);
    }

    await this.service.addPermissions(roleId, permissionIds);
  }
}
