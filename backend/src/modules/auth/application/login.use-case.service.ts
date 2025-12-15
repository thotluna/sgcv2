import { inject, injectable } from 'inversify';
import { InvalidPasswordException } from '@auth/domain/exceptions/invalid-password.exception';
import { TYPES } from '@auth/di/types';
import { LoginDto, UserTokenDto } from '@sgcv2/shared';
import { AuthenticatedUserDto } from '../infrastructure/http/authenticated-user.dto';
import { LoginService } from '../domain/login.service';
import { AuthMapper } from '../infrastructure/http/mapper';

@injectable()
export class LoginUseCaseService {
  private service: LoginService;

  constructor(@inject(TYPES.LoginService) service: LoginService) {
    this.service = service;
  }

  async execute(loginDto: LoginDto): Promise<UserTokenDto<AuthenticatedUserDto>> {
    const { username, password } = loginDto;

    const user = await this.service.validateCredentials(username, password);

    if (!user) {
      throw new InvalidPasswordException();
    }

    const token = await this.service.generateToken({ id: user.id, username: user.username });

    return {
      user: AuthMapper.toAuthenticatedUserDto(user),
      token: token,
    } as UserTokenDto<AuthenticatedUserDto>;
  }
}
