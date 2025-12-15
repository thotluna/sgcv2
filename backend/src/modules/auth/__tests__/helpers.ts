import { AuthUser } from '@auth/domain/auth-user';
import { LoginDto, UserTokenDto } from '@sgcv2/shared';
import { AuthenticatedUserDto } from '../infrastructure/http/authenticated-user.dto';

export function getUserMock({ username, password }: LoginDto): AuthUser {
  return {
    id: 1,
    username: username,
    status: 'ACTIVE',
    passwordHash: password,
    roles: ['admin'],
  };
}

export const MOCK_LOGIN_REQUEST: LoginDto = {
  username: 'testuser',
  password: 'password123',
};

export const MOCK_USER_TOKEN_DTO: UserTokenDto<AuthenticatedUserDto> = {
  user: getUserMock(MOCK_LOGIN_REQUEST) as unknown as AuthenticatedUserDto,
  token: 'jwt-token-abc',
};
