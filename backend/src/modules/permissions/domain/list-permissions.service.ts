import { PermissionFilterInput } from '@permissions/domain/inputs/permission.input';
import { PermissionEntity } from '@permissions/domain/permissions.entity';

export interface ListPermissionsService {
  getAllPermissions(filter?: PermissionFilterInput): Promise<PermissionEntity[]>;
}
