import { AuthUser } from '@auth/domain/auth-user';
import { AuthenticatedUserDto } from '@auth/infrastructure/http/authenticated-user.dto';

export class AuthMapper {
  static toAuthenticatedUserDto(user: AuthUser): AuthenticatedUserDto {
    return {
      id: user.id,
      username: user.username,
      status: user.status,
      roles: user.roles,
    };
  }
}
