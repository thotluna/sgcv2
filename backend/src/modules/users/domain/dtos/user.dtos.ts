import { UserState } from '../types';

export interface CreateUserDto {
  username: string;
  email: string;
  password?: string; // Optional if created by admin without setting password initially, or if using a default
  firstName: string;
  lastName: string;
  roleIds: number[];
  status?: UserState;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
  firstName?: string;
  lastName?: string;
  roleIds?: number[];
  status?: UserState;
}

export interface UserFilter {
  username?: string;
  email?: string;
  status?: UserState;
  roleId?: number;
  skip?: number;
  take?: number;
}
