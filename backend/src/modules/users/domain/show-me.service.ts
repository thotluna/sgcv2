import { UserWithRolesEntity } from './user-entity';

export interface ShowMeService {
  getUserWithRoles(id: number): Promise<UserWithRolesEntity | null>;
}
