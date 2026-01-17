import { UserStatus } from '../types';

export class CreateUserDto {
  username!: string;
  email!: string;
  password!: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  roleIds?: number[];
  status?: UserStatus;
}

export type UpdateUserDto = Partial<Omit<UserDto, 'id' | 'createdAt' | 'updatedAt'>> & {
  password?: string;
  currentPassword?: string;
  roleIds?: number[];
};

export class UserDelete {
  id!: number;
  username!: string;
  status!: UserStatus;
}

export class UserDto {
  id!: number;
  username!: string;
  email!: string;
  firstName!: string | null;
  lastName!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
  status!: UserStatus;
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
