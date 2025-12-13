export type AuthUserState = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export interface AuthUser {
  id: number;
  username: string;
  passwordHash: string;
  status: AuthUserState;
  roles: string[]; // Added roles for RBAC
}
