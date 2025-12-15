import { AuthenticatedUserDto } from '@auth/infrastructure/http/authenticated-user.dto';
import { UserEntity } from '@users/domain/user-entity';
import { UserDto } from '@sgcv2/shared';
import { UserWithRolesModel } from '@users/infrastructure/persist/include';
import { AuthUser } from '@modules/auth/domain/auth-user';

export class UsersMapper {
  static toUserDto(user: UserEntity): UserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isActive: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  static toAuthenticatedUserDto(user: UserWithRolesModel): AuthenticatedUserDto {
    return {
      id: user.id,
      username: user.username,
      status: user.isActive || 'ACTIVE',
      roles: user.roles.map(ur => ur.role.name),
    };
  }

  static toAuthUser(user: UserWithRolesModel): AuthUser {
    return {
      id: user.id,
      username: user.username,
      passwordHash: user.passwordHash,
      status: user.isActive || 'ACTIVE',
      roles: user.roles.map(ur => ur.role.name),
    };
  }
}
