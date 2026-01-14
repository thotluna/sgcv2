import { CreateUserInput, UserFilterInput, PaginatedUsers } from './dtos/user.dtos';
import { UserEntity, UserWithRolesEntity } from './user-entity';

export interface UserRepository {
  getAll(filter: UserFilterInput): Promise<PaginatedUsers>;
  findByUsername(username: string): Promise<UserEntity | null>;
  findById(id: number): Promise<UserEntity | null>;
  getUserWithRoles(userId: number): Promise<UserWithRolesEntity | null>;
  update(id: number, data: any): Promise<UserWithRolesEntity>;
  create(data: CreateUserInput): Promise<UserEntity>;
}
