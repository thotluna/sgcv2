import { AuthUser } from './auth-user';

export interface LoginService {
  generateToken(payload: any): string;
  validateCredentials(username: string, password: string): Promise<AuthUser | null>;
}
