import { inject, injectable } from 'inversify';
import { TYPES } from '@roles/di/types';
import { CreateService } from '@roles/domain/create.service';
import { CreateRoleInput } from '@roles/domain/inputs/roles.input';
import { RoleEntity } from '@roles/domain/roles.entity';
import { RoleAlreadyExistsException } from '@roles/domain/exceptions/role-already-exists-exception';
import { PermissionNotFoundException } from '@roles/domain/exceptions/permission-not-found-exception';

@injectable()
export class CreateRoleUseCase {
  constructor(@inject(TYPES.CreateService) private readonly service: CreateService) {}

  async execute(data: CreateRoleInput): Promise<RoleEntity | null> {
    const [existingRole, ...permissionsResults] = await Promise.all([
      this.service.findByName(data.name),
      ...data.permissionIds.map(id => this.service.findPermissionById(id)),
    ]);

    if (existingRole) {
      throw new RoleAlreadyExistsException(data.name);
    }

    const missingIndex = permissionsResults.findIndex(p => p === null);
    if (missingIndex !== -1) {
      throw new PermissionNotFoundException(data.permissionIds[missingIndex]);
    }

    return await this.service.create(data);
  }
}
