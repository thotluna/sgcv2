import { inject, injectable } from 'inversify';
import { InvalidPasswordException } from '@auth/domain/exceptions/invalid-password.exception';
import { TYPES } from '@auth/di/types';
import { LoginService } from '../domain/login.service';
import { LoginInput, AuthResult } from '../domain/dtos/auth.domain.dtos';
import { AuthUser } from '../domain/auth-user';

@injectable()
export class LoginUseCaseService {
  private service: LoginService;

  constructor(@inject(TYPES.LoginService) service: LoginService) {
    this.service = service;
  }

  async execute(input: LoginInput): Promise<AuthResult<AuthUser>> {
    const { username, password } = input;

    const user = await this.service.validateCredentials(username, password);

    if (!user) {
      throw new InvalidPasswordException();
    }

    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
      permissions: user.permissions,
    };

    const token = await this.service.generateToken(payload);

    return {
      user: user,
      token: token,
    };
  }
}
