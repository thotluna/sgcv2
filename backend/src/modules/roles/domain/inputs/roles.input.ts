import { Paginated } from '@sgcv2/shared';
import { RoleEntity } from '@roles/domain/roles.entity';

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

export type PaginatedRoles = Paginated<RoleEntity>;

export interface ManagePermissionsInput {
  roleId: number;
  permissionIds: number[];
}
