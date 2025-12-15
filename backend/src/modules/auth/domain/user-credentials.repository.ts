import { AuthUser } from './auth-user';

export interface UserCredentialsRepository {
  findByUsernameForAuth(username: string): Promise<AuthUser | null>;
}
