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
