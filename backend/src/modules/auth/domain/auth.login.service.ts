export interface AuthLoginService {
  comparePassword(password: string, hash: string): Promise<boolean>;
  generateToken(user: { id: number; username: string }): Promise<{ access_token: string }>;
}
