import { UserWithRolesEntity } from './user-entity';
import { UpdateUserPersistenceInput } from './dtos/user.dtos';

export interface UpdateUserService {
  update(id: number, data: UpdateUserPersistenceInput): Promise<UserWithRolesEntity>;
  getUserWithRoles(userId: number): Promise<UserWithRolesEntity | null>;
}
