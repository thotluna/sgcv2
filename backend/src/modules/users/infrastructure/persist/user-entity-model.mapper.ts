import { User } from '@prisma/client';
import { UserEntity, UserWithRolesEntity } from '../../domain/user-entity';
import { RoleEntity } from '@modules/roles/domain/roles.entity';
import { UserWithRolesModel } from './include';
import { UserStatus } from '@sgcv2/shared';

export class UserEntityModelMapper {
  static toEntity(userModel: User): UserEntity {
    return {
      id: userModel.id,
      username: userModel.username,
      email: userModel.email,
      passwordHash: userModel.passwordHash,
      firstName: userModel.firstName || '',
      lastName: userModel.lastName || '',
      status: userModel.isActive || 'ACTIVE',
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt,
    };
  }

  static toModel(userEntity: UserEntity): User {
    return {
      id: userEntity.id,
      username: userEntity.username,
      email: userEntity.email,
      passwordHash: userEntity.passwordHash,
      firstName: userEntity.firstName,
      lastName: userEntity.lastName,
      isActive: userEntity.status,
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    };
  }

  static toUserWithRolesDto(user: UserWithRolesModel): UserWithRolesEntity {
    const roles: RoleEntity[] = user.roles.map(ur => ({
      id: ur.role.id,
      name: ur.role.name,
      description: ur.role.description || '',
      createdAt: ur.role.createdAt,
      updatedAt: ur.role.updatedAt,
      permissions: ur.role.permissions.map(rp => ({
        id: rp.permission.id,
        resource: rp.permission.resource,
        action: rp.permission.action,
        description: rp.permission.description || '',
        createdAt: rp.permission.createdAt,
        updatedAt: rp.permission.updatedAt,
      })),
    }));

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      status: user.isActive as UserStatus,
      roles: roles,
    } satisfies UserWithRolesEntity;
  }
}
