import {
  CreateRoleInput,
  RoleFilterInput,
  UpdateRoleInput,
} from '@roles/domain/inputs/roles.input';
import { RoleEntity } from '@roles/domain/roles.entity';

import {
  CreateRoleDto,
  RoleDto,
  RoleFilterDto,
  RoleWithPermissionsDto,
  UpdateRoleDto,
} from '@sgcv2/shared';

export class RolesMapper {
  static toCreateInput(dto: CreateRoleDto): CreateRoleInput {
    return {
      name: dto.name,
      description: dto.description,
      permissionIds: dto.permissionIds || [],
    };
  }

  static toUpdateInput(dto: UpdateRoleDto): UpdateRoleInput {
    return {
      name: dto.name,
      description: dto.description,
      permissionIds: dto.permissionIds,
    };
  }

  static toFilterInput(dto: RoleFilterDto): RoleFilterInput {
    return {
      search: dto.search,
      page: dto.pagination ? Math.floor(dto.pagination.offset / dto.pagination.limit) + 1 : 1,
      limit: dto.pagination?.limit || 10,
    };
  }

  static toDto(entity: RoleEntity): RoleDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toWithPermissionsDto(entity: RoleEntity): RoleWithPermissionsDto {
    return {
      ...this.toDto(entity),
      permissions: (entity.permissions || []).map(p => ({
        id: p.id,
        resource: p.resource,
        action: p.action,
        description: p.description,
      })),
    };
  }
}
