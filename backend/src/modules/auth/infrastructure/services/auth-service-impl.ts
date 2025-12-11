import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthLoginService } from '@auth/domain/auth.login.service';
import { AuthService } from '@auth/domain/auth-service';

@injectable()
export class AuthServiceImpl implements AuthService, AuthLoginService {
  private readonly SALT_ROUNDS = 10;
  constructor() {}

  hashPassword(password: string) {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  comparePassword(password: string, userPasswordHash: string) {
    return bcrypt.compare(password, userPasswordHash);
  }

  async generateToken(user: { id: number; username: string }) {
    const payload = { sub: user.id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    return { access_token: token };
  }
}
