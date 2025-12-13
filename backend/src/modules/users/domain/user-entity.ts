import { RoleEntity } from '@modules/roles/domain/roles.entity';
import { UserState } from './types';

export interface UserEntity {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  status: UserState;
}

export interface UserWithRolesEntity extends UserEntity {
  roles: RoleEntity[];
}
