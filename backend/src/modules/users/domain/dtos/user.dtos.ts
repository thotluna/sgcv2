import { UserState } from '../types';

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
  username?: string;
  email?: string;
  status?: UserState;
  roleId?: number;
  pagination?: {
    limit: number;
    offset: number;
  };
}
