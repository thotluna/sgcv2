export interface RoleEntity {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  permissions: PermissionEntity[];
}

export interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  assignedAt: Date;
  permission: PermissionEntity[];
}

export interface PermissionEntity {
  id: number;
  resource: string;
  action: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
