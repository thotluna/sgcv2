export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export interface UserBasic {
  id: number;
  username: string;
  email: string;
  isActive: UserStatus | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleBasic {
  id: number;
  name: string;
  description: string | null;
}

export interface PermissionBasic {
  id: number;
  resource: string;
  action: string;
  description: string | null;
}

export interface UserWithRoles {
  user: UserBasic;
  roles: RoleBasic[];
  permissions: PermissionBasic[];
}
