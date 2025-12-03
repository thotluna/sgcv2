import { User, Role, Permission } from '@prisma/client';

export type UserBasic = Pick<
  User,
  'id' | 'username' | 'email' | 'isActive' | 'createdAt' | 'updatedAt'
>;

export type RoleBasic = Pick<Role, 'id' | 'name' | 'description'>;

export type PermissionBasic = Pick<Permission, 'id' | 'resource' | 'action' | 'description'>;

export interface UserWithRoles {
  user: UserBasic;
  roles: RoleBasic[];
  permissions: PermissionBasic[];
}
