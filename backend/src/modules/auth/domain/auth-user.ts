import { UserStatus } from '@sgcv2/shared';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  status: UserStatus;
  roles: string[]; // Added roles for RBAC
  permissions: string[];
}
