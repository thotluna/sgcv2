import { PermissionEntity } from '@permissions/domain/permissions.entity';

export const mockPermission: PermissionEntity = {
  id: 1,
  resource: 'users',
  action: 'read',
  description: 'Read users',
  createdAt: new Date(),
  updatedAt: new Date(),
};
