import { PermissionDto } from './permissions.dto';

export class RoleDto {
  id!: number;
  name!: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CreateRoleDto {
  name!: string;
  description?: string;
  permissionIds?: number[];
}

export class UpdateRoleDto {
  name?: string;
  description?: string;
}

export class RoleWithPermissionsDto extends RoleDto {
  permissions!: PermissionDto[];
}

export class RoleFilterDto {
  search?: string;
  pagination?: {
    limit: number;
    offset: number;
  };
}

export class ManageRolePermissionsDto {
  permissionIds!: number[];
}
