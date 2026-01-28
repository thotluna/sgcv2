import { PermissionEntity } from '@permissions/domain/permissions.entity';

export interface RoleEntity {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  permissions?: PermissionEntity[];
}

export interface RolePermissionEntity {
  roleId: number;
  permissionId: number;
  assignedAt: Date;
}
