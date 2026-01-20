import { RoleEntity, PermissionEntity } from '@roles/domain/roles.entity';

export const mockPermission: PermissionEntity = {
  id: 1,
  resource: 'users',
  action: 'read',
  description: 'Read users',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockRole: RoleEntity = {
  id: 1,
  name: 'Admin',
  description: 'Administrator role',
  createdAt: new Date(),
  updatedAt: new Date(),
  permissions: [mockPermission],
};
