import { UserEntity } from '@modules/users/domain/user-entity';
import { UserDto } from '@sgcv2/shared';

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
}
