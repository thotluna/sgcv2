import { ValidationService } from '@auth/domain/validation-service';
import { TYPES } from '@modules/auth/di/types';
import { AuthLoginService } from '@modules/auth/domain/auth.login.service';
import { InvalidPasswordException } from '@modules/auth/domain/exceptions/invalid-password.exception';
import { UserFinderForAuth } from '@modules/auth/domain/user-finder-for-auth';
import { AuthUserNotFoundException } from '@auth/domain/exceptions/auth-user-not-found.exception';
import { UserDto } from '@sgcv2/shared';
import { inject, injectable } from 'inversify';

@injectable()
export class ValidationServiceImpl implements ValidationService {
  constructor(
    @inject(TYPES.UserFinderForAuth) private userRepository: UserFinderForAuth,
    @inject(TYPES.AuthLoginService) private authLoginService: AuthLoginService
  ) {}

  async validateUser(username: string, password: string): Promise<UserDto> {
    const user = await this.userRepository.findByUsernameForAuth(username);
    if (!user) {
      throw new AuthUserNotFoundException(username);
    }

    const isValidPassword = await this.authLoginService.comparePassword(
      password,
      user.passwordHash
    );
    if (!isValidPassword) {
      throw new InvalidPasswordException();
    }

    return {
      id: user.id,
      username: user.username,
      email: '', // Not available in AuthUser
      firstName: '', // Not available in AuthUser
      lastName: '', // Not available in AuthUser
      createdAt: new Date(), // Not available in AuthUser
      updatedAt: new Date(), // Not available in AuthUser
      isActive: user.status,
    };
  }
}
