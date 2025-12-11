import { UserEntity } from '@modules/users/domain/user-entity';
import { LoginDto, UserDto, UserTokenDto } from '@sgcv2/shared';

export function getUserMock({ username, password }: LoginDto): UserEntity {
  return {
    id: 1,
    username: username,
    email: 'testuser@example.com',
    firstName: 'Test',
    lastName: 'User',
    status: 'ACTIVE',
    passwordHash: password,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export const MOCK_LOGIN_REQUEST: LoginDto = {
  username: 'testuser',
  password: 'password123',
};

export const MOCK_USER_TOKEN_DTO: UserTokenDto = {
  user: getUserMock(MOCK_LOGIN_REQUEST) as unknown as UserDto,
  token: 'jwt-token-abc',
};
