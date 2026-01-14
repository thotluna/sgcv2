import { UserStatus } from '../types';

export class CreateUserDto {
  username!: string;
  email!: string;
  password!: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  roleIds?: number[];
  isActive?: UserStatus;
}

export class UpdateUserDto {
  email?: string;
  password?: string; // Only if changing password
  currentPassword?: string; // Required when changing password
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isActive?: UserStatus; // Status
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
  avatar?: string;
}

export interface RoleDto {
  id: number;
  name: string;
}

export class UserWithRolesDto extends UserDto {
  roles?: RoleDto[];
}

export interface UserFilterDto {
  search?: string;
  status?: UserStatus;
  pagination?: {
    limit: number;
    offset: number;
  };
}
