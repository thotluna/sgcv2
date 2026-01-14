import { UserState } from '../types';

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isActive?: UserState;
}

export interface UpdateMeInput {
  email?: string;
  password?: string;
  currentPassword?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  status?: UserState;
  roleIds?: number[];
}

export interface UserFilterInput {
  search?: string;
  status?: UserState;
  pagination?: {
    limit: number;
    offset: number;
  };
}
import { UserEntity } from '../user-entity';

export interface PaginatedUsers {
  users: UserEntity[];
  total: number;
}
