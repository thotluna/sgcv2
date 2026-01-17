import { UpdateUserPersistenceInput } from './dtos/user.dtos';
import { UserWithRolesEntity } from './user-entity';

export interface UpdateUserService {
  update(id: number, data: UpdateUserPersistenceInput): Promise<UserWithRolesEntity>;
  getUserWithRoles(userId: number): Promise<UserWithRolesEntity | null>;
}
