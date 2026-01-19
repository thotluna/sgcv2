import { UserStatus } from '../user-status';
import { PaginationResult } from '@shared/domain/pagination';
import { UserEntity } from '../user-entity';

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  status?: UserStatus;
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
  status?: UserStatus;
  roleIds?: number[];
}

export interface UserFilterInput {
  search?: string;
  status?: UserStatus;
  pagination?: {
    limit: number;
    offset: number;
  };
}

export type PaginatedUsers = PaginationResult<UserEntity>;
