import { RoleEntity } from '@roles/domain/roles.entity';
import { PaginationResult } from '@shared/domain/pagination';

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

export type PaginatedRoles = PaginationResult<RoleEntity>;

export interface ManagePermissionsInput {
  roleId: number;
  permissionIds: number[];
}
