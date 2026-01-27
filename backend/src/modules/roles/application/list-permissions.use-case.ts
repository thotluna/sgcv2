import { TYPES } from '@roles/di/types';
import { ListPermissionsService } from '@roles/domain/list-permissions.service';
import { PermissionEntity } from '@roles/domain/roles.entity';
import { inject, injectable } from 'inversify';

@injectable()
export class ListPermissionsUseCase {
  constructor(
    @inject(TYPES.ListPermissionsService) private readonly service: ListPermissionsService
  ) {}

  async execute(): Promise<PermissionEntity[]> {
    return this.service.getAllPermissions();
  }
}
