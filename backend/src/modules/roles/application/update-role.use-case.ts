import { inject, injectable } from 'inversify';
import { UpdateRoleService } from '@roles/domain/update.role.service';
import { TYPES } from '@roles/di/types';
import { UpdateRoleInput } from '@roles/domain/inputs/roles.input';
import { RoleEntity } from '@roles/domain/roles.entity';
import { GetRoleService } from '@roles/domain/get.role.service';
import { RoleNotFoundException } from '@roles/domain/exceptions/role-not-found-exception';
import { RoleAlreadyExistsException } from '@roles/domain/exceptions/role-already-exists-exception';
import { PermissionNotFoundException } from '@roles/domain/exceptions/permission-not-found-exception';

@injectable()
export class UpdateRoleUseCase {
  constructor(
    @inject(TYPES.UpdateRoleService) private readonly service: UpdateRoleService,
    @inject(TYPES.GetRoleService) private readonly getService: GetRoleService
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
        data.permissionIds.map(pid => this.service.findPermissionById(pid))
      );
      const missingIndex = permissionsResults.findIndex(p => p === null);
      if (missingIndex !== -1) {
        throw new PermissionNotFoundException(data.permissionIds[missingIndex]);
      }
    }

    return this.service.update(id, data);
  }
}
