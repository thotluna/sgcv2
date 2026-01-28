import { PermissionEntity } from '@permissions/domain/permissions.entity';
import { Permission } from '@prisma/client';

export class PermissionEntityModelMapper {
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
}
