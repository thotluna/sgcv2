import { RoleEntity } from '../roles.entity';

export interface CreateRoleInput {
  name: string;
  description?: string;
  permissionIds: number[];
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  permissionIds?: number[];
}

export interface RoleFilterInput {
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedRoles {
  roles: RoleEntity[];
  total: number;
}

export interface ManagePermissionsInput {
  roleId: number;
  permissionIds: number[];
}
