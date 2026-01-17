import { UserEntity } from '../user-entity';
import { UserState } from '../types';

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  status?: UserState;
}

export type UpdateUserInput = Partial<
  Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'>
> & {
  password?: string;
  currentPassword?: string;
  roleIds?: number[];
};

export interface UpdateUserPersistenceInput {
  email?: string;
  passwordHash?: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
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

export interface PaginatedUsers {
  users: UserEntity[];
  total: number;
}
