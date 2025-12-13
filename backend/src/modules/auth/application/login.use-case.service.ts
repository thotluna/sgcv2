import { inject, injectable } from 'inversify';
import { InvalidPasswordException } from '@auth/domain/exceptions/invalid-password.exception';
import { TYPES } from '@auth/di/types';
import { AuthLoginService } from '@auth/domain/auth.login.service';
import { AuthUserNotFoundException } from '@auth/domain/exceptions/auth-user-not-found.exception';
import { LoginDto, UserDto, UserTokenDto } from '@sgcv2/shared';
import { UserFinderForAuth } from '../domain/user-finder-for-auth';

@injectable()
export class LoginUseCaseService {
  private userRepository: UserFinderForAuth;
  private authService: AuthLoginService;

  constructor(
    @inject(TYPES.UserFinderForAuth) userRepository: UserFinderForAuth,
    @inject(TYPES.AuthLoginService) authLoginService: AuthLoginService
  ) {
    this.userRepository = userRepository;
    this.authService = authLoginService;
  }

  async execute(loginDto: LoginDto): Promise<UserTokenDto> {
    const { username, password } = loginDto;

    const user = await this.userRepository.findByUsernameForAuth(username);

    if (!user) {
      throw new AuthUserNotFoundException(username);
    }

    const isValidPassword = await this.authService.comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      throw new InvalidPasswordException();
    }

    const token = await this.authService.generateToken({ id: user.id, username: user.username });

    const userDto: UserDto = {
      id: user.id,
      username: user.username,
      email: '', // Not in AuthUser
      firstName: '', // Not in AuthUser
      lastName: '', // Not in AuthUser
      createdAt: new Date(), // Not in AuthUser
      updatedAt: new Date(), // Not in AuthUser
      isActive: user.status,
    };

    return {
      user: userDto,
      token: token.access_token,
    } as UserTokenDto;
  }
}
