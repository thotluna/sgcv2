import { PermissionEntity } from '@modules/permissions/domain/permissions.entity';

export interface GetPermissions {
  findPermissionById(id: number): Promise<PermissionEntity | null>;
}
