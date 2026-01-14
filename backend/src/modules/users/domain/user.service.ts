import { UserEntity, UserWithRolesEntity } from './user-entity';
import { CreateUserInput } from './dtos/user.dtos';

export interface UsersService {
  getUserWithRoles(userId: number): Promise<UserWithRolesEntity | null>;
  updateUser(id: number, data: Partial<UserWithRolesEntity>): Promise<UserWithRolesEntity>;
  create(data: CreateUserInput): Promise<UserEntity>;
}
