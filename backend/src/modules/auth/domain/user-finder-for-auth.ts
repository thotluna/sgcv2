import { AuthUser } from './auth-user';

export interface UserFinderForAuth {
  findByUsernameForAuth(username: string): Promise<AuthUser | null>;
}
