import { TYPES } from '@roles/di/types';
import { RoleNotFoundException } from '@roles/domain/exceptions/role-not-found-exception';
import { GetRoleService } from '@roles/domain/get.role.service';
import { PermissionAssignmentService } from '@roles/domain/permission-assignment.service';
import { inject, injectable } from 'inversify';

@injectable()
export class RemovePermissionsFromRoleUseCase {
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

    await this.service.removePermissions(roleId, permissionIds);
  }
}
