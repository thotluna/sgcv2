import { PermissionEntity } from './permissions.entity';

export interface GetPermissions {
  findPermissionById(id: number): Promise<PermissionEntity | null>;
}
