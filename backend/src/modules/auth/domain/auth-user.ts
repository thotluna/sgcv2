export type AuthUserState = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  status: AuthUserState;
  roles: string[]; // Added roles for RBAC
}
