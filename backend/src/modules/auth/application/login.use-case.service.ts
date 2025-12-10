import { inject, injectable } from 'inversify';
import { InvalidPasswordException } from '@auth/domain/exceptions/invalid-password.exception';
import { TYPES } from '@auth/di/types';
import { AuthLoginService } from '@auth/domain/auth.login.service';
import { UserNotFoundException } from '@modules/users/domain/exceptions/user-no-found.exception';
import { TYPES as UserTypes } from '@modules/users/di/types';
import { UserRepository } from '@modules/users/domain/user-repository';
import { LoginDto, UserDto, UserTokenDto } from '@sgcv2/shared';

@injectable()
export class LoginUseCaseService {
  private userRepository: UserRepository;
  private authService: AuthLoginService;

  constructor(
    @inject(UserTypes.UserRepository) userRepository: UserRepository,
    @inject(TYPES.AuthLoginService) authLoginService: AuthLoginService
  ) {
    this.userRepository = userRepository;
    this.authService = authLoginService;
  }

  async execute(loginDto: LoginDto): Promise<UserTokenDto> {
    const { username, password } = loginDto;

    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new UserNotFoundException(username);
    }

    const isValidPassword = await this.authService.comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      throw new InvalidPasswordException();
    }

    const token = await this.authService.generateToken({ id: user.id, username: user.username });

    return {
      user: user as unknown as UserDto,
      token: token.access_token,
    } as UserTokenDto;
  }
}
