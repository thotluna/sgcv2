import { PermissionEntity } from '@permissions/domain/permissions.entity';
import { Permission, Role } from '@prisma/client';
import { RoleEntity } from '@roles/domain/roles.entity';
import { RoleWithPermissionsModel } from '@roles/infrastructure/persist/include';

export class RoleEntityModelMapper {
  static toPermissionEntity(model: Permission): PermissionEntity {
    return {
      id: model.id,
      resource: model.resource,
      action: model.action,
      description: model.description || undefined,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  static toRoleEntity(model: Role): RoleEntity {
    return {
      id: model.id,
      name: model.name,
      description: model.description || undefined,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  static toRoleWithPermissionsEntity(model: RoleWithPermissionsModel): RoleEntity {
    return {
      ...this.toRoleEntity(model),
      permissions: model.permissions.map(rp => this.toPermissionEntity(rp.permission)),
    };
  }
}
