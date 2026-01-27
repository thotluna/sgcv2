import { UserEntity, UserWithRolesEntity } from './user-entity';
import {
  CreateUserInput,
  PaginatedUsers,
  UpdateUserPersistenceInput,
  UserFilterInput,
} from './dtos/user.dtos';

export interface UserRepository {
  getAll(filter: UserFilterInput): Promise<PaginatedUsers>;
  findByUsername(username: string): Promise<UserEntity | null>;
  findById(id: number): Promise<UserEntity | null>;
  getUserWithRoles(userId: number): Promise<UserWithRolesEntity | null>;
  update(id: number, data: UpdateUserPersistenceInput): Promise<UserWithRolesEntity>;
  create(data: CreateUserInput): Promise<UserEntity>;
}
