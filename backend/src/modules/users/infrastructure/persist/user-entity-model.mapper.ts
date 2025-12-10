import { User } from '@prisma/client';
import { UserEntity } from '../../domain/user-entity';

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
}
