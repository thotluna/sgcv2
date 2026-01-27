import { AuthUser } from '@modules/auth/domain/auth-user';
import { CreateUserInput, UpdateUserInput } from '@modules/users/domain/dtos/user.dtos';
import { UserEntity, UserWithRolesEntity } from '@users/domain/user-entity';
import { UserWithRolesModel } from '@users/infrastructure/persist/include';

import { CreateUserDto, UpdateUserDto, UserDto, UserWithRolesDto } from '@sgcv2/shared';
import { AuthenticatedUserDto } from '@sgcv2/shared/src/dtos/auth.dto';

export class UsersMapper {
  static toUserWithRolesDto(userWithRoles: UserWithRolesEntity): UserWithRolesDto {
    return {
      id: userWithRoles.id,
      username: userWithRoles.username,
      email: userWithRoles.email,
      status: userWithRoles.status,
      createdAt: userWithRoles.createdAt,
      updatedAt: userWithRoles.updatedAt,
      firstName: userWithRoles.firstName,
      lastName: userWithRoles.lastName,
      roles: userWithRoles.roles.map(ur => ({
        id: ur.id,
        name: ur.name,
        description: ur.description,
      })),
      permissions: userWithRoles.permissions,
    };
  }
  static toUserDto(user: UserEntity): UserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      status: user.status,
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
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      status: user.status || 'ACTIVE',
      roles: user.roles.map(ur => ur.role.name),
      permissions: user.roles.flatMap(ur =>
        ur.role.permissions.map(p => p.permission.resource + '.' + p.permission.action)
      ),
    };
  }

  static toAuthUser(user: UserWithRolesModel): AuthUser {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      passwordHash: user.passwordHash,
      status: user.status || 'ACTIVE',
      roles: user.roles.map(ur => ur.role.name),
      permissions: user.roles.flatMap(ur =>
        ur.role.permissions.map(p => p.permission.resource + '.' + p.permission.action)
      ),
    };
  }
  static toCreateUserInput(dto: CreateUserDto): CreateUserInput {
    return {
      username: dto.username,
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      avatar: dto.avatar,
      status: dto.status,
    };
  }

  static toUpdateInput(dto: UpdateUserDto): UpdateUserInput {
    return {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      avatar: dto.avatar,
      status: dto.status,
      password: dto.password,
      currentPassword: dto.currentPassword,
      roleIds: dto.roleIds,
    };
  }
}
