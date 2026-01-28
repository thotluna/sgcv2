import { TYPES } from '@permissions/di/types';
import { GetPermissions } from '@permissions/domain/get-permissions.service';
import { PermissionFilterInput } from '@permissions/domain/inputs/permission.input';
import { ListPermissionsService } from '@permissions/domain/list-permissions.service';
import { PermissionRepository } from '@permissions/domain/permission.repository';
import { PermissionEntity } from '@permissions/domain/permissions.entity';
import { inject, injectable } from 'inversify';

@injectable()
export class PermissionsService implements ListPermissionsService, GetPermissions {
  constructor(
    @inject(TYPES.PermissionRepository)
    private readonly permissionRepository: PermissionRepository
  ) {}

  async getAllPermissions(filter?: PermissionFilterInput): Promise<PermissionEntity[]> {
    return this.permissionRepository.getAll(filter);
  }

  async findPermissionById(id: number): Promise<PermissionEntity | null> {
    return this.permissionRepository.findById(id);
  }
}
