import { inject, injectable } from 'inversify';
import { ListPermissionsService } from '@roles/domain/list-permissions.service';
import { TYPES } from '@roles/di/types';
import { PermissionEntity } from '@roles/domain/roles.entity';

@injectable()
export class ListPermissionsUseCase {
  constructor(
    @inject(TYPES.ListPermissionsService) private readonly service: ListPermissionsService
  ) {}

  async execute(): Promise<PermissionEntity[]> {
    return this.service.getAllPermissions();
  }
}
