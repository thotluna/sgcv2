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
