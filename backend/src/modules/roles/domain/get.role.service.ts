import { RoleEntity } from './roles.entity';

export interface GetRoleService {
  getRole(id: number): Promise<RoleEntity | null>;
}
