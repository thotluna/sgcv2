import { PermissionEntity } from './roles.entity';

export interface ListPermissionsService {
  getAllPermissions(): Promise<PermissionEntity[]>;
}
