import { AuthUser } from './auth-user';

export interface AuthUserIdentityRepository {
  findByIdForAuth(sub: number): Promise<AuthUser | null>;
}
