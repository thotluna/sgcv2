import { TYPES } from '@auth/di/types';
import { UserValidationService } from '@auth/domain/user-validation.service';
import { AuthUser } from '@modules/auth/domain/auth-user';
import { LoginService } from '@modules/auth/domain/login.service';
import { UserCredentialsRepository } from '@modules/auth/domain/user-credentials.repository';
import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import { PasswordHasher } from '../../domain/password-hasher';

@injectable()
export class AuthService implements UserValidationService, LoginService, PasswordHasher {
  private userRepository: UserCredentialsRepository;

  constructor(@inject(TYPES.UserCredentialsRepository) userRepository: UserCredentialsRepository) {
    this.userRepository = userRepository;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(payload: any): string {
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    return token;
  }

  async validateCredentials(username: string, password: string): Promise<AuthUser | null> {
    const user = await this.userRepository.findByUsernameForAuth(username);
    if (!user) {
      return null;
    }

    const isValidPassword = await this.comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      return null;
    }

    return user;
  }
}
