import { AuthenticatedUserDto } from '@auth/infrastructure/http/authenticated-user.dto';
import { UserEntity, UserWithRolesEntity } from '@users/domain/user-entity';
import { UserDto, UserWithRolesDto } from '@sgcv2/shared';
import { UserWithRolesModel } from '@users/infrastructure/persist/include';
import { AuthUser } from '@modules/auth/domain/auth-user';

export class UsersMapper {
  static toUserWithRolesDto(userWithRoles: UserWithRolesEntity): UserWithRolesDto {
    return {
      id: userWithRoles.id,
      username: userWithRoles.username,
      email: userWithRoles.email,
      isActive: userWithRoles.status,
      createdAt: userWithRoles.createdAt,
      updatedAt: userWithRoles.updatedAt,
      firstName: userWithRoles.firstName,
      lastName: userWithRoles.lastName,
      roles: userWithRoles.roles.map(ur => ({
        id: ur.id,
        name: ur.name,
        description: ur.description,
      })),
    };
  }
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
