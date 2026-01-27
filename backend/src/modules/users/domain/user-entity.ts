import { RoleEntity } from '@modules/roles/domain/roles.entity';

import { UserStatus } from './user-status';

export interface UserEntity {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithRolesEntity extends UserEntity {
  roles: RoleEntity[];
  permissions: string[];
}
