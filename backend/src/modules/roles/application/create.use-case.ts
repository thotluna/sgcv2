import { TYPES as PERMISSION_TYPES } from '@permissions/di/types';
import { PermissionNotFoundException } from '@permissions/domain/exceptions/permission-not-found-exception';
import { GetPermissions } from '@permissions/domain/get-permissions.service';
import { PermissionEntity } from '@permissions/domain/permissions.entity';
import { TYPES } from '@roles/di/types';
import { CreateService } from '@roles/domain/create.service';
import { RoleAlreadyExistsException } from '@roles/domain/exceptions/role-already-exists-exception';
import { CreateRoleInput } from '@roles/domain/inputs/roles.input';
import { RoleEntity } from '@roles/domain/roles.entity';
import { inject, injectable } from 'inversify';

@injectable()
export class CreateRoleUseCase {
  constructor(
    @inject(TYPES.CreateService) private readonly service: CreateService,
    @inject(PERMISSION_TYPES.GetPermissionsService)
    private readonly getPermissionsService: GetPermissions
  ) {}

  async execute(data: CreateRoleInput): Promise<RoleEntity | null> {
    const existingRole = await this.service.findByName(data.name);

    if (existingRole) {
      throw new RoleAlreadyExistsException(data.name);
    }

    if (data.permissionIds && data.permissionIds.length > 0) {
      const permissionsResults = await Promise.all(
        data.permissionIds.map(id => this.getPermissionsService.findPermissionById(id))
      );

      const missingIndex = permissionsResults.findIndex((p: PermissionEntity | null) => p === null);
      if (missingIndex !== -1) {
        throw new PermissionNotFoundException(data.permissionIds[missingIndex]);
      }
    }

    return await this.service.create(data);
  }
}
