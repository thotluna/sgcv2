export interface AuthService {
  comparePassword(password: string, userPasswordHash: string): Promise<boolean>;
  generateToken(user: { id: number; username: string }): Promise<{ access_token: string }>;
}
