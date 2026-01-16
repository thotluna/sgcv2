import { UserWithRolesEntity } from './user-entity';

export interface ShowUserService {
  getUserWithRoles(id: number): Promise<UserWithRolesEntity | null>;
}
