import { TYPES } from '@permissions/di/types';
import { PermissionFilterInput } from '@permissions/domain/inputs/permission.input';
import { ListPermissionsService } from '@permissions/domain/list-permissions.service';
import { PermissionEntity } from '@permissions/domain/permissions.entity';
import { inject, injectable } from 'inversify';

@injectable()
export class ListPermissionsUseCase {
  constructor(
    @inject(TYPES.ListPermissionsService) private readonly service: ListPermissionsService
  ) {}

  async execute(filter?: PermissionFilterInput): Promise<PermissionEntity[]> {
    return this.service.getAllPermissions(filter);
  }
}
