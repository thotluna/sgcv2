import { UserStatus } from '../types';

export class CreateUserDto {
  username!: string;
  email!: string;
  password!: string;
  roleIds?: number[];
}

export class UpdateUserDto {
  email?: string;
  password?: string; // Only if changing password
  isActive?: boolean; // Status
  roleIds?: number[];
}

export class UserDelete {
  id!: number;
  username!: string;
  isActive!: UserStatus;
}

export class UserDto {
  id!: number;
  username!: string;
  email!: string;
  firstName!: string | null;
  lastName!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
  isActive!: UserStatus;
}

export interface RoleDto {
  id: number;
  name: string;
}

export class UserWithRolesDto extends UserDto {
  roles?: RoleDto[];
}
