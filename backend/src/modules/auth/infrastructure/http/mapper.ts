import { AuthUser } from '@auth/domain/auth-user';

import { AuthenticatedUserDto } from '@sgcv2/shared/src/dtos/auth.dto';

export class AuthMapper {
  static toAuthenticatedUserDto(user: AuthUser): AuthenticatedUserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      roles: user.roles,
      permissions: user.permissions,
    };
  }
}
