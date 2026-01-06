import { RoleEntity } from '@modules/roles/domain/roles.entity';
import { UserState } from './types';

export interface UserEntity {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  status: UserState;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithRolesEntity extends UserEntity {
  roles: RoleEntity[];
}
